import userModel from "../models/user-model.js";
import bcrypt from "bcrypt";
import generateToken from "../utils/generateToken.js";
import router from "../routes/userRoutes.js";

export const registerUser = async (req, res) => {
  try {
    const { userName, email, password, role } = req.body;
    const currTime = new Date();

    let user = await userModel.findOne({ email });

    if (user)
      return res.json({
        error: true,
        message: "User already exists with this email",
      });

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, async (err, hash) => {
        let newUser = await userModel.create({
          userName,
          email,
          password: hash,
          role,
          createdAt: currTime,
          updatedAt: currTime,
        });

        let token = generateToken(newUser);
        res.cookie("token", token);
        return res.json({
          sucess: true,
          message: "Account created sucessfully",
          user: newUser,
        });
      });
    });
  } catch (error) {
    res.send({ error: true, message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user)
      return res.json({
        error: true,
        message: "User not exists, Create new Account",
      });

    bcrypt.compare(password, user.password, (err, result) => {
      if (err)
        return res.status(401).json({ error: true, message: err.message });
      if (result) {
        let token = generateToken(user);
        res.cookie("token", token);
        return res.json({
          sucess: true,
          message: "Successfully logged in",
          user: user,
        });
      } else {
        return res
          .status(401)
          .json({ error: true, message: "Invalid credentials" });
      }
    });
  } catch (error) {
    res.json({ error: true, message: error.message });
  }
};

export const logoutUser = (req, res) => {
  try {
    res.clearCookie("token");
    return res.json({ sucess: true, message: "Successfully loged out" });
  } catch (error) {
    res.json({ error: true, message: error.message });
  }
};
