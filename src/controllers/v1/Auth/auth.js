const {User} = require("../../../../models");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const responseSuccess = "Response Success";


exports.register = async (req,res) => {
    try {
        // validasi inputan user
        const {body} = req;

        const schema = Joi.object({
            fullname: Joi.string().min(2).required(),
            email: Joi.string().email().min(10).required(),
            password: Joi.string().min(8).required(),
        });

        const {error} = schema.validate(body, {
            abortEarly :false
        })

        if (error) {
            return res.status(400).send({
                status : "Validation Error",
                error : {
                    message : error.details.map(err => err.message)
                }
            })
        }

        // cek email, telah digunaan atau belum
        const checkEmail = await User.findOne({
            where : {
                email : body.email
            },
            attributes : {
                exclude : ["createdAt","updatedAt"]
            }
        })


        if (checkEmail) {
            return res.status(400).send({
                status: "Registration Failed",
                error : {
                    message: `Email already exsited`
                }
            });
        }

        const {fullname, email, password} = body;

        // encrypt password dengan bcrypt
        const hashPassword = await bcrypt.hash(password, 12);

        // register
        const regis = await User.create({
            fullname,
            email,
            password : hashPassword
        })

        // private key for token
        const privateKey = process.env.JWT_PRIVATE_KEY;

        // proses pembuatan token dengan jsonwebtoken
        const token = jwt.sign({
            id : regis.id
            },privateKey
        );

        res.send({
            status: responseSuccess,
            message: "You succesfully registered",
            data: {
                email: regis.email,
                token
            },
        });
    } catch (err) {
         //error here
        console.log(err);
            return res.status(500).send({
            status : "Request Failed",
            error: {
                message: "Server Error",
            },
        });
    }
    

}

exports.login = async (req, res) => {
    try {
        const {body} = req;

        // validasi login
        const schema = Joi.object({
            email: Joi.string().email().min(10).required(),
            password: Joi.string().min(8).required(),
        })

        const {error} = schema.validate(body, {
            abortEarly: false
        })

        if (error) {
            return res.status(400).send({
                status : "Validation Error",
                error : {
                    message : error.details.map(err => err.message)
                }
            })
        }

        const {email, password} = req.body;

        // cek apakah akun email sudah terdaftar
        const account = await User.findOne({
            where : {
                email
            }
        });

        //jika tidak terdaftar makan invalid login
        if (!account) {
            return res.status(400).send({
                status: "Login Failed",
                error: {
                    message: "Invalid Login",
                },
            });
        }

        // cek password user dengan password yang ada didatabase
        const validPass = await bcrypt.compare(password, account.password);

        if (!validPass) {
            return res.status(400).send({
                status: "Login Failed",
                error: {
                    message: "Invalid Login",
                },
            });
        }

        const privateKey = process.env.JWT_PRIVATE_KEY;
        const token = jwt.sign(
        {
            id: account.id,
        },
            privateKey
        );

        // simpan data role dari variabel account user yang login
        const fullname = account.fullname;
        const avatar = account.avatar;
        const id = account.id;

        //response login dengan token
        res.send({
            status: responseSuccess,
            message: "Login Success",
            data: {
                chanel : {
                    id,
                    email,
                    fullname,
                    avatar,
                    token
                }
            },
        });

    } catch (err) {
        //error here
        console.log(err);
            return res.status(500).send({
            status : "Request Failed",
            error: {
                message: "Server Error",
            },
        });
    }
}

// berfungsi untuk cek saat refresh halaman ada atau tidak token
exports.checkAuth = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findOne({
        where: {
            id: userId,
        },
        });

        res.send({
        status: responseSuccess,
        message: "User Valid",
        data: user,
        });
    } catch (err) {
        //error here
        console.log(err);
        return res.status(500).send({
        error: {
            message: "Server Error",
        },
        });
    }
};
