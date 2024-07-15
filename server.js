import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import ejs from "ejs";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import session from 'express-session';
import flash from 'connect-flash';
import cookieParser from 'cookie-parser';
import methodOverride from 'method-override';
import passport from './server/passport/passport-config.js';
import connectDB from './server/database/connection.js';
import viewRoutes from "./server/routes/viewRoutes.js";
import authRoutes from "./server/routes/auth.js";
import homepageRoutes from "./server/routes/homepage.js";
import profileRoutes from "./server/routes/profile.js";
import apartmentsRoutes from "./server/routes/apartments.js";
import applyRoute from "./server/routes/apply.js";
import adminRoutes from "./server/routes/admin.js";
import accountRoutes from "./server/routes/account.js";
import contactRoutes from "./server/routes/contact.js";

const app = express();
dotenv.config();
connectDB();
app.use(express.json());
app.use(cookieParser());
app.use(flash());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Set the view engine to ejs
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const templatePath = path.join(__dirname, './views');
app.set('view engine', 'ejs');
app.set('views', templatePath);

// Serve static files from the 'public' directory
app.use(express.static('public'))
app.use("/assets", express.static(path.join(__dirname, "public/assets"))); 


// Serve static files from the 'public' directory
app.use(express.static('public', {
  setHeaders: (res, path, stat) => {
    if (path.endsWith('.css')) {
      res.set('Content-Type', 'text/css');
    }
  }
}));


// Add express-session middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true
}))

app.use(passport.initialize());
app.use(passport.session());

// Middleware to parse "_method" query parameter
app.use(methodOverride('_method'));

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send('Something went wrong!');
// });

// Use the viewRoutes
app.use(viewRoutes);
app.use(authRoutes);
app.use(homepageRoutes);
app.use(profileRoutes);
app.use(apartmentsRoutes);
app.use(applyRoute);
app.use(adminRoutes);
app.use(accountRoutes);
app.use(contactRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
