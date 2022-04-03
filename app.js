const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
//const {engine}=require("express-handlebars");

const app = express();

//app.engine('hbs',engine({layoutsDir:'views/layouts/',defaultLayout:'main-layout',extname:'hbs'}));
app.set('view engine','ejs');
app.set('views','./views');


const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const errorController=require("./controllers/error");

app.enable('view cache');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname,"public")));

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

app.listen(3000);
