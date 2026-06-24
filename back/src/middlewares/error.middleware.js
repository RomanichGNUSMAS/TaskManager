exports.errorMiddleware = (err,req,res,next) => {
    if(!err.isOptional) return res.status(500).json({ message:'something went wrong'});
    return res.status(err.statusCode).json({ message:err.message }) 
}