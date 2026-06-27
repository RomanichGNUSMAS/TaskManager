exports.errorMiddleware = (err,req,res,next) => {
    console.log(err)
    if(!err.isOperational) return res.status(500).json({ message:'something went wrong'});
    if(!err.name == 'ZodError') return res.status(400).json({ message:"invalid credentials"})
    return res.status(err.statusCode).json({ message:err.message }) 
}