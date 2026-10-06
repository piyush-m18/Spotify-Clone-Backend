const jwt= require("jsonwebtoken");

async function authArtist(req,res,next){
    const token = req.cookies.token;
    if(!token){
        return res.status(401).json({message:"Unauthorized"});
    }

    try{
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        if(decodedToken.role !== "artist") {
            return res.status(403).json({ message: "You do not have permission to perform this action" });
        }
        req.user = decodedToken;
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({ message: "Invalid token" });
    }
}

async function authUser(req,res,next){
    const token = req.cookies.token;
    if(!token){
        return res.status(401).json({message:"Unauthorized"});
    }

    try{
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        if(decodedToken.role !== "user" && decodedToken.role !== "artist") {
            return res.status(403).json({ message: "You do not have permission to perform this action" });
        }
        req.user = decodedToken;
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({ message: "Invalid token" });
    }
}

module.exports = {authArtist, authUser};