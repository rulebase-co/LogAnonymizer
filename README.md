# Log Anonymizer 🔒

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

A secure, flexible log anonymization tool that protects sensitive information while preserving critical context. This application provides granular PII detection and selective anonymization with local processing and an intuitive interface.

<p align="center">
  <img src="./screenshots/demo.png" alt="Log Anonymizer Demo" width="800"/>
</p>

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

## Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm or yarn package manager
- 512MB RAM minimum
- Basic knowledge of command line operations

### Local Development

1. Create a new directory and initialize the project:
```bash
mkdir log-anonymizer
cd log-anonymizer
npm init -y
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Start development server:
```bash
npm run dev
```

5. Access at http://localhost:5000

## Deployment Options

### Local Development
Detailed instructions for local development can be found in [DEPLOYMENT.md](DEPLOYMENT.md#local-development).

### Production Deployment
For production deployment options, including:
- Static site deployment
- Full-stack server setup
- Docker deployment
- Cloud platform deployment

See [DEPLOYMENT.md](DEPLOYMENT.md#production-deployment-options).

## Environment Variables

The application works without any environment variables using local regex-based processing.

Optional AI Enhancement:
- `OPENAI_API_KEY`: Enable AI-powered detection
- `PORT`: Override default port (5000)
- `NODE_ENV`: Set environment (development/production)

For more configuration options, see [.env.example](.env.example).

## Security Considerations

1. API Keys
   - Never commit API keys to version control
   - Use environment variables for sensitive data
   - Rotate keys regularly if using AI features

2. Data Processing
   - All PII detection happens client-side
   - No data is stored or transmitted
   - No cookies or local storage used

3. Dependencies
   - Regular security updates via npm audit
   - Minimal external dependencies
   - All packages vetted for security

## Contributing

We welcome contributions! Please check our [Contributing Guidelines](CONTRIBUTING.md) before submitting PRs.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.