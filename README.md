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

## Deployment Guide

### Prerequisites
- Node.js 18.x or higher
- npm or yarn package manager
- 512MB RAM minimum
- Basic knowledge of command line operations

### 1. Local Development Setup

1. Clone the repository:
```bash
git clone https://github.com/your-username/log-anonymizer
cd log-anonymizer
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

### 2. Production Deployment Options

#### A. Static Site (Recommended)
Since the core anonymization happens client-side, you can deploy to any static host:

1. Build the application:
```bash
npm run build
```

2. Deploy `dist/public` to:
   - Netlify
   - Vercel
   - GitHub Pages
   - Any static file host

#### B. Full-Stack Deployment
For organizations requiring server-side features:

1. Build the application:
```bash
npm run build
```

2. Configure environment:
```bash
# Required
PORT=5000
NODE_ENV=production

# Optional for AI features
OPENAI_API_KEY=your_key_here
```

3. Start production server:
```bash
npm start
```

#### C. Docker Deployment
1. Build the image:
```bash
docker build -t log-anonymizer .
```

2. Run container:
```bash
docker run -p 5000:5000 log-anonymizer
```

### 3. Cloud Platform Specific Instructions

#### Replit (Easiest)
1. Fork the Repl
2. The app automatically deploys
3. Access at your-repl-name.your-username.repl.co

#### Heroku
1. Create new app
2. Connect your repository
3. Add buildpack: heroku/nodejs
4. Deploy main branch

#### AWS Elastic Beanstalk
1. Create new application
2. Choose Node.js platform
3. Upload source bundle
4. Configure environment variables

## Environment Configuration

### Required Environment Variables
None! The app works out of the box with local processing.

### Optional Environment Variables
- `OPENAI_API_KEY`: Enable AI-powered detection
- `PORT`: Override default port (5000)
- `NODE_ENV`: Set environment (development/production)

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

## Troubleshooting

### Common Issues

1. Port Already in Use
```bash
# Change port in package.json or use environment variable
PORT=5001 npm start
```

2. Missing Dependencies
```bash
# Clear npm cache and reinstall
npm cache clean --force
npm install
```

3. Build Errors
```bash
# Clean build files and rebuild
rm -rf dist
npm run build
```

## Support & Maintenance

1. Updating Dependencies
```bash
npm update
npm audit fix
```

2. Monitoring
- Check application logs
- Monitor memory usage
- Watch for API rate limits if using AI features

3. Backup
- Regular backups of configuration
- Version control for custom rules
- Document any modifications

## Performance Optimization

1. Production Build
- Minified assets
- Tree-shaking enabled
- Code splitting active

2. Caching Strategy
- Static assets cached
- API responses cached when appropriate
- Browser caching configured

3. Load Times
- Lazy loading for large components
- Image optimization
- Code splitting for routes

Remember to check the [official documentation](docs/README.md) for detailed information about customization and advanced features.