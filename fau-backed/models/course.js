const mongoose = require('mongoose')

const jobSchema = new mongoose.Schema({
    coursename: { type: String, required: true },
    description: { type: String, required: true },
});



module.exports = mongoose.model("job", jobSchema);