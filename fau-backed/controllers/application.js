const Application = require('../models/application');
const course = require('../models/course');
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
    },
});
const sendStatusByEmail = (email, fname, course, status) => {
    let subject = 'Your Application Status';
    let text = '';

    // Set email content based on status
    if (status === 'selected') {
        subject = 'Congratulations! Your Application Status';
        text = `Hi ${fname},

We are pleased to inform you that your application for the ${course} position has been successful! 

We are excited to have you on board. Please await further instructions regarding the next steps.

Best regards,
John
Committee Head
Florida Atlantic University`;
    } else if (status === 'rejected') {
        subject = 'Application Status Update';
        text = `Hi ${fname},

We regret to inform you that your application for the ${course} position has been rejected and cannot be proceeded for further steps .

Thank you for your interest in the position, and we appreciate the time and effort you invested in your application. We encourage you to apply for other opportunities in the future.

Best regards,
John
Committee Head
Florida Atlantic University`;
    } else if (status === 'pending') {
        subject = 'Your Application Status Update';
        text = `Hi ${fname},

We wanted to update you that your application for the ${course} position is currently under review.

We will notify you of any changes to your status as soon as possible.

Thank you for your patience!

Best regards,
John
Committee Head
Florida Atlantic University`;
    }

    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: subject,
        text: text,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error sending email: ", error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};

exports.createApplicationForCourse = async (req, res) => {
    const { courseId } = req.params;

    // Ensure the user is authenticated
    if (!req.auth || !req.auth._id) {
        return res.status(401).json({ error: 'Unauthorized: User not authenticated.' });
    }

    const { fname, lname, znumber, experience, from, to, relevant_courses } = req.body;

    // Validation: Check if all required fields are provided
    const errors = [];
    if (!fname) errors.push('First name is required.');
    if (!lname) errors.push('Last name is required.');
    if (!znumber) errors.push('Z Number is required.');
    if (experience === undefined) errors.push('Experience is required.');
    if (experience === 'true') {
        if (!from || !to) errors.push('Both "from" and "to" dates are required when experience is true.');
        if (new Date(from) > new Date(to)) errors.push('"From" date cannot be later than "to" date.');
        if (!relevant_courses) errors.push('Relevant courses are required when experience is true.');
    }

    if (errors.length) {
        return res.status(400).json({ error: errors });
    }

    // Check if the user has already applied for this course
    try {
        const existingApplication = await Application.findOne({
            submittedBy: req.auth._id,
            course: courseId,
        });

        if (existingApplication) {
            return res.status(400).json({ error: 'You have already submitted an application for this course.' });
        }

        // Create the new application
        const application = new Application({
            fname,
            lname,
            znumber,
            experience,
            from: experience === 'true' ? from : null,
            to: experience === 'true' ? to : null,
            relevant_courses: experience === 'true' ? relevant_courses : null,
            resume: {
                data: req.file?.buffer,
                contentType: req.file?.mimetype,
            },
            submittedBy: req.auth._id,
            course: courseId,
        });

        await application.save();
        res.status(201).json({
            message: 'Application submitted successfully.',
            application: {
                id: application._id,
                fname: application.fname,
                lname: application.lname,
                znumber: application.znumber,
                submittedBy: req.auth._id,
                status: 'pending'
            },
        });
    } catch (error) {
        console.error('Error submitting application:', error); // Log the error for debugging
        res.status(500).json({ error: error.message });
    }
};
exports.updateApplicationStatus = async (req, res) => {
    const { applicationId } = req.params;
    console.log(applicationId);
    console.log('Raw Body:', req.body); // Log the entire body
    const { status } = req.body;

    console.log('Extracted Status:', status); // Log extracted `status`


    const validStatuses = ['rejected', 'selected', 'pending'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({
            error: `Invalid status. Status must be either "rejected" or "selected or pending".`,
        });
    }

    try {
        // Find the application by ID and update its status
        const application = await Application.findById(applicationId);

        if (!application) {
            return res.status(404).json({ error: 'Application not found.' });
        }

        // Update the status field
        application.status = status;
        await application.save();

        res.status(200).json({
            message: `Application status updated successfully to "${status}".`,
            application: {
                id: application._id,
                fname: application.fname,
                lname: application.lname,
                znumber: application.znumber,
                status: application.status,
            },
        });
    } catch (error) {
        console.error('Error updating application status:', error); // Log the error for debugging
        res.status(500).json({ error: 'Server error. Please try again later.' });
    }
};




// Get all applications for a specific course
// Get all applications
// exports.listApplications = async (req, res) => {
//     try {
//         // Fetch all applications
//         const applications = await Application.find()
//             .populate('submittedBy', 'fname lname email  experience')
//             .populate('coursework', 'experience relevant_courses')// Populate user details
//             .populate('course', 'coursename description')
//             .select('fname lname znumber experience relevant_courses from to resume submittedBy course status'); // Select specific fields

//         // Check if there are any applications
//         if (applications.length === 0) {
//             return res.status(404).json({ message: 'No applications found.' });
//         }

//         console.log('Applications fetched:', applications.length); // Logs 
//         return res.status(200).json({ applications });
//     } catch (error) {
//         console.error('Error listing applications:', error.message);
//         return res.status(500).json({ error: 'Server error. Please try again later.' });
//     }
// };


exports.listApplications = async (req, res) => {
    try {
        const { status } = req.query;
        const query = status ? { status: { $in: status.split(',') } } : {}; // Efficient query handling
        const applications = await Application.find(query)
            .populate('submittedBy', 'fname lname email experience')
            .populate('course', 'coursename description')
            .select('fname lname znumber experience relevant_courses from to resume submittedBy course status');

        if (!applications.length) return res.status(404).json({ message: 'No applications found.' });
        return res.status(200).json({ applications });
    } catch (error) {
        console.error('Error fetching applications:', error.message);
        return res.status(500).json({ error: 'Server error. Please try again later.' });
    }
};
exports.sendUpdate = async (req, res) => {
    try {
        const { email, course, fname, status } = req.body;
        // const query = status ? { status: { $in: status.split(',') } } : {}; // Efficient query handling
        // const applications = await Application.find(query)
        //     .populate('submittedBy', 'fname lname email experience')
        //     .populate('course', 'coursename description')
        //     .select('fname lname znumber experience relevant_courses from to resume submittedBy course status');

        // if (!applications.length) return res.status(404).json({ message: 'No applications found.' });

        sendStatusByEmail(email, fname, course, status);

        return res.json({

            message: "Status sent to your email. Please verify to continue.",
            applications: { email: email, fname: fname, course: course }
        });
    } catch (error) {
        console.error('Error Sending Status:', error.message);
        return res.status(500).json({ error: 'Server error. Please try again later.' });
    }
};