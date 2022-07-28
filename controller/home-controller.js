const fs = require('fs');
const Category = require('../model/category');
const Product = require('../model/product');

class HomeController{
    constructor(){
        this.category = new Category();
        this.product = new Product();
    }
    showHomePage(req, res){
        fs.readFile('template/home.html', 'utf-8', async(err, data) => {
            if(err){
                console.log('File khong ton tai!');
            }else{
                res.writeHead(200, {'Content-Type':'text/html'});
                let divCategory = '';
                let categories = await this.product.getCountProductByCategory();
                for(let category of categories){
                    divCategory += `<div class="item">
                    <div class="osahan-category-item">
                        <a href="/list?id=${category.id}">
                            <img class="img-fluid" src="image/${category.image}" alt="">
                            <h6>${category.name}</h6>
                            <p>${category.count}</p>
                        </a>
                    </div>
                </div>`
                }
                let products = await this.product.getProduct();
                let divProduct = '';
                for(let product of products){
                    console.log(product.id)
                    divProduct +=`<div class="col-md-3 col-sm-6 mb-4">
                    <div class="list-card bg-white rounded overflow-hidden position-relative shadow-sm">
                        <div class="list-card-image">
                            <div class="favourite-heart text-danger position-absolute"><a href="#"><i
                                        class="icofont-heart"></i></a></div>
                            <div class="member-plan position-absolute"><span class="badge badge-dark">Promoted</span>
                            </div>
                            <a href="/detail?id=${product.id}">
                                <img src="image/${product.productimage}" class="img-fluid item-img">
                            </a>
                        </div>
                        <div class="p-3 position-relative">
                            <div class="list-card-body">
                                <h6 class="mb-1"><a href="#" class="text-black">${product.nameproduct}</a></h6>
                                <p class="text-gray mb-2">${product.address}</p>
                                <p class="text-gray mb-3 time"><span
                                    class="bg-light text-dark rounded-sm pl-2 pb-1 pt-1 pr-2"><i
                                        class="icofont-wall-clock"></i>${product.preparationtime}</span> <span
                                    class="float-right text-black-50"> ${product.price}</span></p>
                            </div>
                            <div class="list-card-badge">
                                <small>${product.namecategory}</small>
                            </div>
                        </div>
                    </div>
                </div>`
                }
                data = data.replace('{categories}', divCategory);
                data = data.replace('{product}', divProduct);
                res.write(data);
                return res.end();
            }
        });
    }
    showListProduct(req, res, id){
        fs.readFile('template/listing.html', 'utf-8', async(err, data) => {
            if(err){
                console.log('File khong ton tai!');
            }else{
                res.writeHead(200, {'Content-Type':'text/html'});
                let divCategoryList = '';
                let categoryList = await this.category.getCategory();
                for(let category of categoryList){
                    divCategoryList += 
                    `<div class="filters-header border-bottom pl-4 pr-4 pt-3 pb-3">
                        <a href="/list?id=${category.id}" class="btn-link" >${category.name}</a>
                    </div>`
                }
                let categoryScrool = await this.product.getCountProductByCategory();
                let divCategoryScrool = '';
                for(let category of categoryScrool){
                    divCategoryScrool += 
                    `<div class="item">
                    <div class="osahan-category-item">
                        <a href="/list?id=${category.id}">
                            <img class="img-fluid" src="image/${category.image}" alt="">
                            <h6>${category.name}</h6>
                            <p>${category.count}</p>
                        </a>
                    </div>
                    </div>`
                }
                let products = await this.product.getProductByIdCategory(id);
                let divProduct = '';
                for(let product of products){
                    console.log(product.id)
                    divProduct +=`<div class="col-md-4 col-sm-6 mb-4 pb-2">
                            <div class="list-card bg-white h-100 rounded overflow-hidden position-relative shadow-sm">
                                <div class="list-card-image">
                                    
                                    <div class="favourite-heart text-danger position-absolute"><a href="detail.html"><i
                                                class="icofont-heart"></i></a></div>
                                    <a href="/detail?id=${product.id}">
                                        <img src="image/${product.productimage}" class="img-fluid item-img">
                                    </a>
                                </div>
                                <div class="p-3 position-relative">
                                    <div class="list-card-body">
                                        <h6 class="mb-1"><a href="detail.html" class="text-black">${product.nameproduct}</a></h6>
                                        <p class="text-gray mb-3">${product.address}</p>
                                        <p class="text-gray mb-3 time"><span
                                                class="bg-light text-dark rounded-sm pl-2 pb-1 pt-1 pr-2"><i
                                                    class="icofont-wall-clock"></i>${product.preparationtime}</span></p>
                                    </div>
                                    <div class="list-card-badge">
                                        <small>${product.namecategory}</small>
                                    </div>
                                </div>
                            </div>
                        </div>`
                }
                data = data.replace('{categories}', divCategoryList);
                data = data.replace('{categoriesScrool}', divCategoryScrool);
                data = data.replace('{product}', divProduct);
                res.write(data);
                return res.end();
            }
        });
    }
    showDetail(req, res, id){
        fs.readFile('template/detail.html', 'utf-8', async(err, data) => {
            if(err){
                console.log('File khong ton tai!');
            }else{
                let divRestaurant = '';
                let products = await this.product.getProductDetail(id);
                for(let product of products){
                    console.log(product.slug)
                    divRestaurant +=`<div class="col-md-8">
                    <div class="restaurant-detailed-header-left">
                        <img class="img-fluid mr-3 float-left" alt="osahan" src="img/1.jpg">
                        <h2 class="text-white">${product.restaurantname}</h2>
                        <p class="text-white mb-1"><i class="icofont-location-pin"></i>${product.address} </p>
                        <p class="text-white mb-0"><i class="icofont-food-cart"></i>${product.slug}</p>
                    </div>
                </div>`
                }
                data = data.replace('{restaurant}', divRestaurant);
                res.writeHead(200, {'Content-Type':'text/html'});
                res.write(data);
                return res.end();
            }
        });
    }
    
    //Show trang lỗi
    show404Page(req, res) {
        fs.readFile('template/404.html', 'utf-8', (err, data) => {
            if(err) {
                console.log('show 404 error: ' + err);
            }else {
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write(data);
                return res.end();
            }
        })
    }
}
module.exports = HomeController;