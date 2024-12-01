const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const applicationSchema = new mongoose.Schema(
    {
        fname: {
            type: String,
            trim: true,
            required: true,
            maxlength: 32,
        },
        lname: {
            type: String,
            trim: true,
            required: true,
            maxlength: 32,
        },
        znumber: {
            type: String,
            trim: true,
            required: true,
            maxlength: 32,
            unique: true,
        },
        resume: {
            data: Buffer,
            contentType: String,
        },
        experience: {
            type: Boolean,
            required: true,
        },
        relevant_courses: {
            type: String,
            required: function () {
                return this.experience === true;
            },
        },
        from: {
            type: Date,
            required: function () {
                return this.experience === true;
            },
        },
        to: {
            type: Date,
            required: function () {
                return this.experience === true;
            },
        },
        course: {
            type: ObjectId,
            ref: 'job',
            required: false,
        },
        submittedBy: {
            type: ObjectId,
            ref: 'User', // Reference to the User model
            required: true,
        },
        status: {
            type: String,
            enum: ['rejected', 'selected','pending'],
            default: 'pending', // Default status is null until updated
        },
    },
    { timestamps: true }
);

// Create a compound index for `submittedBy` and `course` to ensure a user can only apply once per course
applicationSchema.index({ submittedBy: 1, course: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
