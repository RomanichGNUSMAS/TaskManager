const multer = require('multer');
const path = require('node:path');
const fs = require('node:fs')

const diskStorage = multer.diskStorage({
    destination: (req,file,cb) => {
        if(fs.existsSync('./uploads')) {
            fs.mkdirSync('./uploads')
        }
        cb(null,'./uploads/')
    },
    filename : (req,file,cb) => {
        const date = Date.now() + '' + String.fromCharCode(Math.floor(Math.random() * 256));
        cb(null,date + file.fieldname + path.extname(file.originalname))
    }
})

exports.upload = multer({ storage:diskStorage })