const Sequelize = require('sequelize');

const sequelize = new Sequelize('node-complete', 'root', '##Dingili##11', {
    dialect: 'mysql',
    host:'localhost',
});

module.exports=sequelize;