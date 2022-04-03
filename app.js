const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const logger = require("morgan");
const db = require("./utils/database");
const port = process.env.PORT || 3000

const app = express();

app.set('view engine', 'ejs');
app.set('views', './views');

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const errorController = require("./controllers/error");

//app.enable('view cache');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(logger('dev'));

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

app.listen(port, err => {
    err ? console.log(err.message) : console.log(`Listening on http://localhost:${port}`)
});
