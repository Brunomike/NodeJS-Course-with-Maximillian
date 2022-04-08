const {Sequelize,DataTypes} = require('sequelize');

const sequelize = require('../utils/database');

const Product = sequelize.define('product', {
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    title:{
        type:DataTypes.STRING,
        allowNull:false
    },
    price:{
        type:DataTypes.DOUBLE,
        allowNull:false
    },
    imageUrl:{
        type:DataTypes.TEXT,
        allowNull:false
    },
    description:{
        type:DataTypes.TEXT,
        allowNull:false
    }
});

module.exports=Product;

