const mongoose = require('mongoose');
const crypto = require('crypto');
const { v1: uuidv1 } = require('uuid');

const userSchema = new mongoose.Schema({
    fname: {
        type: String,
        trim: true,
        required: true,
        maxlength: 32
    },
    lname: {
        type: String,
        trim: true,
        required: true,
        maxlength: 32
    },
    znumber: {
        type: String,
        trim: true,
        required: true,
        maxlength: 32,
        unique: true
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    hashed_password: {
        type: String,
        required: true,
    },
    about: {
        type: String,
        trim: true,
    },
    salt: String,
    role: {
        type: Number,
        default: 0
    },
    history: {
        type: Array,
        default: []
    },
    otp: {
        type: String, // Field to store OTP
    },
    otpExpires: {
        type: Date, // Field to store OTP expiration timestamp
    }
},
{ timestamps: true }
);

// Virtual field for password
userSchema.virtual('password')
    .set(function(password) {
        this.salt = uuidv1();
        this.hashed_password = this.encryptPassword(password);
    })
    .get(function() {
        return this._password;
    });

// Methods for authentication
userSchema.methods = {
    authenticate: function(plainText) {
        return this.encryptPassword(plainText) === this.hashed_password;
    },
    encryptPassword: function(password) {
        if (!password) return "";
        try {
            return crypto.createHmac("sha1", this.salt)
                         .update(password)
                         .digest("hex");
        } catch (err) {
            return "";
        }
    },
    verifyOtp: function(otp) {
        // Verify OTP and check if it's still valid
        return this.otp === otp && this.otpExpires > Date.now();
    }
};

module.exports = mongoose.model("User", userSchema);
