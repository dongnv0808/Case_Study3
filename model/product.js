const Connection = require("./connection");

class Product{
    constructor(){
        this.connection = Connection.createConnection();
        this.connection.connect((err) => {
            if(err){
                console.log(err);
            } else {
                console.log('Connect success!');
            }
        });
    }
    getCountProductByCategory(){ 
        return new Promise((resolve, rejects) => {
            this.connection.query(`select c.image, c.name, count(p.id) as 'count', c.id from product p join category c on p.idcategory = c.id group by p.idcategory;`, (err, data) =>{
                if(err){
                    rejects(err);
                }else{
                    resolve(data);
                }
            });
        })
    }
    getProductHome(){
        return new Promise((resolve, rejects) => {
            this.connection.query('select p.id as idproduct, p.name as productname, p.image as productimage, p.price, p.preparationtime, c.name as namecategory, r.address from product p join category c on p.idcategory = c.id join restaurant r on r.id = c.idrestaurant group by p.idcategory;', (err, data) => {
                if(err){
                    rejects(err);
                } else {
                    resolve(data);
                }
            });
        });
    }
    getProductByIdCategory(id){
        return new Promise((resolve, rejects) => {
            this.connection.query(`select p.id, p.name as nameproduct, p.image as productimage, p.price, p.preparationtime, c.name as namecategory, r.address from product p join category c on p.idcategory = c.id join restaurant r on r.id = c.idrestaurant where p.idcategory=${id} group by p.id;`, (err, data) => {
                if(err){
                    rejects(err);
                } else {
                    resolve(data);
                }
            });
        });
    }

    getProductByNameProduct(name){
        return new Promise((resolve, rejects) => {
            this.connection.query(`select p.id, p.name as nameproduct, p.image as productimage, p.price, p.preparationtime, c.name as namecategory, r.address from product p join category c on p.idcategory = c.id join restaurant r on r.id = c.idrestaurant where p.nameproduct=${name};`, (err, data) => {
                if(err){
                    rejects(err);
                } else {
                    resolve(data);
                }
            });
        });
    }
    
    getProductDetail(id){
        return new Promise((resolve, rejects) => {
            this.connection.query(`select p.name as productname, p.image , r.address, p.preparationtime, p.price, r.name as restaurantname, r.operatingtime, c.id as categoryid, c.image as imagecategory, c.name as categoryname, t.slug from product p join category c on p.idcategory = c.id join restaurant r on r.id = c.idrestaurant join tag t on p.idtag = t.id where p.id=${id};`, (err, data) => {
                if(err){
                    rejects(err);
                } else {
                    resolve(data);
                }
            });
        });
    }

    getProductById(id){
        return new Promise((resolve, rejects) => {
            let query = `select * from product where id=${id}`;
            this.connection.query(query, (err, data) =>{
                if(err){
                    rejects(err);
                }else{
                    resolve(data);
                }
            })
        })
    }

    //show tất cả product
    getAllProduct(req, res, idUser) {
        return new Promise((resolve, reject) => {
            this.connection.query(`select *
                                   from product
                                    join category on product.idCategory = category.id
                                    join restaurant on restaurant.id = category.idrestaurant
                                    join users on users.id = restaurant.idUser
                                   where users.id = ${idUser};`, (err, data) => {
                if (err) {
                    return reject(err)
                } else {
                    return resolve(data)
                }
            });
        });
    };

    //tạo product
    createProduct(product) {
        let insertQuery = `insert into product (name, image, price, promotionalprice, serviceprice, servicenode,
                                                preparationtime, creationdate, editdateend)
                           values ('${product.name}', '${product.image}', '${product.promotionalprice}',
                                   '${product.serviceprice}', '${product.servicenode}', '${product.preparationtime}',
                                   ${product.creationdate}, ${product.editdateend};
        )`;
        this.connection.query(insertQuery, (err, data) => {
            if (err) {
                console.log(err);
            } else {
                console.log('Create Succes!');
            }
        });
    };

    //sửa product
    editProduct(data, productID) {
        let insertQuery = `UPDATE product p
                           SET p.name             = '${data.name}',
                               p.price            = '${data.price}',
                               p.promotionalprice = '${data.promotionalprice}'
                           WHERE p.id = ${productID};`;
        this.connection.query(insertQuery, (err, data) => {
            if (err) {
                console.log(err);
            } else {
                console.log('update Success!');
                res.writeHead(301, {
                    location: '/ctv'
                });
                return res.end();
            }
        });
    }
    
    //xoá product
    deleteProduct(req, res, productID) {
        let insertQuery = `DELETE
                           FROM product
                           WHERE id = '${productID}';`
        this.connection.query(insertQuery, (err, data) => {
            if (err) {
                console.log(err);
            } else {
                console.log('delete Success!');
                res.writeHead(301, {
                    location: '/ctv'
                });
                return res.end();
            }
        })
    }
    SearchProductByName(name) {
        return new Promise((resolve, reject) => {
            let insertQuery = `select p.id, p.name as nameproduct, p.image as productimage, p.price, p.preparationtime, c.name as namecategory, r.address from product p join category c on p.idcategory = c.id join restaurant r on r.id = c.idrestaurant where p.name like '%${name}%' group by p.id;`;
            this.connection.query(insertQuery, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        })
    }
};
module.exports = Product;