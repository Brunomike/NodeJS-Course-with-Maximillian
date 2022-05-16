require("dotenv").config();
const path = require("path");
const fs = require('fs');
const https = require('https');

const express = require("express");
const session = require('express-session');
const bodyParser = require("body-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const MongoDBStore = require('connect-mongodb-session')(session);
const flash = require('connect-flash');
const csrf = require('csurf');
const multer = require('multer');
const helmet = require('helmet');
const compression = require('compression');
const port = process.env.PORT || 3000;

const errorController = require("./controllers/error");
const User = require("./models/user");

const app = express();
const store = new MongoDBStore({
    uri: process.env.MONGO_DB_DRIVER,
    collection: 'sessions'
});
const csrfProtection = csrf();

const privateKey = fs.readFileSync('server.key');
const certificate = fs.readFileSync('server.cert');

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './images');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true);
    } else {
        cb(null, false);
    }
    //cb(new Error('I don\'t have a clue!'));
};

app.set('view engine', 'ejs');
app.set('views', './views');

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require('./routes/auth');
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'),
    { flags: 'a' }
);

//app.enable('view cache');
app.use(helmet());
app.use(compression());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'));
app.use(express.static(path.join(__dirname, "public")));
app.use('/images', express.static(path.join(__dirname, "images")));

app.use(logger('dev', { stream: accessLogStream }));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store
}));
app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
        .then(user => {
            if (!user) {
                return next();
            }
            req.user = user;
            next();
        })
        .catch(err => {
            next(new Error(err));
        });
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get('/500', errorController.get500);
app.use(errorController.get404);

app.use((error, req, res, next) => {
    console.log(error);
    res.redirect('/500');
});

mongoose.connect(process.env.MONGO_DB_DRIVER, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then((result) => {
        //console.log({ db: result });
        // app.listen(port, err => {
        //     if (err) console.log(err.message);
        //     console.log(`Listening on http://localhost:${port}`);
        // });

        https.createServer({ key: privateKey, cert: certificate }, app).listen(port, err => {
            if (err) console.log(err.message);
            console.log(`Listening on http://localhost:${port}`);
        });
    }).catch(err => console.log(err.message));


