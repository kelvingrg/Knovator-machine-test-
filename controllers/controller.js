const db = require('../config/dataBase')
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
const USER = require('../model/userModel')
var jwt = require('jsonwebtoken');
const POSTS = require('../model/postModel');
const bodyParser = require('body-parser')
var ObjectID = require("bson-objectid");


const doRegistration = (req, res) => {
    let {email, password} = req.body
    try {
        if (email && password) {

            bcrypt.genSalt(10, (err, salt) => {

                bcrypt.hash(password, salt, async (err, hashedPassword) => {
                    if (err) {
                        console.log(`ERROR : ${err}`);
                    } else {
                        let Hpassword = hashedPassword;
                        const user = {
                            email: email,
                            password: Hpassword
                        }
                        USER(user).save().then(() => {
                            res.status(200).json({doRegistration: true, message: "registration successfull"})
                        }).catch(() => {
                            res.status().json({doRegistration: false, message: "registration failed"})

                        })

                    }
                })
            })

        } else {
            res.sataus(422).json({doRegistration: false, message: "invalid credentials"})
        }
    } catch (err) {
        res.status(404).json({err: err, message: ' something went wrong'})
    }

}

const doLogin = async (req, res) => {
    let {email, password} = req.body
    try {
        let user = await USER.find({email: email})
        if (user.length > 0) {

            const isMatch = await bcrypt.compare(password, user[0].password)
            if (isMatch) {
                const payload = {
                    email: email,
                    id: user[0]._id
                };

                var token = jwt.sign(payload, 'scecretKey', {expiresIn: '1d'});
                res.status(200).json({
                    message: "login successfull",
                    token: "Bearer" + token
                })

            }
        } else {
            res.status(401).json({message: 'invalid creditials', login: false})
        }


    } catch (err) {
        res.status(404).json({
            message: 'something went wrong' + err,
            login: false
        })
    }

}
const addPost = (req, res) => {
    // expecting reqbodt like
    // title:"sample title"
    //     body:"sapmle text for body ",
    //     userId:"jzshdbvf84r87w894r3w90",
    //     geolocation:{
    //         type:Point,
    //         coordinates:[34.56,784.3454]
    //     }

    try {

        const {title, body, userId, geolocation} = req.body

        let post = {
            title: title,
            body: body,
            createdBy: userId,
            active: true,
            location: {
                type: "Point",
                coordinates: geolocation.coordinates
            }

        }

        POSTS(post).save().then(() => {
            res.status(200).json({message: 'post added successfully ', update: true})
        }).catch((err) => {
            res.status(401).json({
                message: 'post creation failed ' + err,
                update: false
            })
        })
    } catch (err) {
        res.status(404).json({
            message: 'something went wrong' + err,
            update: false
        })
    }

}
const editPost = async (req, res) => {
    // expecting data:
    // _id:jkdhgbfhduer874578675
    // title:"sample title"
    //     body:"sapmle text for body ",
    //     userId:"jzshdbvf84r87w894r3w90",
    //     active:true,
    //     geolocation:{
    //         type:Point,
    //         coordinates:[34.56,784.3454]
    //

    try {

        const {
            title,
            body,
            userId,
            active,
            geolocation
        } = req.body

        let updatedPost = {
            title: title,
            body: body,
            createdBy: userId,
            active: true,
            location: {
                type: "Point",
                coordinates: geolocation.coordinates
            }

        }

        const userIdfromtoken = verifyUserFromJwt(req.headers)
        postData = await POSTS.find({_id: req.body._id})

        if (postData[0].createdBy === userIdfromtoken) {
            POSTS.findByIdAndUpdate({
                _id: ObjectID(req.body_id),
                updatedPost
            })
            // / this is a general update we can do individual feilds with keeping other existing

            data.then(() => {
                res.status(200).json({message: 'post updated successfully ', update: true})
            }).catch((err) => {
                res.status(401).json({
                    message: 'post updation failed 2 ' + err,
                    update: false
                })
            })
        } else {
            res.status(401).json({message: 'post updation failed 1', update: false})
        }


    } catch (err) {
        res.status(404).json({
            message: 'something went wrong' + err,
            update: false
        })
    }
}


function verifyUserFromJwt(header) {
    const token = header.authorization
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const buff = new Buffer(base64, 'base64');
    const payloadinit = buff.toString('ascii');
    const payload = JSON.parse(payloadinit);
    return payload.id
}

const getPostByLocation = (req, res) => {
    // exppecting data as query as
    // longtitude:6343.34
    // latitude:4765475.56
    try {
        const {longtitude, latitude} = req.query
        POSTS.aggregate([{
                $geoNear: {
                    near: {
                        type: "Point",
                        coordinates: [longtitude, latitude]
                    },
                    "distanceField": "distance",
                    "spherical": true,
                    "maxDistance": 10000
                }
            }]).then((response) => {
            res.status(200).json({message: 'data fetched  successfully ', dataFetched: true, data: response})
        }).catch((err) => {
            res.status(401).json({
                message: 'failed2 ' + err,
                dataFetched: false
            })
        })
    } catch (err) {
        res.status(404).json({
            message: 'something went wrong' + err,
            dataFetched: false
        })
    }

}

const activePostsCount=(req,res)=>{
    try{

    POSTS.find({active:true}).count().then((response)=>{
        res.status(200).json({message: 'data fetched  successfully ', dataFetched: true, count: response})
    })
} catch (err) {
    res.status(404).json({
        message: 'something went wrong' + err,
        dataFetched: false
    })
}
}


module.exports = {
    doRegistration,
    doLogin,
    addPost,
    editPost,
    getPostByLocation,
    activePostsCount,

}
