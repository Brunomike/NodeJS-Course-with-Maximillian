const crypto = require('crypto');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const nodeMailer = require('nodemailer');
const nodemailer = require("nodemailer");
const sendGridTransport = require('nodemailer-sendgrid-transport');
const User = require('../models/user');

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const createMessage = (email) => {
    let messageV = {
        personalizations: [
            {
                to: [
                    { email: email },
                ],
            },
        ],
        from: {
            email: 'michaelbruno.tech@protonmail.com',
            name: 'Singup confirmation'
        },
        subject: 'Sending with SendGrid is Fun',
        content: [
            {
                type: 'text/html',
                value: '<p>Michael Bruno testing singup confirmation.</p><p>Hello from Twilio SendGrid!</p><p>Sending with the email service trusted by developers and marketers for <strong>time-savings</strong>, <strong>scalability</strong>, and <strong>delivery expertise</strong>.</p><p>%open-track%</p>'
            }
        ],
    };
    return messageV;
};

const alertMessage = (req) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    return message;
};

let transporter1 = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: 'eunice.walker6@ethereal.email', // generated ethereal user
        pass: 'hvQME8cetN7ujC3cY7', // generated ethereal password
    },
});

const transporter = nodeMailer.createTransport(sendGridTransport({
    auth: {
        api_key: process.env.SENDGRID_KEY
    }
}));

exports.getLogin = (req, res, next) => {
    console.log(process.env.SENDGRID_KEY);
    // const isLoggedIn = req
    //     .get('Cookie')
    //     .split(';')[5]
    //     .trim()
    //     .split('=')[1] === 'true';
    //     console.log({cookie:req.get('Cookie')});
    //console.log(isLoggedIn);
    //console.log(req.session.isLoggedIn);
    let message = alertMessage(req);
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage: message,
        oldInput: {
            email: '',
            password: ''
        },
        validationErrors: []
    });
};

exports.postLogin = (req, res, next) => {
    const { email, password } = req.body;
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //     console.log(errors.array());
    //     return res.status(422).render('auth/login', {
    //         path: '/login',
    //         pageTitle: 'Login',
    //         errorMessage: errors.array()[0].msg,
    //         oldInput: {
    //             email: email,
    //             password: password
    //         },
    //         validationErrors: errors.array()
    //     }
    //     );
    // }
    // //req.isLoggedIn = true;
    // //res.setHeader('Set-Cookie', 'loggedIn=true; ');
    // req.session.isLoggedIn = true;
    // res.redirect('/');

    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                return res.status(422).render('auth/login', {
                    path: '/login',
                    pageTitle: 'Login',
                    errorMessage: 'Invalid email or password',
                    oldInput: {
                        email: email,
                        password: password
                    },
                    validationErrors: []
                });
            }
            bcrypt
                .compare(password, user.password)
                .then(doMatch => {
                    if (doMatch) {
                        req.session.isLoggedIn = true;
                        req.session.user = user;
                        return req.session.save((err) => {
                            err && console.log(err);
                            res.redirect('/');
                        });
                    }

                    return res.status(422).render('auth/login', {
                        path: '/login',
                        pageTitle: 'Login',
                        errorMessage: 'Invalid email or password',
                        oldInput: {
                            email: email,
                            password: password
                        },
                        validationErrors: []
                    });
                })
                .catch(err => {
                    console.log({ error: err });
                    res.redirect('/login');
                });
        }).catch(err => console.log(err));

};

exports.getSignup = (req, res, next) => {
    let message = alertMessage(req);
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        errorMessage: message,
        oldInput: null,
        validationErrors: []
    });
};

exports.postSignup = (req, res, next) => {
    const { email, password, confirmPassword } = req.body;
    const errors = validationResult(req);
    let message = alertMessage(req);
    if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.status(422).render('auth/signup', {
            path: '/signup',
            pageTitle: 'Signup',
            errorMessage: errors.array()[0].msg,
            oldInput: {
                email: email,
                password: password,
                confirmPassword: confirmPassword
            },
            validationErrors: errors.array()
        }
        );
    }

    bcrypt
        .hash(password, 12)
        .then(hash => {
            const newUser = new User({
                email: email,
                password: hash,
                cart: { items: [] }
            });
            return newUser.save();
        })
        .then(result => {
            let msg = createMessage(email);
            // return sgMail
            //     .send(msg)
            //     .then((result) => {
            //         console.log(result);
            //         res.redirect('/login');
            //     })
            //     .catch((error) => {
            //         console.error(error);
            //     });

            return transporter1.sendMail({
                to: email,
                from: 'michaelbruno.tech@protonmail.com',
                subject: 'Signup succeded!',
                html: '<h1>You successfully signed up!</h1>'
            }).then(success => {
                console.log(success);
                res.redirect('/login');
            }).catch(err => console.log(err));

        })
        .catch(err => {
            console.log(err.message);
        });

};

exports.postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        err && console.log(err);
        res.redirect('/');
    });
};



exports.getReset = (req, res, next) => {
    let message = alertMessage(req);
    res.render('auth/reset', {
        path: '/reset',
        pageTitle: 'Password Reset',
        errorMessage: message
    });
};


exports.postReset = (req, res, next) => {
    const { email } = req.body;
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err);
            return res.redirect('/reset');
        }

        const token = buffer.toString('hex');
        User.findOne({ email: email })
            .then(user => {
                if (!user) {
                    req.flash('error', 'No account with the provided email found');
                    return res.redirect('/reset');
                }
                user.resetToken = token;
                user.resetTokenExpiration = Date.now() + 3600000;
                return user.save();
            })
            .then(result => {
                // let msg = createMessage(email);

                // return sgMail
                //     .send(msg)
                //     .then((result) => {
                //         console.log(result);
                //         res.redirect('/');
                //     })
                //     .catch((error) => {
                //         console.error(error);
                //     });

                transporter1.sendMail({
                    to: email,
                    from: 'michaelbruno.tech@protonmail.com',
                    subject: 'Signup succeded!',
                    html: `
                    <p>You requested a password reset</p>
                    <p>Click this <a target="_blank" href="http://localhost:3000/reset/${token}">link</a> to set a new password.</p>
                    `
                })
                    .then(success => {
                        console.log(success);
                        console.log(nodemailer.getTestMessageUrl(success));
                        res.redirect('/');
                    }).catch(err => console.log(err));
            })
            .catch(err => console.log(err));

    });
};


exports.getNewPassword = (req, res, next) => {
    let token = req.params.token;
    User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
        .then(user => {
            let message = alertMessage(req);
            res.render('auth/new-password', {
                path: '/new-password',
                pageTitle: 'New Password',
                errorMessage: message,
                userId: user._id.toString(),
                passwordToken: token
            });
        })
        .catch(err => console.log(err));

};

exports.postNewPassword = (req, res, next) => {
    const { userId, password, passwordToken } = req.body;
    let resetUser;
    User.findOne({ resetToken: passwordToken, resetTokenExpiration: { $gt: Date.now() }, _id: userId })
        .then(user => {
            resetUser = user;
            return bcrypt.hash(password, 12);
        })
        .then(hashedPassword => {
            resetUser.password = hashedPassword;
            resetUser.resetToken = undefined;
            resetUser.resetTokenExpiration = undefined;
            return resetUser.save();
        })
        .then(result => {
            res.redirect('/login');
        })
        .catch(err => console.error(err));
};