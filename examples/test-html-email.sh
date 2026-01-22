#!/bin/bash

# Test script for sending an HTML email
# Usage: ./test-html-email.sh recipient@example.com

RECIPIENT="${1:-test@example.com}"
PROJECT_ID="${FIREBASE_PROJECT_ID:-your-firebase-project-id}"
API_URL="http://127.0.0.1:5001/${PROJECT_ID}/us-central1/keplarsEmail"

echo "Sending HTML email to: $RECIPIENT"

curl -i --location --request POST "$API_URL" \
  --header "Content-Type: application/json" \
  --data "{
    \"to\": [\"$RECIPIENT\"],
    \"subject\": \"Welcome to Keplars + Firebase!\",
    \"html\": \"<html><body><h1>Welcome!</h1><p>This is a <strong>HTML email</strong> sent via Keplars and Firebase.</p><p>Features:</p><ul><li>Rich formatting</li><li>Images support</li><li>Styling</li></ul></body></html>\"
  }"
