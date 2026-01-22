#!/bin/bash

# Test script for sending an instant email (high priority)
# Usage: ./test-instant-email.sh recipient@example.com

RECIPIENT="${1:-test@example.com}"
PROJECT_ID="${FIREBASE_PROJECT_ID:-your-firebase-project-id}"
API_URL="http://127.0.0.1:5001/${PROJECT_ID}/us-central1/keplarsEmail"

echo "Sending instant email to: $RECIPIENT"

curl -i --location --request POST "$API_URL" \
  --header "Content-Type: application/json" \
  --data "{
    \"to\": [\"$RECIPIENT\"],
    \"subject\": \"Your Verification Code\",
    \"body\": \"Your verification code is: 123456. This code will expire in 10 minutes.\",
    \"delivery_type\": \"instant\"
  }"
