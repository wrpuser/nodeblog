const crypto=require('crypto');

module.exports={
	MD5_SUFFIX: 'flksdjflkjsdalkhlfak;sjdlk%$#jsadalk',
	md5: function(str){
		var obj=crypto.createHash('md5');
		obj.update(str);

		return obj.digest('hex');

	},
	time2date: function(timestamp){
		var oDate=new Date();
		oDate.setTime(timestamp*1000);

		return toDou(oDate.getFullYear())+'-'+toDou(oDate.getMonth()+1)+'-'+toDou(oDate.getDate())+' '+toDou(oDate.getHours())+':'+toDou(oDate.getMinutes())+':'+toDou(oDate.getSeconds());
	},
	echo: function(str){
		return str.replace(/^/gm, '<p>').replace(/$/gm, '</p>');
	}
}

function toDou(n){
	return n<10?'0'+n:''+n;
}