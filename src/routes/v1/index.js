const express = require('express');

const router = express.Router();


const {uploadFile} = require('../../middleware/upload');

// auth
const {auth : authentication} = require('../../middleware/auth');//adminAuth

const { required } = require('joi');

const {
    register,
    login,
    checkAuth
} = require('../../controllers/v1/Auth/auth');

// controller 
// controller users
const {
    getUsers,
    getDetailUser,
    updateUser,
    getUserById
    // deleteUser
} = require('../../controllers/v1/Users/user');

// follow
const {
    createFollow,
    following,
    getUnfollow
} = require('../../controllers/v1/Follows/follow');

// controller art
const {
    createArt
} = require('../../controllers/v1/Arts/art');

// controller post
const {
    createPost,
    getPosts,
    getPostById,
    getPostFollow,
    getSearchPosts
} = require("../../controllers/v1/Posts/post");

// controller hire
const {
    createHire,
    createUploadProject,
    transactions,
    cancelOffer,
    approveOffer,
    cancelOrder,
    approveOrder,
    project
} = require("../../controllers/v1/Hiring/hiring");

// route 

// Auth account
router.post('/register', register);
router.post('/login', login);
router.get("/check-auth", authentication, checkAuth);

// route users
router.get('/users',authentication,getUsers);
router.get('/user/:id',authentication,getUserById);
router.get('/detail-user',authentication,getDetailUser);
router.patch('/update-user',authentication, uploadFile("image"), updateUser);

// route follow
router.get('/following/:id', authentication,following)
router.delete('/unfollow/:id', authentication,getUnfollow)
router.post('/follow/:id', authentication,createFollow)
router.get('/follow', authentication,getPostFollow)
// router.post('/unfollow', authentication,uploadFile("image"), createArt)

// route art
router.post('/art', authentication,uploadFile("image"), createArt)

// route posts
router.get('/posts/',authentication , getPosts);
router.get('/post/:id', authentication , getPostById);
router.post('/post',authentication,uploadFile("image") ,createPost);
router.get('/search', authentication , getSearchPosts);


// route hiring project
router.get('/transactions',authentication,transactions);
router.patch('/cancelOffer',authentication,cancelOffer);
router.patch('/approveOffer',authentication,approveOffer);
router.patch('/cancelOrder/:id',authentication,cancelOrder);
router.patch('/approveOrder/:id',authentication,approveOrder);
router.post('/hire/:id',authentication,createHire);
router.post('/project/:id',authentication, uploadFile("image"),createUploadProject);
router.get('/project/:id',authentication,project);

module.exports= router;