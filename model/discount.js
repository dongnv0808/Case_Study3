const Connection = require("./connection");

class Discount{
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

    getAllDiscount(){
        return new Promise((resolve, rejects) => {
            this.connection.query('select * from discount;', (err, data) => {
                if(err){
                    rejects(err);
                } else {
                    resolve(data);
                }
            });
        });
    }

    createDiscount(discount){
        let insertQuery = `insert into discount(id, name, value) 
        values('${discount.id}', ${discount.name}, ${discount.value}';)`;
        this.connection.query(insertQuery, (err, data) => {
            if(err){
                console.log(err);
            }else{
                console.log('Create Succes!');
            }
        });        
    }

    getDiscountById(id){
        return new Promise((resolve, rejects) => {
            let query = `select * from discount where id=${id}`;
            this.connection.query(query, (err, data) =>{
                if(err){
                    rejects(err);
                }else{
                    resolve(data);
                }
            })
        })
    }

    updateDiscount(id, discount){
        let query = `update discount set id='${discount.id}', name='${discount.name}', value='${discount.value}' where id=${id};`
        this.connection.query(query, (err, data)=>{
            if(err){
                console.log(err);
            }else{
                console.log('Update success');
            }
        })
    }
}

module.exports = Discount;