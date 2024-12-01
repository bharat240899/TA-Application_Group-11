const express = require('express')
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors=require('cors')
const expressValidator = require('express-validator')
require('dotenv').config()
//import routes
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user')
const courseRoutes = require('./routes/course')
const applicationRoutes = require('./routes/application');
const performanceRoutes = require('./routes/performance');

//app 
const app = express()
//db 

// load env variables

//db connection
mongoose.connect(
  process.env.DATABASE,
  { useNewUrlParser: true, useUnifiedTopology: true ,family:4,},
)
  .then(() => console.log('DB Connected'))

mongoose.connection.on('error', err => {
  console.log(`DB connection error: ${err.message}`)
});

//middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());
app.use(cors());

app.use(express.json()); // to parse application/json

//routes midddleware()
app.use("/api", authRoutes);
app.use("/api",userRoutes);
app.use("/api",courseRoutes);
app.use("/api",applicationRoutes);
app.use("/api",performanceRoutes);


const port = process.env.PORT || 8000

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})