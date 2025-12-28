// Security Configuration
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import xss from 'xss-clean';
import hpp from 'hpp';

const securityMiddleware = (app) => {
  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  });
  app.use(limiter);

  // Helmet for security headers
  app.use(helmet());

  // Prevent XSS attacks
  app.use(xss());

  // Prevent HTTP Parameter Pollution
  app.use(hpp());
};

export default securityMiddleware;