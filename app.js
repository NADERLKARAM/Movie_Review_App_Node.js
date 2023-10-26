const path = require("path");

const express = require("express");
const dotenv = require("dotenv");
const morgan = require('morgan')

const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean")
const bodyParser = require('body-parser')


const userRouter = require('./routes/userRoute')
const authRouter = require('./routes/authRoute')
const actorRouter = require('./routes/actorRoute');
const movieRouter = require('./routes/movieRoute');

dotenv.config({ path: "config.env" });
const ApiError = require("./utils/apiError");
const globalError = require("./middlewares/errorMiddleware");
const dbConnection = require("./config/database");


//DB Connect
dbConnection();

// express app
const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))



// Middlewares
app.use(express.json({ limit: "20kb" }));
app.use(express.static(path.join(__dirname, 'uploads')));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}


// To remove data, use:
app.use(mongoSanitize());
/* make sure this comes before any routes */
app.use(xss());


app.use("/api/v3/users", userRouter);
app.use("/api/v3/auth", authRouter);
app.use("/api/v3/actorRouter", actorRouter);
app.use("/api/v3/movie", movieRouter);

app.all("*", (req, _res, next) => {
    next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
  });
  
  // Global error handling middleware for express
  app.use(globalError);
  
  const PORT = process.env.PORT || 8000;
  const server = app.listen(PORT, () => {
    console.log(`App running running on port ${PORT}`);
  });
  
  // Handle rejection outside express
  process.on("unhandledRejection", (err) => {
    console.error(`UnhandledRejection Errors: ${err.name} | ${err.message}`);
    server.close(() => {
      console.error(`Shutting down....`);
      process.exit(1);
    });
  })