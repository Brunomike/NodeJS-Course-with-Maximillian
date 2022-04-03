const db = require("../utils/database");
const Cart = require("./cart");

module.exports = class Product {
    constructor(aId, aTitle, aImageUrl, aDescription, aPrice) {
        this.id = aId;
        this.title = aTitle;
        this.imageUrl = aImageUrl;
        this.description = aDescription;
        this.price = aPrice;
    }

    save() {

    }

    static delete(id) {

    }

    static fetchAll() {
        return db.execute('SELECT * FROM products');
    }

    static findById(id) {

    }
};
