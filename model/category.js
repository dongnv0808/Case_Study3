const Connection = require("./connection");

class Category{
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

    getCategory(){
        return new Promise((resolve, rejects) => {
            this.connection.query('select * from category;', (err, data) => {
                if(err){
                    rejects(err);
                } else {
                    resolve(data);
                }
            });
        });
    }

    createCategory(category){
        let insertQuery = `insert into category (name, type, image) values('${category.name}', '${category.type}','${category.image}')`;
        this.connection.query(insertQuery, (err, data) => {
            if(err){
                console.log(err);
            }else{
                console.log('Insert Success!');
            }
        });        
    }

    getCategoryById(id){
        return new Promise((resolve, rejects) => {
            let query = `select * from category where id=${id}`;
            this.connection.query(query, (err, data) =>{
                if(err){
                    rejects(err);
                }else{
                    resolve(data);
                }
            })
        })
    }

    getCategoryByType(type){
        return new Promise((resolve, rejects) => {
            let query = `select * from category where type=${type}`;
            this.connection.query(query, (err, data) =>{
                if(err){
                    rejects(err);
                }else{
                    resolve(data);
                }
            })
        })
    }

    updateCategory(id, category){
        let query = `update category set name='${category.name}', type='${category.type}', image='${category.image}' where id=${id};`
        this.connection.query(query, (err, data)=>{
            if(err){
                console.log(err);
            }else{
                console.log('Update success');
            }
        })
    }
};
module.exports = Category;