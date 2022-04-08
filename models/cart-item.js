const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');

const CartItem = sequelize.define('cartItem', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    quantity:{
        type:DataTypes.INTEGER
    }

})

module.exports = CartItem;