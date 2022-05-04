const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const orderSchema = new Schema({
    products: [
        {
            product: { type: Object, required: true },
            quantity: { type: Number, required: true }
        }
    ],
    user:{
        email:{type: String, required: true},
        userId:{type: Schema.Types.ObjectId,required:true,ref:'User'},        
    }
});

module.exports = mongoose.model('Order', orderSchema);

// const { DataTypes } = require('sequelize');
// const sequelize = require('../utils/database');

// const Order = sequelize.define('order', {
//     id: {
//         type: DataTypes.INTEGER,
//         autoIncrement: true,
//         allowNull: false,
//         primaryKey: true
//     }
// })

// module.exports = Order;