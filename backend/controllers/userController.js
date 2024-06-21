import User from "./../models/userModel.js"
import generateTokenAndSetCookie from "../utils/helpers/generateTokenAndSetCookie.js";
import bcrypt from "bcrypt"

const register = async(req, res) => {
    try {
        const { firstName, lastName, email, password, phoneNumber, avatar } = req.body;
        const existingUser = await User.findOne({ email })
        if (existingUser) 
        {
            return res.status(402).json({ error: "User already exists" })
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        const newUser = new User({
            firstName,
            lastName,
            avatar: avatar,
            email,
            password: hashedPassword,
            phoneNumber
        })
        await newUser.save();
        generateTokenAndSetCookie(newUser._id, res)
        res.status(200).json({ message: "Registered successfully", newUser })

    } catch (error) 
    {
        res.status(500).json({ error: error.message });
        console.log(`Error in register: ${error.message}`)
    }
}

const login = async(req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch) {
          res.status(404).json({ error: "Password is not match" })
        }
        generateTokenAndSetCookie(user._id, res)
        res.status(200).json({ message: "Login successfully", user })

    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(`Error in register: ${error.message}`)
    }
}

const addRemoveWishlist = async (req, res) => {
    try {
        const user = req.user 
        const { id } = req.body;
        let wishlist;
        if(user.wishlist.includes(id)) {
            wishlist = await User.findByIdAndUpdate(user._id, {
                $pull: { wishlist: id }
            })
            user.wishlist = user.wishlist.filter((id) => id != id)
            res.status(200).json({ message: "Removed from wishlist", wishlist: user.wishlist })
        }
        else {
            wishlist = await User.findByIdAndUpdate(user._id, {
                $push: { wishlist: id }
            })
            user.wishlist.push(id)
            res.status(200).json({ message: "Added to wishlist", wishlist: user.wishlist })
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(`Error in get wishlist: ${error.message}`)
    }
}

const getWishList = async (req, res) => {
    try {
        const user = req.user 
        const wishlist = await User.findById(user._id).populate("wishlist")
        res.status(200).json(wishlist.wishlist)
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(`Error in get wishlist: ${error.message}`)
    }
}

const logout = async (req, res) => {
    try {
      res.cookie("jwt", "", {maxAge:1})
      res.status(200).json({ message: "Logout Successfully" })
    } catch (error) {
      console.log(`Error in logout: ${error.message}`)
    }
  }

const getSeller = async(req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id)
        if(!user) {
            return res.status(404).json({ error: "Sellar not found "})
        }
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({ error: error.message })
        console.log(`Error in GetSeller: ${error.message}`) 
    }
}

export { register, login, addRemoveWishlist, getWishList, logout, getSeller }