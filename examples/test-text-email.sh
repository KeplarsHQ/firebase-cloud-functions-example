#!/bin/bash

# Test script for sending a simple text email
# Usage: ./test-text-email.sh recipient@example.com

RECIPIENT="${1:-test@example.com}"
# Update this with your Firebase project ID
PROJECT_ID="${FIREBASE_PROJECT_ID:-your-firebase-project-id}"
API_URL="http://127.0.0.1:5001/${PROJECT_ID}/us-central1/keplarsEmail"

echo "Sending text email to: $RECIPIENT"

curl -i --location --request POST "$API_URL" \
  --header "Content-Type: application/json" \
  --data "{
    \"to\": [\"$RECIPIENT\"],
    \"subject\": \"Test Email from Keplars + Firebase\",
    \"body\": \"Hello! This is a test email sent via Keplars Mail Service integrated with Firebase Cloud Functions.\"
  }"
