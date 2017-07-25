const express=require('express');
const mysql=require('mysql');

var db=mysql.createPool({host: 'localhost', user: 'root', password: '123456', database: 'nodeblog'});

module.exports=function(){
	var router=express.Router();

	//该模块要配合server.js中的路由
	/*router.get('/', (req, res)=>{
		// res.send('detail').end();
		
		// 可以获取到传过来的id，但是直接发送就显示数据不会显示detail.html页面
		db.query(`SELECT * FROM article_table WHERE id=${req.query.id}`, (err, data)=>{
			if(err){
				console.error(err);
				res.status(500).send('database error').end();
			}else if(data.length==0){
				res.status(404).send('no this article').end();
			}else{
				res.send(data[0]).end();
			}
		})
		
	})*/

	/*router.get('/get_detail', (req, res)=>{
	
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
		
	})*/

	return router;
}