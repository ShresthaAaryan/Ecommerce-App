const User = require('../models/User');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerUser = async(req, res) => {
    try{
        const {username, email, password} = req.body;

        if(!username || !email || !password){
            return res.status(400).json({message: 'All fields are required'});
        }

        const existingUser = await User.findOne({ email });
        if(existingUser){
            return res.status(400).json({message: 'Email already exists'});
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({
            username, email, passwordHash
        });

        await newUser.save();

        res.status(201).json({message: "User successfully registered", user: newUser});

    }
    catch(error){
        console.error("Error registering user: ", error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

const loginUser = async (req, res) =>{
    try{
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(400).json({message: 'Email and password are required'});
        }
        const user = await User.findOne({ email });
        if(!user){
            return res.status(400).json({message: 'Invalid email or password'});
        }
        
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if(!isMatch){
            return res.status(400).json({message: 'Invalid email or password'});
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        res.status(200).json({ message:"Login successful", token });
    }
    catch(error){
        console.error("Error logging in user: ", error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

const getUserProfile = async (req, res) =>{
    try{
        const userId = req.userId;
        const user = await User.findById(userId).select('-passwordHash');
        if(!user){
            return res.status(404).json({message: 'User not found'});
        }

        res.status(200).json({ user });
    }
    catch(error){
        console.error("Error getting user profile: ", error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
};