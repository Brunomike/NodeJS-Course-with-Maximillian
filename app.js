const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const logger = require("morgan");
const port = process.env.PORT || 3000;

const db = require("./utils/database");
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

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

app.use((req,res,next)=>{
    User.findOne({where:{id:1}})
    .then(user=>{
        req.user=user;
        next();
    })
    .catch((err)=>console.log(err.message));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);


Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product,{through:CartItem});
Product.belongsToMany(Cart,{through:CartItem});
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product,{through:OrderItem});


db
//.sync({force:true})
.sync()
    .then(result => {
        //console.log(result);
        return User.findOne({ where: { id: 1 } });
    })
    .then(user => {
        if (!user) {
            return User.create({ name: "Michael", email: 'michael@test.com' });
        }
      return Promise.resolve(user);
    })
    .then(user => {        
        return user.createCart();
        
    }).then(cart => {
        app.listen(port, err => {
            err ? console.log(err.message) : console.log(`Listening on http://localhost:${port}`);
        });
    })
    .catch(err => {
        console.log(err);
    });
