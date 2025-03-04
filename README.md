# Log Anonymizer

A secure log anonymization tool that protects sensitive information while preserving critical context. This application provides granular PII detection and selective anonymization with local processing and an intuitive interface.

## Features

- 🔒 Local-first processing - no data leaves your browser
- 🎯 Granular PII detection controls
- 🏗️ Configurable anonymization rules
- 📝 Support for various log formats
- 🎨 Clean, modern interface

## Detection Modes

### 1. Default Mode: Regex-Based Detection (No API Key Required)
The application uses sophisticated regex patterns to detect and anonymize:

- ✓ Timestamps
- ✓ User IDs (preserves format "User ID: XXXXXX")
- ✓ Email addresses
- ✓ Phone numbers 
- ✓ IP addresses
- ✓ Credit card numbers
- ✓ Social security numbers
- ✓ Customer names
- ✓ Physical addresses (replaced with fictional addresses)

The following items are preserved and NOT anonymized:
- Agent names (e.g., "Agent Name: Sarah Thompson")
- Agent IDs (e.g., "ID: AGT-29384")
- Call durations
- Recording references

### 2. AI-Enhanced Mode (Optional)
For more sophisticated detection:

1. Set up an OpenAI API key
2. Configure the AI provider in the interface
3. Get enhanced detection for:
   - Complex name patterns
   - Context-aware PII detection
   - Custom entity recognition

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

## Environment Variables

The application works without any environment variables using local regex-based processing.

Optional AI Enhancement:
- `OPENAI_API_KEY`: Enable AI-powered PII detection (optional)

## How PII Detection Works

### Regex Patterns
The application uses carefully crafted regex patterns to identify sensitive information:

- Timestamps: `\d{1,2}:\d{2}(?::\d{2})?(?:\s*[AaPp][Mm])?|\d{4}-\d{2}-\d{2}`
- Email addresses: `\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b`
- Phone numbers: `\b(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}\b`
- And more...

### Special Cases
The regex engine is designed to:
1. Preserve agent information (names and IDs)
2. Keep specific user ID formats intact
3. Replace addresses with fictional alternatives
4. Maintain document structure and readability

## Deployment Options

### 1. Deploy on Replit (Recommended)
- Fork this Repl
- Your app will be automatically deployed
- Updates are automatically deployed when you make changes

### 2. Deploy as Static Site
Since the core anonymization happens client-side, you can deploy the built assets from `dist/public` to any static hosting service:

1. Build the application:
```bash
npm run build
```
2. Deploy the contents of `dist/public` to any static host

### 3. Deploy on Your Own Server
1. Build the application:
```bash
npm run build
```
2. Start the production server:
```bash
npm start
```
3. Access on port 5000