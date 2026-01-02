# Frontend Environment Variables Template

Copy this content to create your `.env` files.

## .env.example (Development Template)

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:5000/api
VITE_API_VERSION=v1

# Application Configuration
VITE_APP_NAME=Workflow Builder
VITE_APP_ENV=development

# Authentication
VITE_ENABLE_OAUTH=true
VITE_GOOGLE_CLIENT_ID=your-google-client-id
VITE_MICROSOFT_CLIENT_ID=your-microsoft-client-id

# n8n Integration
VITE_N8N_BASE_URL=http://localhost:5678
VITE_N8N_EDITOR_URL=http://localhost:5678/workflow

# Public Forms
VITE_PUBLIC_FORMS_BASE_URL=http://localhost:5000/forms

# File Upload
VITE_MAX_FILE_SIZE_MB=10
VITE_ALLOWED_FILE_TYPES=.pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png

# Feature Flags
VITE_ENABLE_AI_WORKFLOW_GENERATION=true
VITE_ENABLE_DATA_SOURCES=true
VITE_ENABLE_PUBLIC_FORMS=true

# Analytics (Optional)
VITE_GOOGLE_ANALYTICS_ID=
VITE_SENTRY_DSN=

# Development
VITE_ENABLE_MOCK_DATA=false
VITE_ENABLE_DEBUG_LOGS=true
```

## .env.production (Production Template)

```env
# API Configuration
VITE_API_BASE_URL=https://api.your-domain.com/api
VITE_API_VERSION=v1

# Application Configuration
VITE_APP_NAME=Workflow Builder
VITE_APP_ENV=production

# Authentication
VITE_ENABLE_OAUTH=true
VITE_GOOGLE_CLIENT_ID=your-production-google-client-id
VITE_MICROSOFT_CLIENT_ID=your-production-microsoft-client-id

# n8n Integration
VITE_N8N_BASE_URL=https://n8n.your-domain.com
VITE_N8N_EDITOR_URL=https://n8n.your-domain.com/workflow

# Public Forms
VITE_PUBLIC_FORMS_BASE_URL=https://forms.your-domain.com

# File Upload
VITE_MAX_FILE_SIZE_MB=10
VITE_ALLOWED_FILE_TYPES=.pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png

# Feature Flags
VITE_ENABLE_AI_WORKFLOW_GENERATION=true
VITE_ENABLE_DATA_SOURCES=true
VITE_ENABLE_PUBLIC_FORMS=true

# Analytics
VITE_GOOGLE_ANALYTICS_ID=your-ga-id
VITE_SENTRY_DSN=your-sentry-dsn

# Development
VITE_ENABLE_MOCK_DATA=false
VITE_ENABLE_DEBUG_LOGS=false
```

## Quick Setup

1. Copy the template above to create `.env` file:
   ```bash
   # Windows PowerShell
   Copy-Item ENV_TEMPLATE.md .env
   # Then edit .env and remove the markdown formatting
   
   # Or manually create .env file with the content above
   ```

2. Update the values with your actual configuration

3. For production, create `.env.production` with production values

## Variable Descriptions

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_BASE_URL` | Backend API base URL | Yes |
| `VITE_API_VERSION` | API version (usually v1) | Yes |
| `VITE_APP_NAME` | Application display name | Yes |
| `VITE_APP_ENV` | Environment (development/production) | Yes |
| `VITE_ENABLE_OAUTH` | Enable OAuth authentication | No |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth client ID | If OAuth enabled |
| `VITE_MICROSOFT_CLIENT_ID` | Microsoft OAuth client ID | If OAuth enabled |
| `VITE_N8N_BASE_URL` | n8n instance URL | Yes |
| `VITE_N8N_EDITOR_URL` | n8n workflow editor URL | Yes |
| `VITE_PUBLIC_FORMS_BASE_URL` | Base URL for public forms | Yes |
| `VITE_MAX_FILE_SIZE_MB` | Maximum file upload size in MB | Yes |
| `VITE_ALLOWED_FILE_TYPES` | Comma-separated allowed file extensions | Yes |
| `VITE_ENABLE_AI_WORKFLOW_GENERATION` | Enable AI workflow generation feature | No |
| `VITE_ENABLE_DATA_SOURCES` | Enable data sources feature | No |
| `VITE_ENABLE_PUBLIC_FORMS` | Enable public forms feature | No |
| `VITE_GOOGLE_ANALYTICS_ID` | Google Analytics tracking ID | No |
| `VITE_SENTRY_DSN` | Sentry error tracking DSN | No |
| `VITE_ENABLE_MOCK_DATA` | Use mock data for development | No |
| `VITE_ENABLE_DEBUG_LOGS` | Enable debug logging | No |

## Notes

- All Vite environment variables must be prefixed with `VITE_`
- Variables are available in code via `import.meta.env.VITE_VARIABLE_NAME`
- `.env` files are gitignored - never commit them
- Use `.env.example` as a template for other developers

