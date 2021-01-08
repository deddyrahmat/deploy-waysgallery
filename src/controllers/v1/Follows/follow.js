// data product form models
const {User, Follow} = require("../../../../models") 

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

// data following/ user yang diikuti/ user mengikuti user lain
exports.following = async (req, res) => {
    try {
        // dapat dari user login di middleware
        const paramId = parseInt(req.params.id);
        const userId = req.user.id;

        const follow = await Follow.findOne({
            where : {
                    following : paramId,
                    followers : userId
            },
            attributes : {
                exclude : ['userId','createdAt','updatedAt']
            },
            include : [
                {
                    attributes : {
                        exclude : ["cloudinary_id","password","createdAt", "updatedAt"],
                    },
                    model : User,
                    as : "followings"
                },
                {
                    attributes : {
                        exclude : ["cloudinary_id","password","createdAt", "updatedAt"],
                    },
                    model : User,
                    as : "follower"
                }
            ]
        })

        res.send({
            status : "Success",
            data : {follow}
        })

    } catch (err) {
        resError(err, res);
    }
}

// create Follow
exports.createFollow = async (req, res) => {
    try {

        // menangkanp data user yang login dan menyimpan id
        // dapat dari user login di middleware
        const paramId = req.params.id;
        const userId = req.user.id;


        const follow = await Follow.create({following : parseInt(paramId), followers : userId});
        
        if (!follow) {
            return res.status(400).send({
                status : "validation error",
                error : {
                    message : "Insert failed"
                }
            })
            
        }

        res.send({
            status : "Success",
            message : "Follow Success",
            data : {
                follow
            }
        });

    } catch (err) {
        resError(err, res);
    }
}

// unfollow
exports.getUnfollow = async (req, res) => {
    try {

        const paramId = parseInt(req.params.id);
        const userId = req.user.id;
        
        const account = await Follow.findOne({
            where : {
                    following : paramId,
                    followers : userId
            }
        })

        if (!account) {
            return res.status(400).send({
                status : "Data Not Found",
                data : {Data : []}
            })
        }

        await account.destroy();

        res.send({
            status : "Unfollow Success",
            data : {unfollow : account}
        })


    } catch (err) {
        resError(err, res);
    }
}