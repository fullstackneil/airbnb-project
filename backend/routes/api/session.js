const express = require('express')
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { refreshCsrfToken } = require('../../utils/csrf');
const { loginLimiter } = require('../../utils/rateLimit');
const { User } = require('../../db/models');

const router = express.Router();

const validateLogin = [
  check('credential')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('Email or username is required'),
  check('password')
    .exists({ checkFalsy: true })
    .withMessage('Password is required'),
  handleValidationErrors
];


// Log in
router.post( '/', loginLimiter, validateLogin, async (req, res, next) => {
      const { credential, password } = req.body;

      const user = await User.unscoped().findOne({
        where: {
          [Op.or]: {
            username: credential,
            email: credential
          }
        }
      });

      if (!user || !bcrypt.compareSync(password, user.hashedPassword.toString())) {
        const err = {};
        err.status = 401;
        err.message = "The provided credentials were invalid";
        return next(err);
      }

      const safeUser = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
      };

      const token = await setTokenCookie(res, safeUser);
      // New session, so issue a CSRF token bound to it.
      refreshCsrfToken(req, res, token);

      return res.json({
        user: safeUser
      });
    }
  );



// Log out
router.delete( '/', (req, res) => {
      res.clearCookie('token');
      refreshCsrfToken(req, res, null);
      return res.json({ message: 'Success' });
    }
  );



// Restore session user
router.get( '/', (req, res) => {
    const { user } = req;
    if (user) {
      const safeUser = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
      };
      return res.json({
        user: safeUser
      });
    } else return res.json({ user: null });
  }
);






module.exports = router;
