// data user from models
const {User,Post, Photo, Art} = require("../../../../models");

const cloudinary = require("../../../middleware/cloudinary");

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


// get all data users
exports.getUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes : {
                exclude : ["createdAt","updatedAt","password"]
            }
        });
    
        if (!users) {
            return res.status(400).send({
                status : "Data Users Empty",
                data : {users : []}
            })
        }

        console.log(req.user)

        res.send({
            status : "Get Data Users Success",
            data : {users}
        })
    } catch (err) {
        resError(err,res);
    }

}

// detail user for profile
exports.getDetailUser = async (req, res) => {
    try {
        // dapat dari user login di middleware
        const { id } = req.user;

        const user = await User.findOne({
            where : {
                id
            },
            attributes : {
                exclude : ["password","cloudinary_id",'createdAt','updatedAt']
            },
            include : [
                {
                    attributes: {
                        exclude: ["createdAt", "updatedAt"],
                    },
                    model : Post,
                    as : "posts",
                    include : [
                        {
                            attributes : {
                                exclude : ["postId","cloudinary_id","createdAt", "updatedAt"],
                            },
                            model : Photo,
                            as : "photos"
                        }
                    ]
                },
                {
                    attributes: {
                        exclude: ["createdAt", "updatedAt"],
                    },
                    model : Art,
                    as : "arts",
                }
            ]
        })

        if (!user) {
            return res.status(400).send({
                status : "User Empty",
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

// detail user for profile
exports.getUserById = async (req, res) => {
    try {
        // dapat dari user login di middleware
        const { id } = req.params;

        const user = await User.findOne({
            where : {
                id
            },
            attributes : {
                exclude : ["password","cloudinary_id",'createdAt','updatedAt']
            },
            include : [
                {
                    attributes: {
                        exclude: ["createdAt", "updatedAt"],
                    },
                    model : Post,
                    as : "posts",
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
                },
                {
                    attributes: {
                        exclude: ["createdAt", "updatedAt"],
                    },
                    model : Art,
                    as : "arts",
                }
            ]
        })

        if (!user) {
            return res.status(400).send({
                status : "User Empty",
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

// delete data user
exports.updateUser = async (req,res) => {
    try {
        
        const {id} = req.user;
        const {body,files} = req;
        console.log(files);

        
        //method FindOne menerima object yaitu where : {id}
        const getUserById = await User.findOne({
            where : {
                id
            },attributes : {
                exclude : ["createdAt","updatedAt"]
            }
        })
        
        if (!getUserById) {
            return res.status(400).send({
                status : "Data User Empty",
                data : {User : null}
            })
        }

        // cek user update profil
        if (files.length > 0) {
            const result = await cloudinary.uploader.upload(files[0].path);//harus path karna menangkap data path saja
            body.avatar = result.secure_url;
            body.cloudinary_id = result.public_id
            // const photo = await User.update({avatar: result.secure_url, cloudinary_id: result.public_id, });
        }

        //update menerima 2 parameter yaitu data yang mau diupdate dan where id
        const user= await User.update(body, {
            where : {
                id
            }
        })

        //karena yang direturn setelah update cuma id doang
        //maka kita harus get lagi sebelum dikirim ke sisi client
        const getUserAfterUpdate = await User.findOne({
        where: {
            id,
        },
        });

        //hasil update
        res.send({
        status: "Success",
        message: "Update Success",
        data: {
            post: getUserAfterUpdate,
        },
        });
        
    } catch (err) {
        resError(err,res);
    }
}
