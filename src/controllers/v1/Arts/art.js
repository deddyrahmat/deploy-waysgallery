// data product form models
const {Art} = require("../../../../models") 

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


// get all Arts
exports.getArts = async (req, res) => {
    try {

        const posts = await Post.findAll({
            attributes : {
                exclude : ['createdAt','updatedAt']
            },
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

// create Art
exports.createArt = async (req, res) => {
    try {
        // tambah file
        //body merupakan data yang kita peroleh dari client
        //body ada pada request
        //files = array of object / hanya didapat jika melewati upload middleware

        
        const {body,files} = req;
        // const path = files.photo[0].path
        // const fileName = files.photo[0].filename
        console.log("coba file: ",files);
        

        // menangkanp data user yang login dan menyimpan id
        // dapat dari user login di middleware
        const { id: userId } = req.user;

        // if (files.length > 0) {
        //     const uploadArt = files.map( async (fileImage) => {
        //         const result = await cloudinary.uploader.upload(fileImage.path);//harus path karna menangkap data path saja
        //         const art = await Art.create({userId, image: result.secure_url, cloudinary_id: result.public_id, });
        //     })
        

        //     console.log(uploadArt);
            
        //     if (uploadArt) {
        //         return res.send({
        //                 status : "Success",
        //                 message : "Art Success Created",
        //                 data : {
        //                     uploadArt
        //                 }
        //             });
        //     }else{
        //         return res.status(400).send({
        //         status : "validation error",
        //         error : {
        //             message : "upload failed"
        //         }
        //     })
        //     }
        // }
        //     res.status(400).send({
        //     status : "validation error",
        //     error : {
        //         message : "Image Not Found"
        //     }
        // })
    

    } catch (err) {
        resError(err, res);
    }
}
