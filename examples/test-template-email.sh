#!/bin/bash

# Test script for sending an email using a Keplars template
# Usage: ./test-template-email.sh recipient@example.com template_id

RECIPIENT="${1:-test@example.com}"
TEMPLATE_ID="${2:-your_template_id_here}"
PROJECT_ID="${FIREBASE_PROJECT_ID:-your-firebase-project-id}"
API_URL="http://127.0.0.1:5001/${PROJECT_ID}/us-central1/keplarsEmail"

echo "Sending template email to: $RECIPIENT"
echo "Using template: $TEMPLATE_ID"

curl -i --location --request POST "$API_URL" \
  --header "Content-Type: application/json" \
  --data "{
    \"to\": [\"$RECIPIENT\"],
    \"template_id\": \"$TEMPLATE_ID\",
    \"params\": {
      \"user_name\": \"Test User\",
      \"current_year\": \"2026\",
      \"company_name\": \"Keplars + Firebase\"
    }
  }"
