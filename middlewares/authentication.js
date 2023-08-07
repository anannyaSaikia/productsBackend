
const authentication = (req, res, next) =>{
    const token = req.headers.authorization?.split(" ")[1];

    if(!token){
        res.send({msg : "Please Login First!"})
    }else{
        jwt.verify(token, process.env.SECRET_KEY, function(err, decoded){
            if(err){
                console.log(err);
                res.send({msg : "Please Login First"})
            }else{
                const user_id = decoded.user_id;
                req.user_id = user_id;
                next(); 
            }
        })
    }
}

module.exports = {authentication};