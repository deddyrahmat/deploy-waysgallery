// data product form models
const {Hiring,User, Project, FileProject, Sequelize} = require("../../../../models") 

const Joi = require("joi");

const cloudinary = require("../../../middleware/cloudinary");

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

// data transaction offer by id user login
exports.transactions = async (req, res) => {
    try {
        // dapat dari user login di middleware
        const { id } = req.user;
        const status = req.query.status;
        console.log(id);
        console.log(status);

        const transactions = await Hiring.findAll({
            where : status == "my-offer" ? {
                orderTo : id
            } : {
                orderBy : id
            }
            ,
            attributes : {
                exclude : ['UserId','createdAt','updatedAt']
            },
            include : [
                {
                    attributes: {
                        exclude: ['password','cloudinary_id','UserId',"createdAt", "updatedAt"],
                    },
                    model : User,
                    as : "orderby"
                },
                {
                    attributes: {
                        exclude: ['password','cloudinary_id','UserId',"createdAt", "updatedAt"],
                    },
                    model : User,
                    as : "orderto"
                }
            ]
        })

        if (!transactions) {
            return res.status(400).send({
                status : "transactions Empty",
                data : {transactions : []}
            })
        }

        res.send({
            status : "Success",
            data : {transactions}
        })

    } catch (err) {
        resError(err, res);
    }
}

