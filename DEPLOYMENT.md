# Deployment Guide

## Quick Start Options


### 1. Local Development
```bash
# Clone the repository
git clone <repository-url>
cd log-anonymizer

# Install dependencies
npm install

# Start development server
npm run dev

# Access at http://localhost:5000
```

### 3. Static Site Deployment
Since the core anonymization happens client-side, deploy the built assets from `dist/public` to any static host:

```bash
# Build the application
npm run build

# Deploy dist/public to your preferred platform:
# - Netlify
# - Vercel
# - GitHub Pages
# - Any static file host
```

## Environment Setup

### Minimal Requirements
- Node.js 18.x or higher
- 512MB RAM minimum
- NPM or Yarn package manager

### Environment Variables
Create a `.env` file based on `.env.example`:

```bash
# Application Configuration
PORT=5000
NODE_ENV=development

# Optional: AI-powered PII detection
OPENAI_API_KEY=your_api_key_here  # Optional, app works without it
```

## Platform-Specific Guides

### Replit
1. Fork the Repl
2. The app deploys automatically
3. (Optional) Add OpenAI API key in Replit Secrets

### Netlify
1. Connect your GitHub repository
2. Build command: `npm run build`
3. Publish directory: `dist/public`
4. Deploy!

### Vercel
1. Import your repository
2. Framework preset: Vite
3. Build command: `npm run build`
4. Output directory: `dist/public`

### GitHub Pages
1. Build the app: `npm run build`
2. Enable GitHub Pages in repository settings
3. Set source to GitHub Actions
4. Use provided workflow or create custom one

### Docker
```bash
# Build image
docker build -t log-anonymizer .

# Run container
docker run -p 5000:5000 log-anonymizer
```

## Security Best Practices

1. API Keys
   - Store API keys in environment variables
   - Never commit .env files
   - Use secrets management in production

2. Updates & Maintenance
   - Keep dependencies updated
   - Run `npm audit` regularly
   - Monitor for security advisories

3. Production Setup
   - Enable HTTPS
   - Set secure headers
   - Configure proper CORS

## Troubleshooting

### Common Issues

1. Port Conflicts
```bash
# Change port
PORT=5001 npm start
```

2. Build Failures
```bash
# Clean and rebuild
rm -rf dist
npm run build
```

3. Dependencies
```bash
# Clean install
rm -rf node_modules
npm install
```

## Support

For issues and questions:
1. Check the FAQ in README.md
2. Open an issue in the repository
3. Join our community discussions

Remember to review security considerations and environment setup before deploying to production.
