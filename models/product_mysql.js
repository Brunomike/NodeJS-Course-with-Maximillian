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
        return db.execute('INSERT INTO products (title,price,imageUrl,description) VALUES (?,?,?,?)',
            [this.title, this.price, this.imageUrl, this.description]
        );
    }

    static delete(id) {
        
    }

    static fetchAll() {
        return db.execute('SELECT * FROM products');
    }

    static findById(id) {
        return db.execute('SELECT * FROM products WHERE products.id = ?',[id]);
    }
};
