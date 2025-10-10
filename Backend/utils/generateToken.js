import jwt from "jsonwebtoken";

const generateToken = (user) => {
  return jwt.sign(
    {
      email: user.email,
      id: user._id,
    },
    process.env.JWT_ACCESS_TOKEN,
    { expiresIn: "7d" }
  );
};

export default generateToken;
