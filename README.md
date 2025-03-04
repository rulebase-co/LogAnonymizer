# Log Anonymizer

A secure log anonymization tool that protects sensitive information while preserving critical context. This application provides granular PII detection and selective anonymization with local processing and an intuitive interface.

## Features

- 🔒 Local-first processing - no data leaves your browser
- 🎯 Granular PII detection controls
- 🏗️ Configurable anonymization rules
- 📝 Support for various log formats
- 🎨 Clean, modern interface

## Quick Deploy on Replit

1. Click the "Fork" button at the top of this Repl
2. The application will automatically start after forking
3. Access your app at your-repl-name.your-username.repl.co

## Local Development

1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Start the development server:
```bash
npm run dev
```
4. Open http://localhost:5000 in your browser

## PII Detection Capabilities

The application can detect and anonymize:

- ✓ Timestamps 
- ✓ User IDs
- ✓ Email addresses
- ✓ Phone numbers
- ✓ IP addresses
- ✓ Credit card numbers
- ✓ Social security numbers
- ✓ Customer names
- ✓ Physical addresses (replaced with fictional addresses)

### Special Handling

The following items are preserved and NOT anonymized:
- Agent names (e.g., "Agent Name: Sarah Thompson")
- Agent IDs (e.g., "ID: AGT-29384")
- User IDs in specific format (e.g., "User ID: 56789234")
- Call durations and recording references

## Environment Variables

No environment variables are required for basic functionality as the app uses local regex-based processing by default.

Optional AI Enhancement:
- `OPENAI_API_KEY`: If provided, enables AI-powered PII detection (optional)

## Deployment Options

### 1. Deploy on Replit (Recommended)
- Fork this Repl
- Your app will be automatically deployed
- Updates are automatically deployed when you make changes

### 2. Deploy on Your Own Server
1. Build the application:
```bash
npm run build
```
2. Start the production server:
```bash
npm start
```
3. Access on port 5000

### 3. Deploy as Static Site
Since the core anonymization happens client-side, you can also deploy the built assets from `dist/public` to any static hosting service.

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request
