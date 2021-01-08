const jwt = require('jsonwebtoken');
const { User } = require('../../models');

const resError = (err, res) => {
    console.log(err);
    res.status(401).send({
    status: 'failed',
    error: {
        message: 'Invalid Token',
    }
    });
}

exports.auth = (req,res,next) => {
    let header, token;

    // kondisi jika tidak ada header dan token yang dikirim
    if (
        !(header = req.header("Authorization")) ||
        !(token = header.replace("Bearer ", ""))
    ) {
        return res.status(401).send({
            status : "Response Failed",
            error : {
                message : "Access Denied"
            }
        });
    }

    try {
        const privateKey = process.env.JWT_PRIVATE_KEY;

        const verified = jwt.verify(token, privateKey);

        //tambahkan request user sehingga bisa diakses di next function, middleware, etc
        // mengirim paramater seperti get pada bagian link
        req.user = verified;

        next();
    } catch (err) {
        //jika proses verify gagal maka kirim response invalid token
        resError(err, res);
    }
}

// exports.adminAuth = async (req, res, next) => {

//     // menangkap data req user dari auth sebelumnya
//     const user = req.user;
//     try {

//         // jika tidak ada data user, tampilkan error
//         if (!user) {
//         return res.status(400).send({
//             status: 'failed',
//             error: {
//                 message: 'No token! Authorization denied'
//             }
//         });
//         }

//         // simpan data user dari id yang diperoleh dari data user 
//         const admin = await User.findOne({ where: { id: user.id } });

//         // jika tidak ada data yang diperoleh tampilkan error
//         if (!admin) {
//         return res.status(400).send({
//             status: 'failed',
//             error: {
//                 message: 'No user! Admin authorization denied'
//             }
//         });
//         }

//         // jika data user ada dan rolenya tidak sama dengan admin maka munculkan error
//         if (admin.role !== "admin") {
//         return res.status(400).send({
//             status: 'failed',
//             error: {
//                 message: 'Resctricted, you are not admin'
//             }
//         });
//         }

//         // hanya user dengan role admin yang bisa lanjut
//         next();
//     } catch (err) {
//         resError(err, res)
//     }
// };