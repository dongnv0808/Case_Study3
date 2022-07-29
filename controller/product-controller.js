const fs = require('fs');
const qs = require('qs');
const HomeController = require('../controller/home-controller')
const Product = require('../model/product');

let homeController = new HomeController();

class ProductController {
    constructor() {
        this.product = new Product();
    }

    showProductPage(req, res, idUser) {
        fs.readFile('template/views/ctv.html', 'utf-8', async (err, data) => {
            if (err) {
                console.log('show admin page err' + err);
                HomeController.show404Page(req, res);
            } else {
                let product = await this.product.getAllProduct(req, res, idUser);
                let tbody = '';
                for (const pro of product) {
                    tbody += `<tr class="table">
                                <td>${pro.id}</td>
                                <td>${pro.name}</td>
                                <td>${pro.image}</td>
                                <td>${pro.price}</td>
                                <td>${pro.promotionalprice}</td>
                                <td>
                                    <a href="/ctv/editProduct?id=${pro.id}" class="btn btn-primary">Sửa</a>
                                </td>
                                <td>
                                    <a href="/ctv/deleteProduct?id=${pro.id}" class="btn btn-danger">Xoá</a>
                                </td>
                            </tr>`
                };
                let divCategory = '';
                divCategory +=`<li>
                <a href="/ctv/product?id=${idUser}">
                    <i data-feather="calendar"></i>
                    <span> Quản Lý Món ăn </span>
                </a>
                </li>
                <li>
                    <a href="/ctv/restaurant?id=${idUser}">
                        <i data-feather="calendar"></i>
                        <span> Quản Lý Nhà hàng </span>
                    </a>
                </li>`
                data = data.replace('{product}', tbody);
                data = data.replace('{iduser}', idUser);
                data = data.replace('{divCategory}', divCategory);
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write(data);
                return res.end();
            }
        });
    }

    showFormCreateProduct(req, res) {
        fs.readFile('template/views/create.html', 'utf-8', (err, data)  => {
            if(err) {
                homeController.show404Page(req, res);
            }else {
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write(data);
                return res.end();
            }
        })
    };

    showFormEditProduct(req, res) {
        fs.readFile('template/views/edit.html', 'utf-8', (err, data)  => {
            if(err) {
                homeController.show404Page(req, res);
            }else {
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write(data);
                return res.end();
            }
        })
    }

    createProduct (req, res) {
        let data = '';
        req.on('data', (chuck) => {
            data += chuck;
        });
        req.on('end', () => {
            let product = qs.parse(data);
            this.product.createProduct(product);
            res.writeHead(301, {
                location: '/ctv/createProduct'
            });
            return res.end();
        })
    };

    editProduct (req, res, idUpdate) {
        let data = '';
        req.on('data', (chuck) => {
            data += chuck;
        });
        req.on('end', () => {
            let product = qs.parse(data);
            this.product.editProduct(product, idUpdate);
            res.writeHead(301, {
                location: '/ctv/editProduct'
            });
            return res.end();
        })
    }
};
module.exports = ProductController;