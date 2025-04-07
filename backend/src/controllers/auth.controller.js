import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import {generateToken} from "../lib/utils.js";
import cloudinary from '../lib/cloudinary.js';

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

export const login = async (req, res) => {

    const {email, password} = req.body;

    try{
        const user = await User.findOne({email});
        if (!user) return res.status(400).send('Invalid credentials');

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) return res.status(400).send('Invalid credentials');

        generateToken(user._id, res)
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic
        })
    } catch(err) {
        console.log("Error in login constroller", err.message);
        res.status(500).send('Internal server error');
    }

};

export const logout = (req, res) => {
    try{
        res.cookie("jwt", "", {maxAge: 0})
        res.status(200).json({message: "Logged out successfully"})

    } catch(err) {
        console.log("Error in logout constroller", err.message);
        res.status(500).send('Internal server error');
    }
};

export const updateProfile = async (req, res) => {
    try{
        const {profilePic} = req.body;
        const userId = req.user._id;

        if(!profilePic) return res.status(400).send('Profile picture is required');

        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const updatedUser = await User.findByIdAndUpdate(userId, {profilePic: uploadResponse.secure_url}, {new: true});
        res.status(200).json(updatedUser);
    } catch(err) {
        console.log("Error in updateProfile constroller", err.message);
        res.status(500).send('Internal server error');
    }
};

