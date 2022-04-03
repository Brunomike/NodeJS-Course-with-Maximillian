const fs = require("fs");
const path = require("path");
const Cart = require("./cart");

const p = path.join(
  path.dirname(process.mainModule.filename),
  "data",
  "products.json"
);

const getProductsFromFile = (cb) => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([]);
    } else {
      cb(JSON.parse(fileContent));
    }
  });
};

module.exports = class Product {
  constructor(aId, aTitle, aImageUrl, aDescription, aPrice) {
    this.id = aId;
    this.title = aTitle;
    this.imageUrl = aImageUrl;
    this.description = aDescription;
    this.price = aPrice;
  }

  save() {
    getProductsFromFile(products => {
      if (this.id) {
        const existingProductIndex = products.findIndex(p => p.id === this.id);
        const updatedProducts = [...products];
        updatedProducts[existingProductIndex] = this;

        fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
          console.log(err);
        });             
      } else {
        this.id = Math.random().toString();
        products.push(this);
        fs.writeFile(p, JSON.stringify(products), (err) => {
          console.log(err);
        });
      }
    });
  }

  static delete(id){
    getProductsFromFile(products=>{    
      const selectedProduct = products.find(p=>p.id===id.trim());
      const updatedProducts=products.filter(product=>product.id!==id.trim());        
      fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
        if (!err) {
          Cart.deleteProduct(id,selectedProduct.price);
        }
      });
    })
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }

  static findById(id, cb) {    
    getProductsFromFile(products => {
      const product = products.find(p => p.id === id);      
      cb(product);
    });
  }
};
