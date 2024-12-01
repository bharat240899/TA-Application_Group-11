const User = require("../models/user");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
const { errorHandler } = require("../helpers/dbErrorHandler");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
    },
});

// Function to send OTP by email
const sendOtpByEmail = (email, fname, otp) => {
    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Your OTP Code',
        text: `Hi ${fname},\n\nYour OTP code is: ${otp}\n\nThank you!`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error sending OTP email: ", error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};

exports.signup = (req, res) => {
    const user = new User(req.body);
    user.save((err, user) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        user.salt = undefined;
        user.hashed_password = undefined;
        res.json({ user });
    });
};

exports.signin = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).exec();

    if (!user) {
        return res.status(400).json({ error: "User with that email does not exist. Please signup." });
    }

    if (!user.authenticate(password)) {
        return res.status(401).json({ error: "Email and password do not match." });
    }

    const otp = crypto.randomInt(100000, 999999);
    const otpExpires = Date.now() + 5 * 60 * 1000; // 5 minutes expiry

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    // Send OTP email with the user's first name
    sendOtpByEmail(user.email, user.fname, otp);

    return res.json({
        message: "OTP sent to your email. Please verify to continue.",
        user: { email: user.email, role: user.role }
    });
};

exports.verifyOtp = async (req, res) => {
    const { email, otp } = req.body;
    const user = await User.findOne({ email }).exec();

    if (!user || !user.verifyOtp(otp)) {
        return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    res.json({ token, user: { email: user.email, fname: user.fname, lname: user.lname ,role: user.role,_id: user._id ,znumber:user.znumber}});
};

exports.signout = (req, res) => {
    res.clearCookie("t");
    res.json({ message: "Signed out" });
};

exports.requireSignin = expressJwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
    userProperty: "auth",
});

exports.isAuth = (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Authorization token is required' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Invalid or expired token' });
        }
        
        // Fetch the user from the database using the decoded ID
        User.findById(decoded._id).exec((err, user) => {
            if (err || !user) {
                return res.status(400).json({ error: 'User not found' });
            }
            req.user = user;  // Attach user data to req.user
            next();
        });
    });
};

exports.isAdmin = (req, res, next) => {
    
    if (req.profile.role===0) {
        return res.status(403).json({
            error: "Admin resource!Access denied"
        });
    }
    next();
};




exports.isInstructor = (req, res, next) => {
    if (req.profile.role !== 2) {
        return res.status(403).json({ error: "Instructor resource! Access denied" });
    }
    next();
};

exports.isComem = (req, res, next) => {
    if (req.profile.role !== 3) {
        return res.status(403).json({ error: "Committee resource! Access denied" });
    }
    next();
};

// Generate OTP and send to user's email
exports.forgotPassword = (req, res) => {
    const { email } = req.body;

    User.findOne({ email }, (err, user) => {
        if (err || !user) {
            return res.status(400).json({ error: 'User with this email does not exist.' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
        const otpExpires = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes

        user.otp = otp;
        user.otpExpires = otpExpires;

        user.save((err) => {
            if (err) {
                return res.status(400).json({ error: 'Error saving OTP. Please try again.' });
            }

            // Email OTP to user
            const mailOptions = {
                from: process.env.EMAIL,
                to: email,
                subject: 'Password Reset OTP',
                text: `Your OTP for password reset is ${otp}. It expires in 10 minutes.`,
            };

            transporter.sendMail(mailOptions, (error) => {
                if (error) {
                    return res.status(400).json({ error: 'Failed to send OTP email.' });
                }
                res.json({ message: 'OTP sent successfully. Check your email.' });
            });
        });
    });
};

// Reset password using OTP
exports.resetPassword = (req, res) => {
    const { email, otp, newPassword } = req.body;

    User.findOne({ email }, (err, user) => {
        if (err || !user) {
            return res.status(400).json({ error: 'User with this email does not exist.' });
        }

        if (!user.verifyOtp(otp)) {
            return res.status(400).json({ error: 'Invalid or expired OTP.' });
        }

        user.password = newPassword; // Automatically hashes due to virtual field
        user.otp = undefined; // Clear OTP fields
        user.otpExpires = undefined;

        user.save((err) => {
            if (err) {
                return res.status(400).json({ error: 'Failed to reset password. Please try again.' });
            }
            res.json({ message: 'Password reset successful.' });
        });
    });
};
exports.requireSignin = expressJwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"], // added later
    userProperty: "auth",
});

