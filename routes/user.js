var express = require('express');
var router = express.Router();
//const verifyByJwt=require('../middleWare/verifyByJwt')
const passport = require('passport');
require('../passport/passport')

const {
doRegistration,
doLogin,
addPost,
editPost,
getPostByLocation,
activePostsCount,


}=require('../controllers/controller')
const  verifyByJwt =passport.authenticate('jwt',{session:false})

router.post('/doRegistration',doRegistration)
router.post('/doLogin',doLogin)
router.post('/addPost',verifyByJwt,addPost)
router.post('/editPost',verifyByJwt,editPost)
router.get('/getPostByLocation',verifyByJwt,getPostByLocation)
router.get('/activePostsCount',verifyByJwt,activePostsCount)





module.exports = router;
