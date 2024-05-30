const jwt = require('jsonwebtoken');
const User = require('../models/User');

function authentificationMiddleware(req, res, next) {
  const whiteList = ['/auth/register', '/auth/login', '/auth/google', '/auth/google/callback'];

  if (whiteList.includes(req.path)) {
    return next();
  }

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    const token = req.headers.authorization.split(' ')[1];
    const secret = process.env.JWT_SECRET;

    jwt.verify(token, secret, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Token invalide' });
      }

      const userId = decoded.id;

      try {
        const user = await User.findByPk(userId);

        if (!user) {
          return res.status(401).json({ message: 'Utilisateur non trouvé' });
        }

        req.user = user;
        next();
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erreur serveur' });
      }
    });
  } else {
    res.status(401).json({ message: 'Token manquant' });
  }
}

module.exports = {
  authentificationMiddleware
}