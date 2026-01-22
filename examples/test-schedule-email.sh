#!/bin/bash

# Test script for sending a scheduled email
# Usage: ./test-schedule-email.sh recipient@example.com "2026-01-25T10:00:00" "America/New_York"

RECIPIENT="${1:-test@example.com}"
SCHEDULED_AT="${2:-2026-01-25T10:00:00}"
TIMEZONE="${3:-UTC}"
PROJECT_ID="${FIREBASE_PROJECT_ID:-your-firebase-project-id}"
API_URL="http://127.0.0.1:5001/${PROJECT_ID}/us-central1/keplarsEmail"

echo "Scheduling email to: $RECIPIENT"
echo "Scheduled for: $SCHEDULED_AT ($TIMEZONE)"

curl -i --location --request POST "$API_URL" \
  --header "Content-Type: application/json" \
  --data "{
    \"to\": [\"$RECIPIENT\"],
    \"subject\": \"Scheduled Email Test\",
    \"body\": \"This email was scheduled to be sent at $SCHEDULED_AT in the $TIMEZONE timezone.\",
    \"scheduled_at\": \"$SCHEDULED_AT\",
    \"timezone\": \"$TIMEZONE\"
  }"
