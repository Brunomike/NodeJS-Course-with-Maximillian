const express = require('express');
const { check, body } = require('express-validator');
const router = express.Router();
const authController = require('../controllers/auth');

const User = require('../models/user');


router.get('/login', authController.getLogin);
router.post('/login',
    [check('email')
        .isEmail()
        .withMessage('Please enter a valid email')
        .normalizeEmail(),
    body('password', 'Password has to be valid.')
        .isLength({ min: 5 })
        .isAlphanumeric()
        .trim(),
    ],
    authController.postLogin);
router.get('/signup', authController.getSignup);
router.post('/signup',
    [check('email')
        .isEmail()
        .withMessage('Please enter a valid email')
        .custom((value, { req }) => {
            // if (value === 'test@test.com') {
            //     throw new Error('This email address is forbidden.')
            // }
            // return true;
            return User.findOne({ email: value })
                .then((user) => {
                    if (user) {
                        return Promise.reject('E-Mail already exists, please pick a different one!');
                    }
                });
        })
        .normalizeEmail(),
    body('password',
        'Please enter a password with only numbers and text and at least 5 characters.')
        .isLength({ min: 5 })
        .isAlphanumeric()
        .trim(),
    body('confirmPassword')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords have to match');
            }
            return true;
        })
        .trim()
    ]
    ,
    authController.postSignup);
router.get('/reset', authController.getReset);
router.post('/reset', authController.postReset);
router.get('/reset/:token', authController.getNewPassword);
router.post('/new-password', authController.postNewPassword);
router.post('/logout', authController.postLogout);

module.exports = router;