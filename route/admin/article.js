const express=require('express');
const common=require('../../libs/common');
const mysql=require('mysql');
const pathLib=require('path');
const fs=require('fs'); 
// const sd=require('silly-datetime');


var db=mysql.createPool({host: 'localhost', user: 'root', password: '123456', database: 'nodeblog'});


module.exports=function(){
	var router=express.Router();

	router.get('/', (req, res)=>{
		switch(req.query.act){
			case 'mod':
				db.query(`SELECT * FROM article_table WHERE id=${req.query.id}`, (err, data)=>{
					if(err){
						console.error(err);
						res.status(500).send('database error').end();
					}else if(data.length==0){
						res.status(404).send('no this article').end();
					}else{
						db.query(`SELECT * FROM article_table`, (err, articles)=>{
							if(err){
								console.error(err);
								res.status(500).send('database error').end();
							}else{
								res.render('admin/article.ejs', {articles, mod_data: data[0]});
							}
						})
					}
				})
				break;
			case 'del':
				db.query(`SELECT * FROM article_table WHERE id=${req.query.id}`, (err, data)=>{
					if(err){
						console.error(err);
						res.status(500).send('database error').end();
					}else if(data.length==0){
						res.status(404).send('no this article').end();
					}else{
			            fs.unlink('static/upload/'+data[0].src, (err)=>{
			               if(err){
			                 console.error(err);
			                 res.status(500).send('file opration error').end();
	               			}else{
								db.query(`DELETE FROM article_table WHERE id=${req.query.id}`, (err, data)=>{
									if(err){
										console.error(err);
										res.status(500).send('database error').end();
									}else{
										res.redirect('/admin/article');
									}
								})
							}
						})
		            }
	            })
				break;
			default:
				db.query(`SELECT * FROM article_table`, (err, articles)=>{
					if(err){
						console.error(err);
						res.status(500).send('database error').end();
					}else{
						res.render('admin/article.ejs', {articles});
					}
				})		
		}
	});
	router.post('/', (req, res)=>{
		var title=req.body.title;
		var description=req.body.description;
		var content=req.body.content;
		// var author=req.body.author;
		var author=req.session['admin_name'];
		// var time=sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss');
		// var time=new Date().getTime(); //时间戳 
		// console.log(time);

		if(req.files[0]){
			var ext=pathLib.parse(req.files[0].originalname).ext;
			var oldPath=req.files[0].path;
			var newPath=req.files[0].path+ext;
			var newFileName=req.files[0].filename+ext;
		}else{
			var newFileName=null;
		}

		if(newFileName){
			fs.rename(oldPath, newPath, (err)=>{
				if(err){
					console.error(err);
					res.status(500).send('database error').end();
				}else{
					if(req.body.mod_id){ //修改
						db.query(`SELECT * FROM article_table WHERE id=${req.body.mod_id}`, (err, data)=>{
							if(err){
								console.error(err);
								res.status(500).send('database error').end();
							}else if(data.length==0){
								res.status(404).send('old file not found').end();
							}else{
								//先删除原来的图片
								fs.unlink('/static/upload/'+data[0].src, (err)=>{
									if(err){
										console.error(err);
										res.status(500).send('file opration error').end();
									}else{
										db.query(`UPDATE article_table SET \
											title='${title}', description='${description}',\
											content='${content}', author='${author}',\
											src='${newFileName}' WHERE id=${req.body.mod_id}`, 
										(err, data)=>{
											if(err){
												console.error(err);
												res.status(500).send('database error').end();
											}else{
												res.redirect('/admin/article');
											}	
										})
									}
								})
							}
						})
					}else{ //添加
						db.query(`INSERT INTO article_table (title, description, src, content, author, post_time) \
							VALUES('${title}', '${description}', '${newFileName}', '${content}', '${author}', NOW())`,
						(err, data)=>{
							if(err){
								console.error(err);
								res.status(500).send('database error').end();
							}else{
								res.redirect('/admin/article');
							}
						})
					}
				}
			})
		}else{
			if(req.body.mod_id){ //修改
				db.query(`UPDATE article_table SET \
					title='${title}', description='${description}',\
					content='${content}', author='${author}'\
					WHERE id=${req.body.mod_id}`, 
				(err, data)=>{
					if(err){
						console.error(err);
						res.status(500).send('database error').end();
					}else{
						res.redirect('/admin/article');
					}	
				})
			}else{ //添加
				db.query(`INSERT INTO article_table (title, description, src, content, author, post_time) \
					VALUES('${title}', '${description}', '${newFileName}', '${content}', '${author}', NOW())`,
				(err, data)=>{
					if(err){
						console.error(err);
						res.status(500).send('database error').end();
					}else{
						res.redirect('/admin/article');
					}
				})
			}
		}
	})

	return router;
}