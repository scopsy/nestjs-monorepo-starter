declare namespace NodeJS {
  export interface ProcessEnv {
    MONGO_URL: string;
    REDIS_URL: string;
    SYNC_PATH: string;
    GOOGLE_OAUTH_CLIENT_SECRET: string;
    GOOGLE_OAUTH_CLIENT_ID: string;
    NODE_ENV: 'test' | 'prod' | 'dev' | 'ci';
    PORT: string;
    FRONT_BASE_URL: string;
  }
}
