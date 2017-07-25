const express=require('express');
const common=require('./libs/common.js');

var str='123456';

console.log(common.md5(str+common.MD5_SUFFIX));