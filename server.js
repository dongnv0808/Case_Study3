const http = require('http');
const fs = require('fs');
const url = require('url')
const qs = require('qs');
const HomeController = require('./controller/home-controller');
const ProductController = require('./controller/product-controller');
const CategoryController = require('./controller/category-controller');
const RestaurantController = require('./controller/restaurant-controller');
const Product = require('./model/product');
const Category = require('./model/category');
const Restaurant = require('./model/restaurant');
const UserController = require('./controller/user-controller');
const User = require('./model/user');



const mimeTypes = {
    "html": "text/html",
    "js": "text/javascript",
    "min.js": "text/javascript",
    "css": "text/css",
    "css.map": "text/css",
    "min.css": "text/css",
    "jpg": "image/jpg",
    "png": "image/png",
    "gif": "image/gif",
    "woff": "text/html",
    "ttf": "text/html",
    "woff2": "text/html",
    "eot": "text/html",
};

// let loginController = new LoginController();
let userController = new UserController();
let homeController = new HomeController();
let productController = new ProductController();
let categoryController = new CategoryController();
let restaurantController = new RestaurantController();
let user = new User();
let product = new Product();
let category = new Category();
let restaurant = new Restaurant();

let server = http.createServer((req, res) => {
    let urlParse = url.parse(req.url);
    let urlPart = urlParse.pathname;
    let method = req.method;

    let filesDefences = req.url.match(/\.js|.css|.css.map|.jpg|.png|.gif|min.js|min.css|.woff|.ttf|.woff2|.eot/);
    if (filesDefences) {
        let filePath = filesDefences[0].toString();
        let extension = mimeTypes[filesDefences[0].toString().split('.')[1]];
        // console.log(extension);
        if (filePath.includes('/')){
            extension = mimeTypes[filesDefences[0].toString().split('/')[1]];
        }
        if (extension.includes('?')){
            extension = extension.split('?')[0];

        }
        res.writeHead(200, { 'Content-Type': extension });
        fs.createReadStream(__dirname + '/template' + '/' + req.url).pipe(res);
        
    }else{

    switch (urlPart) {
        case '/' :{
            if(method == 'GET'){
                homeController.showHomePage(req, res);
            }
            break;
        }
        case '/login' :{
            if(method == 'GET'){
                userController.showLoginForm(req, res);
            }else {
                userController.login(req, res);
            }
            break;
        }
        case '/register':{
            if (method == 'GET'){
                userController.showResisterForm(req, res);

            }else {
                userController.createUser(req, res);
            }
            break;
        }
        case '/createCTV':{
            if (method === 'GET') {
                usercontroller.showFormCreateCTV(req, res);
            }else {

            }
            break;
        }

        case '/admin':{
            userController.showAdminPage(req, res);
            break;
        }

        case '/admin/editUser':{
            let query = qs.parse(urlParse.query);
            let idUpdate = query.id;
            if(method == 'GET'){
                userController.showFormEditUser(req, res, idUpdate);
            } else {
                userController.editUser(req, res, idUpdate);
            }
            break;
        }

        case '/admin/deleteUser':{
            let query = qs.parse(urlParse.query);
            let idDelete = query.id;
            userController.deleteUser(req, res, idDelete);
            break;
        }

        case '/ctv/restaurant':{
            let query5 = qs.parse(urlParse.query);
            let idUser1 = query5.id;
            restaurantController.ShowFormRestaurant(req, res, idUser1);
            break;
        }
        case '/ctv/product':{
            let query8 = qs.parse(urlParse.query);
            let idUser3 = query8.id;
            productController.showProductPage(req, res, idUser3);
            break;
        }

        case '/createRestaurant':{
            let query6 = qs.parse(urlParse.query);
            let idUser2 = query6.id;
            restaurantController.createRestaurant(req, res, idUser2)
            break;
        }

        case '/ctv/deleteRestaurant':{
            let query7 = qs.parse(urlParse.query);
            let idRestaurant = query7.id;
            restaurant.deleteRestaurant(req, res, idRestaurant);
            break;
        }

        case '/ctv/createCategory':{
            if (method === 'GET') {
                categoryController.showFormCreateCategory(req, res);
            }else {
                categoryController.createCategory(req, res)
            };
            break;
        }
        case '/ctv/createProduct':{
            if (method === 'GET'){
                productController.showFormCreateProduct(req, res);
            }else {
                productController.createProduct(req, res);
            }
            break;
        }

        case '/ctv/editProduct':{
            let query = qs.parse(urlParse.query);
            let idUpdate = query.id;
            if(method === 'GET') {
                productController.showFormEditProduct(req, res);
            }else {
                productController.editProduct(req, res, idUpdate);
            }
            break;
        }
        case '/ctv/deleteProduct':{
            let query1 = qs.parse(urlParse.query);
            let idDelete = query1.id;
            product.deleteProduct(req, res, idDelete);
            break;
        }

        case '/ctv/editCategory':{
            let query2 = qs.parse(urlParse.query);
            let idUpdate1 = query2.id;
            if(method === 'GET') {
                categoryController.showFormEditCategory(req, res);
            }else {
                categoryController.editCategory(req, res, idUpdate1);
            }
            break;
        }
        case '/ctv/deleteCategory':{
            let query3 = qs.parse(urlParse.query);
            let idDelete1 = query3.id;
            category.deleteCategory(idDelete1);
            break;
        }
        case '/list': {
            let query = qs.parse(urlParse.query);
            let idCategory = query.id;
            if(method == 'GET'){
                homeController.showListProduct(req, res, idCategory);
            }
            break;
        }
        case '/detail': {
            let query = qs.parse(urlParse.query);
            let idProduct = query.id;
            if(method == 'GET'){
                homeController.showDetail(req, res, idProduct);
            }
            break;
        }
    }};
});

server.listen(8080, () => {
    console.log('server running is localhost:8080');
})
