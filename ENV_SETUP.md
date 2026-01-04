# Environment Configuration

## ✅ Configuration Complete

The environment has been configured to use your backend API at `https://localhost:7138/`.

## 📝 Environment File

Since `.env` files are gitignored, you need to create the `.env` file manually. Here's the content:

```env
# API Configuration
VITE_API_BASE_URL=https://localhost:7138/api
VITE_API_VERSION=v1

# Application Configuration
VITE_APP_NAME=Workflow Builder
VITE_APP_ENV=development

# Authentication
VITE_ENABLE_OAUTH=false
VITE_GOOGLE_CLIENT_ID=
VITE_MICROSOFT_CLIENT_ID=

# n8n Integration
VITE_N8N_BASE_URL=http://localhost:5678
VITE_N8N_EDITOR_URL=http://localhost:5678/workflow

# Public Forms
VITE_PUBLIC_FORMS_BASE_URL=https://localhost:7138/forms

# File Upload
VITE_MAX_FILE_SIZE_MB=10
VITE_ALLOWED_FILE_TYPES=.csv,.json,.xlsx,.xls

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

## 🚀 Quick Setup

1. **Create the `.env` file:**
   ```powershell
   # In PowerShell, create the file with the content above
   # Or copy from ENV_TEMPLATE.md and update the API URL
   ```

2. **Verify the configuration:**
   - The API base URL is set to: `https://localhost:7138/api`
   - Vite proxy is configured for development
   - API client fallback is updated

## ⚙️ Configuration Details

### API Base URL
- **Development:** `https://localhost:7138/api`
- **Fallback:** Updated in `src/lib/api.ts` to use the same URL

### Vite Proxy
- Updated in `vite.config.ts` to proxy `/api` requests to `https://localhost:7138`
- `secure: false` is set to allow self-signed certificates for localhost HTTPS

### HTTPS Note
Since your backend uses HTTPS (`https://localhost:7138`), you may need to:
- Accept the self-signed certificate in your browser when accessing the API directly
- The Vite proxy is configured to handle HTTPS connections

## 🔍 Testing

After creating the `.env` file:

1. Restart the dev server:
   ```bash
   npm run dev
   ```

2. Test the connection:
   - Open browser console
   - Try logging in
   - Check Network tab for API requests

3. If you see CORS errors:
   - Make sure your backend CORS is configured to allow `http://localhost:3000`
   - Check that the backend is running on `https://localhost:7138`

## 📚 Related Files

- `ENV_TEMPLATE.md` - Full environment variable documentation
- `vite.config.ts` - Vite proxy configuration
- `src/lib/api.ts` - API client configuration

