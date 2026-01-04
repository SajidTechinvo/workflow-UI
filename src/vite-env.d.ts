/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_API_VERSION: string
  readonly VITE_APP_NAME: string
  readonly VITE_APP_ENV: string
  readonly VITE_ENABLE_OAUTH: string
  readonly VITE_GOOGLE_CLIENT_ID: string
  readonly VITE_MICROSOFT_CLIENT_ID: string
  readonly VITE_N8N_BASE_URL: string
  readonly VITE_N8N_EDITOR_URL: string
  readonly VITE_PUBLIC_FORMS_BASE_URL: string
  readonly VITE_MAX_FILE_SIZE_MB: string
  readonly VITE_ALLOWED_FILE_TYPES: string
  readonly VITE_ENABLE_AI_WORKFLOW_GENERATION: string
  readonly VITE_ENABLE_DATA_SOURCES: string
  readonly VITE_ENABLE_PUBLIC_FORMS: string
  readonly VITE_GOOGLE_ANALYTICS_ID: string
  readonly VITE_SENTRY_DSN: string
  readonly VITE_ENABLE_MOCK_DATA: string
  readonly VITE_ENABLE_DEBUG_LOGS: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

