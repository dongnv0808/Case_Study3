const Connection = require("./connection");

class Tag{
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

    getAllTag(){
        return new Promise((resolve, rejects) => {
            this.connection.query('select * from tag;', (err, data) => {
                if(err){
                    rejects(err);
                } else {
                    resolve(data);
                }
            });
        });
    }

    createTag(tag){
        let insertQuery = `insert into tag(name, slug, innings, views) 
        values('${tag.name}', ${tag.type}, ${tag.innings}, ${tag.views}')`;
        this.connection.query(insertQuery, (err, data) => {
            if(err){
                console.log(err);
            }else{
                console.log('Insert Succes!');
            }
        });        
    }

    getTagById(id){
        return new Promise((resolve, rejects) => {
            let query = `select * from tag where id=${id}`;
            this.connection.query(query, (err, data) =>{
                if(err){
                    rejects(err);
                }else{
                    resolve(data);
                }
            })
        })
    }

    updateTag(id, tag){
        let query = `update products set name='${tag.name}', slug='${tag.slug}', innings='${tag.innings}' where id=${id};`
        this.connection.query(query, (err, data)=>{
            if(err){
                console.log(err);
            }else{
                console.log('Update success');
            }
        })
    }
}

module.exports = Tag;