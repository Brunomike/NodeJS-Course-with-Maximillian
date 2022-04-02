const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
//const {engine}=require("express-handlebars");

const app = express();

//app.engine('hbs',engine({layoutsDir:'views/layouts/',defaultLayout:'main-layout',extname:'hbs'}));
app.set('view engine','ejs');
app.set('views','./views');


const adminData = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.enable('view cache');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname,"public")));

// app.use("/", (req, res, next) => {
//   //console.log("This always runs");
//   next();
// });

app.use("/admin", adminData.routes);
app.use(shopRoutes);

app.use((req, res, next) => {
  //res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
  res.render("404",{docTitle:"Page Not Found!"});
});

app.listen(3000);
