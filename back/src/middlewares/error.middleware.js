exports.errorMiddleware = (err,req,res,next) => {
    console.log(err)
    if(!err.isOperational) return res.status(500).json({ message:'something went wrong'});
    return res.status(err.statusCode).json({ message:err.message }) 
}