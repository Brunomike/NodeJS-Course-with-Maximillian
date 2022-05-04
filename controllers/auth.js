const bcrypt = require('bcryptjs');
const nodeMailer = require('nodemailer');
const sendGridTransport = require('nodemailer-sendgrid-transport');
const User = require('../models/user');

const transporter = nodeMailer.createTransport(sendGridTransport({
    auth: {
        api_key: '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'
    }
}));

exports.getLogin = (req, res, next) => {
    // const isLoggedIn = req
    //     .get('Cookie')
    //     .split(';')[5]
    //     .trim()
    //     .split('=')[1] === 'true';
    //     console.log({cookie:req.get('Cookie')});
    //console.log(isLoggedIn);
    //console.log(req.session.isLoggedIn);
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage: message
    });
};

exports.postLogin = (req, res, next) => {
    const { email, password } = req.body;
        
    // //req.isLoggedIn = true;
    // //res.setHeader('Set-Cookie', 'loggedIn=true; ');
    // req.session.isLoggedIn = true;
    // res.redirect('/');

    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                req.flash('error', 'Invalid email or password');
                return res.redirect('/login');
            }   
            console.log({confirmation:user});
            return bcrypt
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
                    req.flash('error', 'Invalid email or password');                    
                    res.redirect('/login');
                })
                .catch(err => {
                    console.log({ error: err });
                    res.redirect('/login');
                });
        })
        .catch(err => console.log(err));
};

exports.getSignup = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        errorMessage: message
    });
};

exports.postSignup = (req, res, next) => {
    const { email, password, confirmPassword } = req.body;
    User.findOne({ email: email })
        .then((user) => {
            if (user) {
                req.flash('error', 'E-Mail already exists, please pick a different one!');
                return res.redirect('/signup');
            }
            return bcrypt
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
                    res.redirect('/login');
                    return transporter.sendMail({
                        to: email,
                        from: 'shop@node-complete.com',
                        subject: 'Signup succeded!',
                        html: '<h1>You successfully signed up!</h1>'
                    });
                })
                .catch(err => {
                    console.log(err.message);
                });
        })
        .catch(err => {
            console.log(err);
        });
};

exports.postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        err && console.log(err);
        res.redirect('/');
    });
};

