const qs = require('qs');
const Restaurant = require('../model/restaurant');
const fs = require("fs");
const Home = require('../controller/home-controller')

class RestaurantController {
    constructor() {
        this.restaurant = new Restaurant();
    }

    createRestaurant(req, res, idUser) {
        let data = '';
        req.on('data', (chuck) => {
            data += chuck;
        });
        req.on('end', () => {
            let restaurant = qs.parse(data);
            this.restaurant.createRestaurant(restaurant, idUser);
            res.writeHead(301, {
                location: '/createRestaurant'
            });
            return res.end();
        })

    }

    ShowFormRestaurant(req, res, idUser) {
        console.log('idUser: '+idUser)
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
                data = data.replace('{restaurant}', tbody);
                data = data.replace('{iduser}', idUser);
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write(data);
                return res.end();
            }
        });
    }

};
module.exports = RestaurantController;