// Authorization Middleware
const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).send({ error: 'Unauthorized' });
    }

    if (roles.length && !roles.includes(req.user.roles)) {
      return res.status(403).send({ error: 'Forbidden' });
    }

    next();
  };
};

export default authorize;