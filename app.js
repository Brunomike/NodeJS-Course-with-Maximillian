require("dotenv").config();
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const logger = require("morgan");
const mongoose=require("mongoose");
const port = process.env.PORT || 3000;

const app = express();

app.set('view engine', 'ejs');
app.set('views', './views');

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");


const errorController = require("./controllers/error");
const mongoConnect = require("./utils/database").mongoConnect;
const User = require("./models/user");

//app.enable('view cache');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(logger('dev'));

app.use((req, res, next) => {
    User.findById('62513eb1ec9a960c5086b42f')
        .then(user => {
            req.user = new User(user.name, user.email, user.cart, user._id);
            next();
        })
        .catch((err) => console.log(err.message));
    //next();

});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);




mongoConnect(() => {
    app.listen(port, err => {
        if (err) console.log(err.message);
        console.log(`Listening on http://localhost:${port}`);
    });
});