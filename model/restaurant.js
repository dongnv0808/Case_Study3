const Connection = require("./connection");

class Restaurant{
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

    getRestaurantById(idUser) {
        return new Promise((resolve, rejects) => {
            this.connection.query(`select *
                                   from restaurant
                                   join users on restaurant.idUser = users.id
                                   where restaurant.idUser = ${idUser};`, (err, data) => {
                if (err) {
                    rejects(err);
                } else {
                    resolve(data);
                }
            });
        });
    }

    createRestaurant(restaurant, idUser) {
        let insertQuery = `insert into restaurant(name, operatingTime, address, iduser)
                           values ('${restaurant.name}, ${restaurant.operatingTime}, ${restaurant.address}, ${idUser}';
        )`;
        this.connection.query(insertQuery, (err, data) => {
            if (err) {
                console.log(err);
            } else {
                console.log('Create Succes!');
            }
        });
    }

    getRestaurantById(id){
        return new Promise((resolve, rejects) => {
            let query = `select * from restaurant where id=${id}`;
            this.connection.query(query, (err, data) =>{
                if(err){
                    rejects(err);
                }else{
                    resolve(data);
                }
            })
        })
    }

    updateRestaurant(id, restaurant) {
        let query = `update restaurant
                     set name='${restaurant.name}',
                         operatingtime='${restaurant.operatingtime}',
                         address=${restaurant.address}
                     where id = ${id};`
        this.connection.query(query, (err, data) => {
            if (err) {
                console.log(err);
            } else {
                console.log('Update success');
            }
        })
    }

    deleteRestaurant(req, res, idRestaurant) {
        let insertQuery = `DELETE
                           FROM restaurant
                           WHERE id = '${idRestaurant}';`
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
}

module.exports = Restaurant;