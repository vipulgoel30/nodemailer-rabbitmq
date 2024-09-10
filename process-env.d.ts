declare global {
  namespace NodeJS {
    interface ProcessEnv {
      [key: string]: string;
      PORT: string;
      NODE_ENV: string;
      MONGO_CONN: string;
      SECRET: string;
      MEGA_EMAIL: string;
      MEGA_PASSWORD: string;
      NODEMAILER_AUTH_USER: string;
      NODEMAILER_AUTH_PASS: string;
      NODEMAILER_SERVICE: string;
      NODEMAILER_PORT: string;
      NODEMAILER_HOST: string;
      SUPPORT_EMAIL: string;
      REDIS_URL: string;
      CRYPTO_KEY: string;
      CRYPTO_INIT_VECTOR: string;
      CLOUDAMQP_KEY: string;
    }
  }
}

export {};
