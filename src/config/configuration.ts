export default () => ({
  app: {
    name: process.env.APP_NAME || 'OTA CRM API',
    url: process.env.APP_URL || 'http://localhost:5001',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
    nodeEnv: process.env.NODE_ENV || 'development',
    version: process.env.APP_VERSION || '1.0.0',
    encryptionKey: process.env.ENCRYPTION_KEY,
  },
  port: parseInt(process.env.PORT ?? '3000', 10),
  timezone: process.env.TZ || 'Asia/Dhaka',
  database: {
    db_uri: process.env.DB_URI,
  },
  mail: {
    host: process.env.MAIL_HOST,
    port: parseInt(process.env.MAIL_PORT ?? '587', 10),
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
    from: {
      name: process.env.MAIL_FROM_NAME || 'OTA LMS',
      address: process.env.MAIL_FROM_ADDRESS || 'example@com',
    },
  },
  s3: {
    bucket: process.env.S3_BUCKET,
    region: process.env.S3_REGION,
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    endpoint:
      process.env.S3_ENDPOINT ||
      `https://${process.env.S3_BUCKET}.${process.env.S3_REGION}.digitaloceanspaces.com`,
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your_j,wt_secret_key',
    expiresIn: process.env.JWT_EXPIRES_IN,
  },
  sms: {
    apiUrl: process.env.ALPHA_SMS_BASE_URL || 'https://api.sms.net.bd/sendsms',
    apiSecret:
      process.env.ALPHA_SMS_API_KEY ||
      'tHznqgHcqSgVVh9HZb7aHylO6jGF4YmBd7xWx0mE',
    senderId: process.env.ALPHA_SMS_SENDER || 'alphasms',
  },

  ssl_commerce: {
    storeId: process.env.STORE_ID,
    storePassword: process.env.STORE_PASSWORD,
    isLive: process.env.IS_LIVE,
    successUrl: '/api/sslcommerz/success',
    failUrl: '/api/sslcommerz/fail',
    cancelUrl: '/api/sslcommerz/cancel',
  },
});
