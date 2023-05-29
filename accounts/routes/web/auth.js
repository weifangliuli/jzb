var express = require('express');
var router = express.Router();
const UserModel = require('../../mg/UserModel')
const md5 = require('md5')

//路由规则 - 注册页面
router.get('/reg',(req,res) => {
  res.render('web/reg')
})


router.post('/reg',(req,res)=>{
  // 获取请求体的数据
  console.log("==========",req.body)
  UserModel.create({...req.body,password : md5(req.body.password)}).then(value=>{
    res.render('success',{msg : '注册成功',url : '/login'})
  },error =>{
    res.status(500).send('注册失败')
  })

})

router.get('/login',(req,res)=>{
  res.render('web/login')
})
router.post('/login',(req,res) =>{
  //接收参数
  UserModel.findOne({username : req.body.username,password : md5(req.body.password)}).then(value=>{
    if(value){
      //写入session
      req.session.username = value.username
      req.session._id = value._id
      res.render('success',{msg : '登录成功',url : '/api/account'})
    }else {
      res.status(500).send('登录失败！！！')
    }
  },error=>{
    res.status(500).send('登录失败！！！')
  })
})

router.post('/logout',(req,res)=>{
  req.session.destroy(()=>{
    res.render('success',{msg :'退出成功',url :'/login'})
  }) 
})

module.exports = router;
