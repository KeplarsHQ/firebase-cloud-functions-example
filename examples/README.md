# Test Examples

This directory contains example scripts to test the Keplars email function.

## Prerequisites

Before running these scripts:
1. Firebase emulators must be running (`firebase emulators:start`)
2. Set the `FIREBASE_PROJECT_ID` environment variable with your Firebase project ID
3. Environment variables must be configured (see functions/.env)

## Bash Scripts (Linux/Mac/WSL)

Make the scripts executable:
```bash
chmod +x *.sh
```

Set your Firebase project ID:
```bash
export FIREBASE_PROJECT_ID="your-firebase-project-id"
```

### Test Text Email
```bash
./test-text-email.sh recipient@example.com
```

### Test HTML Email
```bash
./test-html-email.sh recipient@example.com
```

### Test Instant Email
```bash
./test-instant-email.sh recipient@example.com
```

### Test Template Email
```bash
./test-template-email.sh recipient@example.com your_template_id
```

### Test Scheduled Email
```bash
./test-schedule-email.sh recipient@example.com "2026-01-25T10:00:00" "America/New_York"
```

## Windows PowerShell

For Windows users, use these commands:

### Text Email
```powershell
# Set your project ID
$env:FIREBASE_PROJECT_ID = "your-firebase-project-id"

curl.exe -i --location --request POST "http://127.0.0.1:5001/$env:FIREBASE_PROJECT_ID/us-central1/keplarsEmail" `
  --header "Content-Type: application/json" `
  --data "{\"to\": [\"test@example.com\"], \"subject\": \"Test\", \"body\": \"Hello\"}"
```

## Notes

- Replace `test@example.com` with your actual email address
- For template emails, create a template in your Keplars dashboard first
- The local Firebase emulator must be running for these scripts to work
- For production testing, update the API_URL in the scripts to your deployed function URL
