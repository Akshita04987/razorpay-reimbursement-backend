require('dotenv').config({ quiet: true });

module.exports = {
  port: process.env.PORT || 7002,
  jwtSecret: process.env.JWT_SECRET,
  nodeEnv: process.env.NODE_ENV || 'development'
};
