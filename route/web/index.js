const express=require('express');
const common=require('../../libs/common');
const mysql=require('mysql');

var db=mysql.createPool({host: 'localhost', user: 'root', password: '123456', database: 'nodeblog'});


module.exports=function(){
	var router=express.Router();

	/*router.get('/', (req, res)=>{
		res.send('我是web').end();
	})*/

	router.get('/get_articles', (req, res)=>{
		db.query(`SELECT * FROM article_table`, (err, data)=>{
			if(err){
				console.error(err);
				res.status(500).send('database error').end();
			}else{
				//发送数据到前台
				res.send(data).end();
			}
		})
			
	})

	router.get('/get_detail', (req, res)=>{

		// 获取不到传过来的id，可以显示detail.html页面但是获取到的时所有数据，data[0]是第一条数据
		// console.log(req.query.id);
	
		db.query(`SELECT * FROM article_table`, (err, data)=>{
			if(err){
				console.error(err);
				res.status(500).send('database error').end();
			}else if(data.length==0){
				res.status(404).send('no this article').end();
			}else{
				res.send(data[0]).end();
			}
		})
		
	})

	return router;

}
