# Keplars + Firebase Cloud Functions Integration

Hey! 👋 This is a working example of how to send emails using Keplars with Firebase Cloud Functions. I built this because setting up transactional emails can be a pain, and I wanted to make it as simple as possible.

## What is this?

It's a Firebase Cloud Function that connects to Keplars email service. You can send emails in multiple ways:
1. **Template-based** - Create reusable templates in Keplars dashboard with variables like `{{user_name}}`
2. **Raw HTML/Text** - Send custom HTML or plain text emails directly without templates
3. **Scheduled emails** - Schedule emails to be sent at a specific time in the future

Use it for:
- Welcome emails
- Password resets
- Verification codes
- Order confirmations
- Newsletter campaigns (scheduled)
- Birthday emails (scheduled)
- Pretty much any transactional or scheduled email you need

The best part? Emails are delivered in 0-5 seconds if you use instant mode, queued for regular delivery, or scheduled for future sending with timezone support.

## What you'll need

Before you start, make sure you have:
- A [Firebase](https://firebase.google.com) account (free tier works fine)
- A [Keplars](https://dash.keplars.com) account (also free to start)
- [Firebase CLI](https://firebase.google.com/docs/cli) installed on your machine
- [Node.js](https://nodejs.org) 18 or higher

That's it. No credit card required to test things out.

## Getting Started

### Step 1: Set up Keplars

First, you need to create a Keplars account and connect your email:

1. Head to [dash.keplars.com](https://dash.keplars.com) and sign up
2. Connect your email provider - either Gmail or Outlook (it uses OAuth, so it's secure)
3. Create an email template (optional):
   - Click on **Templates** in the sidebar
   - Hit **Create Template**
   - Design your email and add variables like `{{user_name}}` or `{{verification_code}}`
   - Save it and copy the template ID (you'll need this)
4. Generate an API key:
   - Go to **API Keys**
   - Click **Generate API Key**
   - Copy the key somewhere safe (it starts with `kms_`)

### Step 2: Clone this repo

```bash
git clone https://github.com/KeplarsHQ/firebase-example.git
cd firebase-example
```

### Step 3: Install Firebase CLI

If you haven't already:

```bash
npm install -g firebase-tools
firebase login
```

### Step 4: Create a Firebase project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add project" and follow the wizard
3. Copy your project ID (you'll need this)

### Step 5: Link your Firebase project

Update `.firebaserc` with your project ID:

```json
{
  "projects": {
    "default": "your-firebase-project-id"
  }
}
```

Or use Firebase CLI:

```bash
firebase use --add
```

### Step 6: Configure your API key

Create a `.env` file in the `functions/` folder:

```bash
cd functions
cp .env.example .env
```

Open `functions/.env` and paste your Keplars API key:

```env
KEPLARS_API_KEY=kms_your_actual_api_key_here
```

### Step 7: Install dependencies

```bash
cd functions
npm install
```

### Step 8: Start the Firebase emulator

```bash
cd ..
firebase emulators:start
```

This will spin up local Firebase emulators. You'll see:
- Functions emulator at http://127.0.0.1:5001
- Emulator UI at http://127.0.0.1:4000

### Step 9: Send a test email

Update `test-template.json` with your template ID and recipient email (if using templates), then:

**Plain text email:**
```bash
curl --request POST 'http://127.0.0.1:5001/your-project-id/us-central1/keplarsEmail' \
  --header 'Content-Type: application/json' \
  --data @test-text-email.json
```

**HTML email:**
```bash
curl --request POST 'http://127.0.0.1:5001/your-project-id/us-central1/keplarsEmail' \
  --header 'Content-Type: application/json' \
  --data @test-html-email.json
```

**Template email:**
```bash
curl --request POST 'http://127.0.0.1:5001/your-project-id/us-central1/keplarsEmail' \
  --header 'Content-Type: application/json' \
  --data @test-template.json
```

**Scheduled email:**
```bash
curl --request POST 'http://127.0.0.1:5001/your-project-id/us-central1/keplarsEmail' \
  --header 'Content-Type: application/json' \
  --data @test-schedule-email.json
```

If everything's set up right, you should get a success response. Instant emails arrive within seconds, while scheduled emails will be sent at the specified time!

## Deploying to production

Ready to go live? Here's how to deploy this to Firebase:

### 1. Set your API key as a secret

```bash
firebase functions:secrets:set KEPLARS_API_KEY
# Paste your key when prompted
```

### 2. Deploy the function

```bash
firebase deploy --only functions
```

That's it! Your function is now live at:
```
https://us-central1-your-project-id.cloudfunctions.net/keplarsEmail
```

### 3. Get your function URL

```bash
firebase functions:list
```

## How to use it in your app

### JavaScript/TypeScript

```typescript
const response = await fetch(
  'https://us-central1-your-project-id.cloudfunctions.net/keplarsEmail',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      to: ['user@example.com'],
      template_id: 'your_template_id',
      params: {
        user_name: 'John',
        verification_code: '123456'
      },
      delivery_type: 'instant'
    })
  }
);

const data = await response.json();
console.log('Email sent!', data);
```

### React example

```tsx
function WelcomeEmail() {
  const sendWelcome = async (email: string, name: string) => {
    await fetch(
      'https://us-central1-your-project-id.cloudfunctions.net/keplarsEmail',
      {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          to: [email],
          template_id: 'your_welcome_template_id',
          params: {user_name: name}
        })
      }
    );
  };

  return <button onClick={() => sendWelcome('user@example.com', 'Jane')}>
    Send Welcome Email
  </button>;
}
```

### Next.js API route

```typescript
// app/api/send-email/route.ts
export async function POST(request: Request) {
  const {email, name} = await request.json();

  const response = await fetch(
    process.env.FIREBASE_FUNCTION_URL + '/keplarsEmail',
    {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        to: [email],
        template_id: process.env.KEPLARS_TEMPLATE_ID,
        params: {user_name: name}
      })
    }
  );

  const data = await response.json();
  return Response.json({success: !data.error, data});
}
```

## API Reference

### Request format

You can send emails using templates, raw content, or schedule them for later:

**Method 1: Template-based email**
```json
{
  "to": ["recipient@example.com"],
  "template_id": "your_template_id_here",
  "params": {
    "user_name": "John Doe",
    "verification_code": "123456"
  },
  "delivery_type": "instant",
  "from": "noreply@yourdomain.com",
  "fromName": "Your Company"
}
```

**Method 2: Plain text email**
```json
{
  "to": ["recipient@example.com"],
  "subject": "Welcome!",
  "body": "Thanks for signing up. We're excited to have you.",
  "delivery_type": "instant",
  "from": "noreply@yourdomain.com",
  "fromName": "Your Company"
}
```

**Method 3: HTML email**
```json
{
  "to": ["recipient@example.com"],
  "subject": "Welcome!",
  "html": "<h1>Welcome!</h1><p>Thanks for signing up.</p>",
  "is_html": true,
  "delivery_type": "instant",
  "from": "noreply@yourdomain.com",
  "fromName": "Your Company"
}
```

**Method 4: Scheduled email**
```json
{
  "to": ["recipient@example.com"],
  "subject": "Weekly Newsletter",
  "html": "<h1>This Week's Updates</h1>",
  "scheduled_at": "2026-01-25T10:00:00",
  "timezone": "America/New_York",
  "from": "noreply@yourdomain.com",
  "fromName": "Your Company"
}
```

**Required fields:**
- `to` - Array of email addresses
- For template emails: `template_id`
- For raw emails: `subject` + either `body` (plain text) or `html` (HTML content)

**Optional fields:**
- `params` - Variables to replace in your template (template emails only)
- `is_html` - Set to true when using `html` field (defaults to false)
- `delivery_type` - Either `"instant"` (0-5 sec) or `"queue"` (default). Don't use with `scheduled_at`
- `scheduled_at` - ISO 8601 timestamp (e.g., `2026-01-25T10:00:00`) or simplified format (`2026-01-25_10:00:00`)
- `timezone` - IANA timezone identifier (e.g., `America/New_York`, `Europe/London`, `Asia/Tokyo`). Defaults to UTC
- `from` - Sender email
- `fromName` - Sender name

**Note:** You cannot use both `scheduled_at` and `delivery_type` in the same request. Use `scheduled_at` for future emails, or `delivery_type` for immediate/queued delivery.

### Response format

Success:
```json
{
  "id": "msg_1769120044470_019be7c5-95b2-738c-8285-50b1f05efc2c",
  "object": "email",
  "status": "queued",
  "from": "noreply@yourdomain.com",
  "to": ["recipient@example.com"],
  "created_at": "2026-01-22T22:14:04.470Z",
  "metadata": {
    "priority": "instant",
    "estimated_delivery": "0-5 seconds",
    "recipients_count": 1
  }
}
```

Error:
```json
{
  "success": false,
  "error": "Error message here",
  "code": "ERROR_CODE"
}
```

## Security notes

The function has CORS enabled by default to allow requests from any origin. For production:

1. **Restrict CORS origins**
   Edit `functions/src/index.ts` and update the CORS headers:
   ```typescript
   res.set("Access-Control-Allow-Origin", "https://yourdomain.com");
   ```

2. **Add Firebase Auth** (optional)
   You can integrate with Firebase Auth to require authentication:
   ```typescript
   import * as admin from "firebase-admin";

   // Verify ID token
   const token = req.headers.authorization?.split('Bearer ')[1];
   const decodedToken = await admin.auth().verifyIdToken(token);
   ```

3. **Rate limiting**
   Consider using Cloud Functions quota management or Firebase App Check

Also:
- Never commit your `.env` file
- Use Firebase secrets for production API keys
- Monitor your usage on both Firebase and Keplars dashboards

## Troubleshooting

**"Missing template_id or subject field"**
You need to provide either:
- `template_id` (for template-based emails)
- `subject` + `body` or `html` (for raw emails)

Choose one method - don't mix template_id with subject/body/html fields.

**"API key not configured"**
Make sure your `.env` file is in the `functions/` folder and the variable is named exactly `KEPLARS_API_KEY`.

**"Method not allowed"**
The function only accepts POST requests. Check your HTTP method.

**Email not arriving?**
- Check your spam folder
- If using templates, verify your template exists in Keplars dashboard
- Make sure you've connected an email provider (Gmail/Outlook) in Keplars
- Check the Keplars dashboard for delivery logs
- Check Firebase Functions logs: `firebase functions:log`

**Function not deploying?**
- Run `npm run build` in the functions folder
- Check for TypeScript errors
- Ensure you're using Node.js 18+

## Important stuff to know

⚠️ **Two ways to send emails**:
- **Template-based**: Create reusable templates in Keplars dashboard with dynamic variables
- **Raw content**: Send custom subject + body/html directly without creating templates

⚠️ **Connect your email provider** - Before you can send emails, you need to connect Gmail or Outlook in your Keplars account settings.

⚠️ **Rate limits** - Check your Keplars plan for rate limits. The free tier has generous limits, but you might hit them if you're sending thousands of emails.

## Project structure

```
firebase-example/
├── README.md                          ← You are here
├── CONTRIBUTING.md                    ← Want to contribute?
├── firebase.json                      ← Firebase configuration
├── .firebaserc                        ← Firebase project config
├── examples/                          ← Test scripts
│   ├── README.md                      ← Examples documentation
│   └── test-*.sh                      ← Bash test scripts
├── test-template.json                 ← Template-based email example
├── test-text-email.json               ← Plain text email example
├── test-html-email.json               ← HTML email example
├── test-schedule-email.json           ← Scheduled email example
└── functions/
    ├── package.json                   ← Node.js dependencies
    ├── tsconfig.json                  ← TypeScript config
    ├── .env.example                   ← Environment variables template
    ├── .eslintrc.js                   ← ESLint configuration
    └── src/
        └── index.ts                   ← The actual function code
```

## Learn more

- [Keplars Docs](https://docs.keplars.com) - Keplars documentation
- [Firebase Cloud Functions](https://firebase.google.com/docs/functions) - More about Cloud Functions
- [Keplars Dashboard](https://dash.keplars.com) - Manage your templates and API keys

## Need help?

- **Keplars issues:** Reach out at [keplars.com/support](https://keplars.com/support)
- **Firebase issues:** Check [firebase.google.com/support](https://firebase.google.com/support)
- **This repo:** Open an issue on GitHub

## Contributing

Found a bug? Want to add a feature? PRs are welcome! Check out [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT - Use this however you want. No strings attached.

---

Built with 💙 by the Keplars team
