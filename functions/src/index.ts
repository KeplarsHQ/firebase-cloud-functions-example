import * as functions from "firebase-functions";

const KEPLARS_API_KEY = process.env.KEPLARS_API_KEY;
const KEPLARS_BASE_URL = "https://api.keplars.com/api/v1";

interface EmailRequest {
  to: string[];
  from?: string;
  fromName?: string;
  subject?: string;
  body?: string;
  html?: string;
  is_html?: boolean;
  template_id?: string;
  params?: Record<string, string | number>;
  delivery_type?: "instant" | "queue";
  scheduled_at?: string;
  timezone?: string;
}

interface KeplarsEmailPayload {
  to: string[];
  from?: string;
  fromName?: string;
  subject?: string;
  body?: string;
  html?: string;
  is_html?: boolean;
  template_id?: string;
  params?: Record<string, string | number>;
  scheduled_at?: string;
  timezone?: string;
}

interface KeplarsResponse {
  success: boolean;
  data?: {
    id: string;
    message: string;
  };
  error?: string;
  code?: string;
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validateEmailRequest(body: EmailRequest): {valid: boolean; error?: string} {
  if (!body.to || !Array.isArray(body.to) || body.to.length === 0) {
    return {
      valid: false,
      error: "Missing or invalid \"to\" field. Must be a non-empty array of email addresses.",
    };
  }

  for (const email of body.to) {
    if (!validateEmail(email)) {
      return {valid: false, error: `Invalid email address: ${email}`};
    }
  }

  if (body.template_id) {
    if (body.subject || body.body || body.html) {
      return {
        valid: false,
        error: "When using template_id, do not include subject, body, or html fields.",
      };
    }
  } else {
    if (!body.subject) {
      return {
        valid: false,
        error: "Missing \"subject\" field. Required when not using template_id.",
      };
    }
    if (!body.body && !body.html) {
      return {
        valid: false,
        error: "Missing email content. Provide either \"body\" or \"html\" field.",
      };
    }
  }

  if (body.delivery_type && !["instant", "queue"].includes(body.delivery_type)) {
    return {
      valid: false,
      error: "Invalid delivery_type. Must be either \"instant\" or \"queue\".",
    };
  }

  if (body.scheduled_at && body.delivery_type) {
    return {
      valid: false,
      error: "Cannot use both scheduled_at and delivery_type. " +
        "Use scheduled_at for scheduled emails, or delivery_type for instant/queue delivery.",
    };
  }

  if (body.scheduled_at) {
    const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;
    const simplifiedRegex = /^\d{4}-\d{2}-\d{2}_\d{2}:\d{2}:\d{2}/;
    if (!isoRegex.test(body.scheduled_at) && !simplifiedRegex.test(body.scheduled_at)) {
      return {
        valid: false,
        error: "Invalid scheduled_at format. " +
          "Use ISO 8601 (2026-01-20T10:00:00) or simplified (2026-01-20_10:00:00).",
      };
    }
  }

  return {valid: true};
}

export const keplarsEmail = functions.https.onRequest(async (req, res) => {
  // Enable CORS
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type");

  // Handle OPTIONS request for CORS preflight
  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({
      success: false,
      error: "Method not allowed. Use POST.",
    });
    return;
  }

  if (!KEPLARS_API_KEY) {
    functions.logger.error("KEPLARS_API_KEY environment variable is not set");
    res.status(500).json({
      success: false,
      error: "Server configuration error. API key not configured.",
    });
    return;
  }

  try {
    const body: EmailRequest = req.body;

    const validation = validateEmailRequest(body);
    if (!validation.valid) {
      res.status(400).json({
        success: false,
        error: validation.error,
      });
      return;
    }

    let endpoint: string;
    let deliveryType: string;

    if (body.scheduled_at) {
      endpoint = `${KEPLARS_BASE_URL}/send-email/schedule`;
      deliveryType = "scheduled";
    } else {
      deliveryType = body.delivery_type || "queue";
      endpoint = deliveryType === "instant" ?
        `${KEPLARS_BASE_URL}/send-email/instant` :
        `${KEPLARS_BASE_URL}/send-email/queue`;
    }

    const payload: KeplarsEmailPayload = {
      to: body.to,
    };

    if (body.from) payload.from = body.from;
    if (body.fromName) payload.fromName = body.fromName;

    if (body.template_id) {
      payload.template_id = body.template_id;
      if (body.params) payload.params = body.params;
    } else {
      payload.subject = body.subject;
      if (body.html) {
        payload.html = body.html;
        payload.is_html = true;
      } else {
        payload.body = body.body;
        payload.is_html = body.is_html || false;
      }
    }

    if (body.scheduled_at) {
      payload.scheduled_at = body.scheduled_at;
      if (body.timezone) payload.timezone = body.timezone;
    }

    functions.logger.info(`Sending email via ${deliveryType} endpoint to:`, body.to);

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${KEPLARS_API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    const responseText = await response.text();
    functions.logger.info("Raw API response:", responseText);

    let data: KeplarsResponse;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      functions.logger.error("Failed to parse API response:", parseError);
      res.status(500).json({
        success: false,
        error: "Invalid response from email service",
        details: responseText.substring(0, 200),
      });
      return;
    }

    if (!response.ok) {
      functions.logger.error("Keplars API error:", data);
      res.status(response.status).json({
        success: false,
        error: data.error || "Failed to send email",
        code: data.code,
      });
      return;
    }

    functions.logger.info("Email sent successfully:", data.data?.id);

    res.status(200).json(data);
  } catch (error) {
    functions.logger.error("Error processing request:", error);

    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";

    res.status(500).json({
      success: false,
      error: errorMessage,
    });
  }
});
