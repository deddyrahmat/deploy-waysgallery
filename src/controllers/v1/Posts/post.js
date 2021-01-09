// data product form models
const {Post,Photo, User, Follow} = require("../../../../models") 

const cloudinary = require("../../../middleware/cloudinary");

var Sequelize = require('sequelize');
const Op = Sequelize.Op;
const Joi = require("joi");

// delete file
const fs = require('fs');

// output error
const resError = (err,res) => {
    console.log(err);
    return res.status(500).send({
        status : "Request Failed",
        error : {
            message : "Server Error"
        }
    })
}


// get all posts
exports.getPosts = async (req, res) => {
    try {

        const posts = await Post.findAll({
            attributes : {
                exclude : ['createdAt','updatedAt']
            },
            order : [
                ['id','DESC']
            ],
            include : [
                {
                    attributes : {
                        exclude : ["postId","cloudinary_id","createdAt", "updatedAt"],
                    },
                    model : Photo,
                    as : "photos"
                }
            ]
        })


        if (!posts) {
            return res.status(400).send({
                status : "Posts Empty",
                data : {posts : []}
            })
        }

        res.send({
            status : "Success",
            data : {posts}
        })


    } catch (err) {
        resError(err, res);
    }
}

// get posts where post id
exports.getPostById = async (req, res) => {
    try {

        const {id} = req.params;

        const post = await Post.findOne({
            where : {
                id
            },
            attributes : {
                exclude : ['createdBy','createdAt','updatedAt']
            },
            include : [
                {
                    attributes : {
                        exclude : ["postId","cloudinary_id","createdAt", "updatedAt"],
                    },
                    model : Photo,
                    as : "photos"
                },
                {
                    attributes : {
                        exclude : ["password","greeting","cloudinary_id","createdAt", "updatedAt"],
                    },
                    model : User,
                    as : "createBy"
                }
            ],
        })

        if (!post) {
            return res.status(400).send({
                status : "Posts Empty",
                data : {post : []}
            })
        }

        res.send({
            status : "Success",
            data : {post}
        })


    } catch (err) {
        resError(err, res);
    }
}

// get posts where post follow user
exports.getPostFollow = async (req, res) => {
    try {

        const {id} = req.user;

        console.log(id);
        const user = await Follow.findAll({
            where : {
                followers : id
            },
            attributes : {
                exclude : ['createdBy','createdAt','updatedAt']
            },
            include : [
                {
                    attributes : {
                        exclude : ["password","createdAt", "updatedAt"],
                    },
                    model : User,
                    as : "followings",
                    include : [
                        {
                            attributes : {
                                exclude : ["createdAt", "updatedAt"],
                            },
                            model : Post,
                            as : "posts",
                            include : [
                                {
                                    attributes : {
                                        exclude : ["createdAt", "updatedAt"],
                                    },
                                    model : Photo,
                                    as : "photos"
                                }
                            ],
                        }
                    ],
                }
            ],
        })

        if (!user) {
            return res.status(400).send({
                status : "follow Empty",
                data : {user : []}
            })
        }

        res.send({
            status : "Success",
            data : {user}
        })


    } catch (err) {
        resError(err, res);
    }
}

// get posts where post follow user
exports.getSearchPosts = async (req, res) => {
    try {

        const status = req.query.status;
        const {id} = req.user;

        console.log("id user login",id);
        console.log('status',status);
        const post = await Post.findAll({
            where : {
                title : {[Op.like] : '%'+status+'%'}
            },
            attributes : {
                exclude : ['createdBy','createdAt','updatedAt']
            },
            include : [
                {
                    attributes : {
                        exclude : ["createdAt", "updatedAt"],
                    },
                    model : Photo,
                    as : "photos",
                    
                }
            ],
        })

        if (!post) {
            return res.status(400).send({
                status : "follow Empty",
                data : {post : []}
            })
        }

        res.send({
            status : "Success",
            data : {post}
        })


    } catch (err) {
        resError(err, res);
    }
}

// create Post
exports.createPost = async (req, res) => {
    try {
        // tambah file
        //body merupakan data yang kita peroleh dari client
        //body ada pada request
        //files = array of object / hanya didapat jika melewati upload middleware

        
        const {body,files} = req;
        // console.log("coba file: ",files);
        

        const schema = Joi.object({
            title : Joi.string().min(5).required(),
            description : Joi.string().min(3).required(),
            image : Joi.object()
        });

        const { error } =schema.validate(body, {
            // option untuk menmapilkan pesan error lebih dari 1
            abortEarly : false
        });

        if (error) {
            return res.status(400).send({
                status : "validation error",
                error : {
                    message : error.details.map((error) => error.message)
                }
            })
        }

        // menangkanp data user yang login dan menyimpan id
        // dapat dari user login di middleware
        const { id: createdBy } = req.user;

        const post = await Post.create({...body, createdBy });
        if (post) {
            console.log(files);

            const uploadPhoto = files.map( async (fileImage) => {
                // const result = await cloudinary.uploader.upload(fileImage.path);//harus path karna menangkap data path saja
                // const photo = 
                await Photo.create({postId : post.id, image: fileImage.path, cloudinary_id: fileImage.filename });
            })
            
            if (uploadPhoto) {
                return res.send({
                        status : "Success",
                        message : "Post Success Created",
                        data : {
                            post
                        }
                    });
            }else{
                return res.status(400).send({
                status : "validation error",
                error : {
                    message : "upload failed"
                }
            })
            }
        }else{
            return res.status(400).send({
                status : "validation error",
                error : {
                    message : "Insert failed"
                }
            })
        }

        res.send({
            status : "Success",
            message : "Post Success Created",
            data : {
                post
            }
        });

    } catch (err) {
        resError(err, res);
    }
}
