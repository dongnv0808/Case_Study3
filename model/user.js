let Connection = require('../model/connection');
const {combine} = require("qs/lib/utils");
const qs = require('qs');
const fs = require('fs');
const { rejects } = require('assert');
const { resolve } = require('path');

class User {
    
    constructor() {
        this.connection = Connection.createConnection();
        this.connection.connect((err) => {
            if (err) {
                console.log(err)
            }else {
                console.log('connect success!')
            }
        });
    }

    getUserById(id) {
        return new Promise((resolve, reject) => {
            this.connection.query(`select * from users where id=${id};`, (err, data) => {
                if(err) {
                    return reject (err)
                }else {
                    return resolve (data)
                }
            });
        });
    }

    getUser() {
        return new Promise((resolve, reject) => {
            this.connection.query(`select * from users;`, (err, data) => {
                if(err) {
                    return reject (err)
                }else {
                    return resolve (data)
                }
            });
        });
    }

    createUser(user) {
        let insertQuery = `insert into users (name, password, email, phone) VALUES
                                                                                ('${user.name}', '${user.password}', '${user.email}', '${user.phone}');`
        this.connection.query(insertQuery, (err, data) => {
            if (err) {
                console.log('create error: ' + err)
            }else {
                console.log('create user success!')
            }
        })
    };

    //Tạo role
    createRole(email) {
        let selectQuery = `select id from users where email = '${email}';`
        this.connection.query(selectQuery, (err, data) => {
            console.log(data);
            if (err) {
                console.log('create error: ' + err)
            }else {
                let insertQuery = `insert into role_user (idRole, idUser) VALUES (2, ${data[0].id});`
                this.connection.query(insertQuery, (err, data) => {
                    if (err) {
                        console.log('create error: ' + err)
                    }else {
                        console.log('create role success!')
                    }
                })
            }
        })

    };

    //Check role

    checkRole(user) {
        return new Promise((resolve, reject) => {
            let selectQuery = `select idrole from role_user where iduser = ${user.id}`;
            this.connection.query(selectQuery, (err, data) => {
                if (err) {
                     reject(err);
                }else {
                    resolve(data);
                }
            });
        });
    };

    updateUser(User, idUser){
        return new Promise((rejects, resolve) => {
            console.log(idUser);
            let updateQuery = (`update users set name='${User.name}', email='${User.email}', phone='${User.phone}' where id=${idUser}`);
            this.connection.query(updateQuery, (err, data) => {
                if(err){
                    rejects(err);
                } else {
                    resolve('Update Success!');
                }
            })
        })
    };

    removeUser(id){
            let deleteQuery = `delete from users where id=${id}`
            this.connection.query(deleteQuery, (err, data) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log('delete Success!');
                    res.writeHead(301, {
                        location: '/admin'
                    });
                    return res.end();
                }
            })
        }
};
module.exports = User;
