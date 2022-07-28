const qs = require('qs');
const category = require('../model/category');
const fs = require("fs");
const homeController = require("./home-controller");

class CategoryController {
    constructor() {
        this.category = new category();
    }

    showCategory(req, res){
        fs.readFile('views/admin/category/show_category.html', 'utf-8', async(err, data)  => {
            if (err) {
                console.log(err);
            }
            else{
                let categorys = await this.category.getCategory();
                let tbody = '';
                for(let index = 0; index < categorys.length; index++) {
                    console.log(categorys[index].id)
                    tbody += `<tr>
                    <th scope="row">${categorys[index].id}</th>
                    <td>${categorys[index].name}</td>
                    <td>${categorys[index].type}</td>
                    <td>${categorys[index].image}</td>
                    <td>${categorys[index].amountAddress}</td>
                    <td>${categorys[index].idrestaurant}</td>
                    <td><a href=/editcategory?id=${categorys[index].id}>Sửa</a></td>
                    <td><a href="/deletecategory">Xoá</a></td>
                    </tr>
                    `
                }
                data = data.replace('{category}', tbody);
                res.writeHead(200,{'Content-Type':'Text/html'});
                res.write(data);
                return res.end();
            }
        })
    };
    // show form create category
    showFormCreateCategory(req, res){
        fs.readFile('views/admin/category/create_category.html','utf-8',(err, data) => {
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
    // create category
    createCategory(req,res){
        let data = '';
        req.on('data', chunk =>{
            data += chunk;
        });
        req.on('end', () =>{
            let category = qs.parse(data);
            this.category.createCategory(category);
            res.writeHead(301, {
                location: '/',
            });
            return res.end();
        });
    }
    // show form create category
    showFormEditCategory(req, res, idUpdate){
        fs.readFile('views/admin/category/edit_category.html','utf-8', async(err, data) => {
            if(err){
                console.log(err);
            }
            else{

                    let category = await this.category.getCategoryById(idUpdate);
                    data = data.replace('{id}', category[0].id);
                    data = data.replace('{name}', category[0].name);
                    data = data.replace('{type}', category[0].type);
                    data = data.replace('{image}', category[0].image);
                res.writeHead(200,{'Content-Type':'text/html'});
                res.write(data);
                return res.end(); 
            }
        });
    }
    
    //edit category
    editCategory(req,res,id){
        let data = '';
        req.on('data', chuck => {
            data += chuck;
        });
        req.on('end', () =>{
            console.log(id)
            let category = qs.parse(data);
            console.log(category);
            this.category.updateCategory(id, category);
            res.writeHead(301,{
                location: '/',
            });
            return res.end();
        });
    }
};

module.exports = CategoryController;