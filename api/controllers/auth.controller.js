import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import path from "path";
import jwt from "jsonwebtoken";
import errorHandler from "../utils/error.js";
import nodemailer from "nodemailer";
// Multer setup
import multer from "multer";

// Set storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "profilePicture/"); // Destination folder for uploaded images
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    ); // Generate unique filename
  },
});
const createToken = (id) =>
  jwt.sign({ userId: id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
// Initialize multer
const upload = multer({
  storage: storage,
}).single("profilePicture"); // Name of the field in the form

export const signup = async (req, res, next) => {
  try {
    // Call multer middleware to handle file upload
    upload(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        console.error("Multer error:", err);
        return res.status(500).json({ error: "File upload error" });
      } else if (err) {
        // An unknown error occurred when uploading.
        console.error("Unknown error:", err);
        return res.status(500).json({ error: "Unknown error" });
      }

      // Multer has successfully uploaded the file
      const { name, bio, email, password } = req.body;
      const profilePicture = req.file ? req.file.filename : null; // Get the filename if file was uploaded

      // Hash the password before saving it to the database
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        name,
        bio,
        profilePicture, // Save the filename to the user object
        email,
        password: hashedPassword,
      });
      const existingEmail = await User.findOne({ email });
      const existingName = await User.findOne({ name });
      if (existingEmail || existingName) {
        return res.status(400).json({ error: "name or email already exist" });
      }
      const num = Math.round(Math.random(1, 100) * 1e6);
      const sendEmail = (email, id) => {
        // Replace these options with your email service provider
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.email,
            pass: process.env.password,
          },
        });

        const mailOptions = {
          from: process.env.email,
          to: email,
          subject: "Verify Email",
          text: `To verify your email, click on the following link: ${process.env.frontendUrl}/verify?id=${id}`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error("Error sending email:", error);
          } else {
            console.log("Email sent:", info.response);
          }
        });
      };
      await newUser.save();
      // res.status(201).json({ message: "User verified successfully" });
      res.status(201).json(newUser);
      const userinfo = await User.findOne({ email: req.body.email });
      sendEmail(req.body.email, userinfo._id);
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isPasswordMatch = bcrypt.compareSync(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    res.status(200).json({
      message: "Login Successful",
      token: createToken(user._id),
      userId: user._id,
      userEmail: user.email,
      profilePicture: user.profilePicture,
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const forgetPassword = async (req, res, next) => {
  const userEmail = req.params.userEmail;
  try {
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    const sendResetEmail = (email, id) => {
      // Replace these options with your email service provider
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.email,
          pass: process.env.password,
        },
      });

      const mailOptions = {
        from: process.env.email,
        to: email,
        subject: "Password Reset",
        text: `To reset your password, click on the following link: ${process.env.frontendUrl}/resetpassword?id=${id}`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
        } else {
          console.log("Email sent:", info.response);
        }
      });
    };

    sendResetEmail(userEmail, user._id);
    if (sendResetEmail) {
      res.status(200).json({ message: "sent succesfully Alhamdulillah" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const resetpassword = async (req, res, next) => {
  const password = await req.body.password;
  const id = req.params.id;
  try {
    console.log(password);
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user's password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
