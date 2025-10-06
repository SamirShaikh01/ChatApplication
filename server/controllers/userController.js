import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from 'bcryptjs';

// Signup new User
export const signUp = async (req,res) => {
    const { fullname, email, password, bio } = req.body;
    try {
        if (!fullname || !email || !password || !bio) {
            return res.json({ success: false, message: "Missing Any Detail" })
        }

        const user = await User.findOne({ email });
        if (user) {
            return res.json({ success: false, message: "Account is already exists !!!" })
        }

        // this will create random string and this string will be hashed with original passowrd to make it encrypted
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //data through mongodb
        const newUser = await User.create({
            fullname, email, password: hashedPassword, bio
        })

        const token = generateToken(newUser._id)

        res.json({ success: true, userData: newUser, token, message: "Account Created Successfully" })
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: "Account Creation failed" })
    }
}


export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const userData = await User.findOne({ email })
        const isPasswordCorrect = await bcrypt.compare(password, userData.password);
        if (!isPasswordCorrect) {
            return res.json({ success: false, message: "Invalid Credentials" });
        }
        const token = generateToken(userData._id)
        res.json({ success: true, userData, token, message: "Account Login Successfully" })
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}


// controller to check if user is autheticated
export const checkAuth = (req, res) => {
    res.json({ success: true, user: req.user });
}


// to updata user profile details
export const updateProfile = async (req, res) => {
    try {
        const { profilePic, bio, fullName } = req.body;
        const userId = req.user._id;
        let updatedUser;
        if (!profilePic) {
            updatedUser = await User.findByIdAndUpdate(userId, { bio, fullName }, { new: true })
        } else {
            const upload = await cloudinary.uploader.upload(profilePic);
            updatedUser = await User.findByIdAndUpdate(userId, { profilePic: upload.secure_url, bio, fullName }, { new: true })
        }
        res.json({ success: true, user: updatedUser })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}   
