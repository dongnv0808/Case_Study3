const qs = require('qs');
const Restaurant = require('../model/restaurant');
const fs = require("fs");
const Home = require('../controller/home-controller')

class RestaurantController {
    constructor() {
        this.restaurant = new Restaurant();
    }
    showFormCreateRestaurant(req, res){
        fs.readFile('template/views/ctv-createrestaurant.html','utf-8',(err, data) => {
            if(err){
                console.log(err);
            }
            else{
                res.writeHead(200,{'Content-Type':'text/html'});
                res.write(data);
                return res.end(); 
            }
        });
    }
    createNewRestaurant(req, res, idUser) {
        let data = '';
        req.on('data', (chuck) => {
            data += chuck;
            console.log(data)
        });
        req.on('end', () => {
            let restaurant = qs.parse(data);
            console.log(restaurant.name)
            this.restaurant.createRestaurant(restaurant, idUser);
            res.writeHead(301, {
                location: `/ctv/restaurant?id=${idUser}`
            });
            return res.end();
        })

    }

    ShowFormRestaurant(req, res, idUser) {
        fs.readFile('template/views/ctv-restaurant.html', 'utf-8', async (err, data) => {
            if (err) {
                console.log('show admin page err' + err);
                Home.show404Page(req, res);
            } else {
                let restaurant = await this.restaurant.getRestaurantById(idUser);
                let tbody = '';
                for (const res of restaurant) {
                    tbody += `<tr class="table">
                                <td>'${res.name}'</td>
                                <td>'${res.operatingtime}'</td>
                                <td>'${res.address}'</td>
                                <td>
                                    <a href="/ctv/deleteRestaurant?id=${res.id}" class="btn btn-danger">Xoá</a>
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
                let addNew = '';
                addNew += `<a href="/ctv/createRestaurant?id=${idUser}" class="btn btn-info">Thêm mới</a>`
                data = data.replace('{restaurant}', tbody);
                data = data.replace('{iduser}', idUser);
                data = data.replace('{divCategory}', divCategory);
                data = data.replace('{addNew}', addNew);
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write(data);
                return res.end();
            }
        });
    }

};
module.exports = RestaurantController;