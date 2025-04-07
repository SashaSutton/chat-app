import jwt from 'jsonwebtoken';
import User from '../models/user.model';

export const protectRoute = async (req, res, next) => {
    try{
        const token = request.cookies.jwt;

        if(!token) {
            return res.status(401).json({message: "Not authorised, No token provided"});
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if(!decoded) {
            return res.status(401).json({message: "Not authorised, Invalid token"});
        }

        const user = await User.findById(decoded.userId).select("-password");

        if(!user) {
            return res.status(401).json({message: "User not found"});
        }
        req.user = user;

        next();
    } catch(err) {
        console.log("Error in protectRoute middleware", err.message);
        res.status(500).send('Internal server error');
    }
}