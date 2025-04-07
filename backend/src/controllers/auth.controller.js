import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import {generateToken} from "../lib/utils.js";

export const signup = async (req, res) => {
    const {fullName, email, password} = req.body;
    try{
        if (!fullName || !email || !password) return res.status(400).send('All fields are required');
        if (password.length < 8) return res.status(400).send('Password must be at least 8 characters');

        const user = await User.findOne({email});
        if (user) return res.status(400).send('User already exists');

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName: fullName,
            email: email,
            password: hashedPassword
        });

        if (newUser) {
            generateToken(newUser._id, res);
            await newUser.save();
            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
                message: 'User created successfully'
            });
        } else{
            res.status(400).send('Invalid user data');
        }
    } catch(err) {
        console.log("Error in signup constroller", err.message);
        res.status(500).send('Internal server error');
    }
};

export const login = (req, res) => {

    const {email, password} = req.body;

    try{
        if (!email || !password) return res.status(400).send('All fields are required');



    } catch(err) {

    }

}

export const logout = (req, res) => {
    res.send('logout route');

}