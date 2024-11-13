const multer = require('multer')
const {v4 :uuidv4} = require("uuid")
const path = require('path')
const fs = require('fs')
let count=23423123

const storage = multer.diskStorage({
    destination:function (req,file,cb){
        if (req.body.type === "books") {

            if(req?.params?.bookId){
                fs.rmSync(`public/images/books/${req.params.bookId}`, { recursive: true, force: true });
            }
            const isbn = req.body.ISBN;
            console.log(req.body)
            const destPath = `public/images/books/${isbn}`;
            
            if (!fs.existsSync(destPath)) {
                fs.mkdirSync(destPath, { recursive: true }); 
            }

            cb(null, destPath);
        } else if (req.body.type === "category") {
            cb(null, "public/images/categories");
        }
    }, 
    filename :function (req,file,cb){
        cb(null,uuidv4()  + "-"  + count++ + "" + Date.now() +path.extname(file.originalname))
    } 
})
const fileFilter= (req,file,cb)=>{
    const allowedFileTypes = ['images/jpeg' , 'image/jpg', 'image/png']
    if(allowedFileTypes.includes(file.mimetype)){
        cb(null,true)
    }else{
        cb(null,false)
    }
}
 const upload = multer({storage , fileFilter})
 module.exports=upload