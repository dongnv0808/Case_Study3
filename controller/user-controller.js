const fs = require('fs');
const qs = require('qs');
const mysql = require('mysql');
const User = require('../model/user');
const Product = require('../model/product');
const HomeController = require('./home-controller');

class UserController{
    constructor(){
        this.user = new User();
        this.product = new Product();
        this.home = new HomeController();
    }
    
    //show form đăng nhập
    showLoginForm(req, res) {
        fs.readFile('template/login.html', 'utf-8', (err, data) => {
            if (err) {
                console.log(err);
            } else {
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write(data);
                return res.end();
            }
        })
    };

    //lấy dữ liệu nhập vào để đối chiếu với database
    login(req, res) {
        let success = false;
        let data = '';
        req.on('data', chuck => {
            data += chuck
        });
        req.on('end', async () => {
            let userInfo = qs.parse(data);
            let dataUser = await this.user.getUser();
            for (let user of dataUser) {
                if (userInfo.email === user.email && userInfo.password === user.password) {
                    let role = await this.user.checkRole(user);
                    if (role[0].idrole === 0) {
                        res.writeHead(301, {
                            location: `/admin`
                        });
                        return res.end();
                    } else if (role[0].idrole === 1 && role[1].idrole === 2) {
                        res.writeHead(301, {
                            location: `/ctv/restaurant?id=${user.id}`
                        });
                        return res.end();
                    } else if (role[0].idrole === 2) {
                        res.writeHead(301, {
                            location: `/home/user?id=${user.id}`
                        });
                        return res.end();
                    }
                    ;
                    success = true;
                    break;
                }
            }
            if (success === false) {
                console.log('tài khoản không tồn tại!');
            }
        })
    };

    //show form đăng kí
    showResisterForm(req, res) {
        fs.readFile('template/register.html', 'utf-8', (err, data) => {
            if (err) {
                console.log(err);
                this.home.show404Page(req, res);
            } else {
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write(data);
                return res.end();
            }
        });
    };

    // tạo tài khoản mới
    createUser(req, res) {
        let data = '';
        req.on('data', (chuck) => {
            data += chuck;
        });
        req.on('end', async () => {
            let success = true;
            let user = qs.parse(data);
            let regexPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
            let regexEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
            console.log(user.password)
            console.log(user.passwordConfirm)
            if (!regexPassword.test(user.password)) {
                console.log('Mật khẩu phải có hơn 8 kí tự và ít nhất 1 số!');
            } else if (!regexEmail.test(user.email)) {
                console.log('Email chưa đúng định dạng!');
            } else {
                if (user.password !== user.passwordConfirm) {
                    console.log('Mật khẩu xác nhận không đúng!');
                } else {
                    let dataUser = await this.user.getUser();
                    for (let users of dataUser) {
                        if (user.email === users.email) {
                            console.log('email đã tồn tại!')
                            success = false;
                        } else if (user.phone === users.phone) {
                            console.log('Số điện thoại đã tồn tại')
                            success = false;
                        }
                    }
                    ;
                    if (success === true) {
                        this.user.createUser(user);
                        this.user.createRole(user.email);
                        res.writeHead(301, {
                            location: '/register'
                        });
                        return res.end();
                    }
                }
            }
        })
    };

    //show Form đăng kí cộng tác viên
    showFormCreateCTV(req, res) {
        fs.readFile('template/registerCTV.html', 'utf-8', (err, data) => {
            if (err) {
                console.log(err);
                this.home.show404Page(req, res);
            } else {
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write(data);
                return res.end();
            }
        });
    }

    //Mở trang admin
    showAdminPage(req, res) {
        fs.readFile('template/views/admin.html', 'utf-8', async(err, data) => {
            if (err) {
                console.log('show admin page err' + err);
                this.home.show404Page(req, res);
            } else {
                let users = await this.user.getUser();
                let tbody = '';
                for (const user of users) {
                    tbody +=`<tr class="table">
                    <td>${user.id}</td>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>${user.phone}</td>
                    <td>${user.idrestaurant}</td>
                    <td>
                        <a href="/admin/editUser?id=${user.id}" class="btn btn-primary">Sửa</a>
                    </td>
                    <td>
                        <a href="/admin/deleteUser?id=${user.id}" class="btn btn-danger">Xóa</a>
                    </td>
                    </tr>`
                }
                data = data.replace('{listuser}', tbody);
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write(data);
                return res.end();
            }
                
            });
    };
    showFormEditUser(req, res, idUpdate) {
        fs.readFile('template/views/edit_user.html', 'utf-8', async(err, data)  => {
            if(err) {
                homeController.show404Page(req, res);
            }else {
                let users = await this.user.getUserById(idUpdate);
                console
                data = data.replace('{name}', users[0].name);
                data = data.replace('{phone}', users[0].phone);
                data = data.replace('{email}', users[0].email);
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write(data);
                return res.end();
            }
        })
    }
    editUser (req, res, idUpdate) {
        let data = '';
        req.on('data', (chuck) => {
            data += chuck;
        });
        req.on('end', () => {
            let user = qs.parse(data);
            this.user.updateUser(user, idUpdate);
            res.writeHead(301, {
                location: '/admin'
            });
            return res.end();
        })
    }

    deleteUser(req, res, userId){
        this.user.removeUser(userId);
    }
}

module.exports = UserController;