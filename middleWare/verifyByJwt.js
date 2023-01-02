const passport = require('passport');
require('../passport/passport')
const verifyBYJwt=(req,res,next)=>{
  let t=  passport.authenticate('jwt',{session:false})
  console.log(t,"88888");
}
module.exports=verifyBYJwt