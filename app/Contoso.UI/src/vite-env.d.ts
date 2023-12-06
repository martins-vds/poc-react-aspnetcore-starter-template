/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_B2C_DOMAIN: string;
  readonly VITE_B2C_INSTANCE: string;
  readonly VITE_B2C_CLIENT_ID: string;
  readonly VITE_B2C_SIGN_IN_POLICY: string;
  readonly VITE_API_WEATHER_FORECAST_PATH: string;
  readonly VITE_API_WEATHER_FORECAST_SCOPE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
