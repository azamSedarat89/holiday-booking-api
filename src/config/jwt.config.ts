export default () => ({
  jwtSecret: process.env.JWT_SECRET || 'defaultSecretKey',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
});