// create Transaction Hire
exports.createHire = async (req, res) => {
    try {

        console.log("req body",req.body);
        console.log("req param",req.params);
        
        const {body} = req;
        
        const schema = Joi.object({
            title : Joi.string().min(5).required(),
            description : Joi.string().min(3).required(),
            startDate : Joi.date().required(),
            endDate : Joi.date().required(),
            price : Joi.number().required()
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
        const { id: orderBy } = req.user;
        const { id: orderTo } = req.params;

        const hired = await Hiring.create({...body, status:"Waiting Accept" ,orderBy, orderTo});
        
        if (!hired) {
            return res.status(400).send({
                status : "validation error",
                error : {
                    message : "Insert failed"
                }
            })
            
        }

        const transactions = await Hiring.findOne({
            where : {
                id : hired.id
            },
            attributes : {
                exclude : ['UserId','createdAt','updatedAt']
            },
            include : [
                {
                    attributes: {
                        exclude: ['UserId',"createdAt", "updatedAt"],
                    },
                    model : User,
                    as : "orderby"
                },
                {
                    attributes: {
                        exclude: ['UserId',"createdAt", "updatedAt"],
                    },
                    model : User,
                    as : "orderto"
                }
            ]
        })

        if (!transactions) {
            return res.status(400).send({
                status : "transactions Empty",
                data : {transactions : []}
            })
        }

        res.send({
            status : "Success",
            message : "Hired Success",
            data : {
                transactions
            }
        });

    } catch (err) {
        resError(err, res);
    }
}

// data approveOffer offer by id user login
exports.approveOffer = async (req, res) => { 
    try {
        // dapat dari user login di middleware
        const {id} = req.body;
        console.log( "id body",id);

        const approveOffer = await Hiring.update({status : "Waiting Project"},{
            where :{
                id
            }
        })

        if (!approveOffer) {
            return res.status(400).send({
                status : "transactions Empty",
                data : {transactions : []}
            })
        }

        const afterUpdateapproveOffer = await Hiring.findAll({
            where : {
                orderTo : req.user.id
            }
            ,
            attributes : {
                exclude : ['UserId','createdAt','updatedAt']
            },
            include : [
                {
                    attributes: {
                        exclude: ['password','cloudinary_id','UserId',"createdAt", "updatedAt"],
                    },
                    model : User,
                    as : "orderby"
                },
                {
                    attributes: {
                        exclude: ['password','cloudinary_id','UserId',"createdAt", "updatedAt"],
                    },
                    model : User,
                    as : "orderto"
                }
            ]
        })

        res.send({
            status : "Success",
            data : {
                transactions:afterUpdateapproveOffer
            }
        })

    } catch (err) {
        resError(err, res);
    }
}

exports.cancelOffer = async (req, res) => { 
    try {
        // dapat dari user login di middleware
        const {id} = req.body;
        console.log( "id body",id);

        const transactionCancelOffer = await Hiring.update({status : "Cancel"},{
            where :{
                id
            }
        })

        if (!transactionCancelOffer) {
            return res.status(400).send({
                status : "transactions Empty",
                data : {transactions : []}
            })
        }

        const afterUpdateCancelTransactions = await Hiring.findAll({
            where : {
                orderTo : req.user.id
            }
            ,
            attributes : {
                exclude : ['UserId','createdAt','updatedAt']
            },
            include : [
                {
                    attributes: {
                        exclude: ['password','cloudinary_id','UserId',"createdAt", "updatedAt"],
                    },
                    model : User,
                    as : "orderby"
                },
                {
                    attributes: {
                        exclude: ['password','cloudinary_id','UserId',"createdAt", "updatedAt"],
                    },
                    model : User,
                    as : "orderto"
                }
            ]
        })

        res.send({
            status : "Success",
            data : {
                transactions:afterUpdateCancelTransactions
            }
        })

    } catch (err) {
        resError(err, res);
    }
}

// create upload Projek hire
exports.createUploadProject = async (req, res) => {
    try {
        // tambah file
        //body merupakan data yang kita peroleh dari client
        //body ada pada request
        //files = array of object / hanya didapat jika melewati upload middleware

        const {body,files} = req;        
        const paramsIdProject=  req.params.id;

        const schema = Joi.object({
            description : Joi.string().min(3).required(),
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

        const project = await Project.create({...body, hiringId : paramsIdProject});
        if (project) {
            // console.log(files);

            const uploadFileProject = files.map( async (fileImage) => {
                // const result = await cloudinary.uploader.upload(fileImage.path);//harus path karna menangkap data path saja
                // photo 
                await FileProject.create({projectId : project.id, image: fileImage.path, cloudinary_id: fileImage.filename });
            })
            
            if (!uploadFileProject) {
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

        const waitApproveProject = await Hiring.update({status : "Waiting Approved Project"},{
            where :{
                id : paramsIdProject
            }
        })

        if (!waitApproveProject) {
            return res.status(400).send({
                status : "Create Project Failed",
                data : {Project : []}
            })
        }


        const afterUpload = await Project.findOne({
            where : {
                id : project.id
            }, 
            attributes : {
                exclude : ['projectId']
            }
        })

        res.send({
            status : "Success",
            message : "Upload Project Success",
            data : {
                project : afterUpload
            }
        });

    } catch (err) {
        resError(err, res);
    }
}

// data approveOffer offer by id user login
exports.approveOrder = async (req, res) => { 
    try {
        // dapat dari user login di middleware
        const {id} = req.body;
        console.log(id);

        const projectApproveOrder = await Hiring.update({status : "Project Is Complete"},{
            where :{
                id
            }
        })

        if (!projectApproveOrder) {
            return res.status(400).send({
                status : "projects Empty",
                data : {projects : []}
            })
        }

        const afterUpdateApproveProjects = await Hiring.findAll({
            where : {
                orderTo : req.user.id
            }
            ,
            attributes : {
                exclude : ['UserId','createdAt','updatedAt']
            },
            include : [
                {
                    attributes: {
                        exclude: ['password','cloudinary_id','UserId',"createdAt", "updatedAt"],
                    },
                    model : User,
                    as : "orderby"
                },
                {
                    attributes: {
                        exclude: ['password','cloudinary_id','UserId',"createdAt", "updatedAt"],
                    },
                    model : User,
                    as : "orderto"
                }
            ]
        })

        res.send({
            status : "Success",
            data : {
                transactions:afterUpdateApproveProjects
            }
        })

    } catch (err) {
        resError(err, res);
    }
}

exports.cancelOrder = async (req, res) => { 
    try {
        // dapat dari user login di middleware
        const {id} = req.body;
        console.log( "id body",id);

        const transactionCancelOrder = await Hiring.update({status : "Cancel"},{
            where :{
                id
            }
        })

        if (!transactionCancelOrder) {
            return res.status(400).send({
                status : "transactions Empty",
                data : {transactions : []}
            })
        }

        const afterUpdateCancelTransactions = await Hiring.findOne({
            where : {
                id
            }
            ,
            attributes : {
                exclude : ['UserId','createdAt','updatedAt']
            },
            // include : [
            //     {
            //         attributes: {
            //             exclude: ['password','cloudinary_id','UserId',"createdAt", "updatedAt"],
            //         },
            //         model : User,
            //         as : "orderby"
            //     },
            //     {
            //         attributes: {
            //             exclude: ['password','cloudinary_id','UserId',"createdAt", "updatedAt"],
            //         },
            //         model : User,
            //         as : "orderto"
            //     }
            // ]
        })

        res.send({
            status : "Success",
            data : {
                Order:afterUpdateCancelTransactions
            }
        })

    } catch (err) {
        resError(err, res);
    }
}

// data transaction by id user login
exports.project = async (req, res) => {
    try {
        // dapat dari user login di middleware
        const { id } = req.params;

        console.log("id", id);

        const project = await Project.findOne({
            where : {
                hiringId:id
            }
            ,
            attributes : {
                exclude : ['UserId','createdAt','updatedAt']
            },
            include : [
                {
                    // attributes: {
                    //     exclude: ["createdAt", "updatedAt"],
                    // },
                    model : FileProject,
                    as : "photos"
                }
            ]
        })

        if (!project) {
            return res.status(400).send({
                status : "transactions Empty",
                data : {transactions : []}
            })
        }

        res.send({
            status : "Success",
            data : {project}
        })

    } catch (err) {
        resError(err, res);
    }
}

