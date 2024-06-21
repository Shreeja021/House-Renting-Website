import jwt from "jsonwebtoken"
import "dotenv/config"

const generateTokenAndSetCookie = (userId, res) => {
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn: "5d"
    })
    res.cookie("jwt", token, {
        httpOnly: true, // more secure
        maxAge: 5 * 24 * 60 * 60 * 1000, // 15 days in milliseconds
        sameSite: "strict", // CSRF
    })
}

export default generateTokenAndSetCookie;