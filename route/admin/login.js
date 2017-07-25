const express=require('express');
const common=require('../../libs/common.js');
const mysql=require('mysql');

var db=mysql.createPool({host: 'localhost', user: 'root', password: '123456', database: 'nodeblog'});

module.exports=function(){
	var router=express.Router();

	router.get('/', (req, res)=>{
		res.render('admin/login.ejs', {});
	})

	router.post('/', (req, res)=>{
		var username=req.body.username;
		var password=common.md5(req.body.password+common.MD5_SUFFIX);

		db.query(`SELECT * FROM admin_table WHERE username='${username}'`, (err, data)=>{
			if(err){
				console.error(err);
				res.status(500).send('database error').end();
			}else if(data[0].length==0){
				res.status(500).send('no this admin').end();
			}else if(data[0].password==password){
				//成功
				req.session['admin_id']=data[0].id;
				req.session['admin_name']=data[0].username;
				res.redirect('/admin/');
			}else{
				res.status(400).send('this password is incorrect');
			}
		})

	})

	return router;
}