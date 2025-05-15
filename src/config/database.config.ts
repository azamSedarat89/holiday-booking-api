export default () => ({
  dbHost: process.env.DB_HOST,
  dbPort: +(process.env.DB_PORT || 5432),
  dbUsername: process.env.DB_USERNAME,
  dbPassword: process.env.DB_PASSWORD,
  dbName: process.env.DB_NAME,
});
