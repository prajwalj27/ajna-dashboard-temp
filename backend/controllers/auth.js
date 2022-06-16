const User = require("../models/User");
const Client = require("../models/Clients");
const Admin = require("../models/Admin");
const Branch = require("../models/Branch");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("config");
const jwtSecret = config.get("jwtSecret");
const {JSEncrypt} = require("nodejs-jsencrypt")

const { errorHandler } = require("../helpers/dbErrorHandler");

exports.isAuthenticate = async (req, res) => {
  try {
    let user = await User.findById(req.user.id).select("-password");
    if (user) return res.status(200).json(user);

    let client = await Client.findById(req.user.id).select("-password");
    if (client) {
      let clientBranch = await Branch.findOne({
        clientId: client.clientId,
        isDefaultBranch: true,
      }).select("-camera.cameraFrame");

      return res.status(200).json(clientBranch);
    }
    let admin = await Admin.findById(req.user.id).select("-password");
    if (admin) return res.status(200).json(admin);
    return res.status(400).json({ errors: [{ msg: "Something went wrong" }] });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.adminSignin = async (req, res) => {
  const { email, password, userType } = req.body;
  try {
    let user = await Admin.findOne({ email });
    // see if user exists
    if (!user) {
      return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
    }
    if (user.userType !== userType) {
      return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
    }

    const payload = {
      user: {
        id: user.id,
        userType: "admin",
      },
    };
    jwt.sign(payload, jwtSecret, { expiresIn: "24hr" }, (err, token) => {
      if (err) throw err;
      res.status(200).json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.clientSignin = async (req, res) => {
  const { email, password, userType } = req.body;
  let today = new Date();
  try {
    let isActive = false;
    let client = await Client.findOne({ email });
    // see if user exists
    if (!client) {
      return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
    }
    if (client.userType !== userType) {
      return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
    }
    if (client.dates[0] <= today && client.dates[1] > today) {
      isActive = true;
    }
    // see if user exists
    if (!isActive) {
      return res
        .status(400)
        .json({ errors: [{ msg: "Please Renew your Account" }] });
    }
    const isMatch = await bcrypt.compare(password, client.password);
    if (!isMatch) {
      return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
    }
    const payload = {
      user: {
        id: client.id,
        userType: "client",
      },
    };
    jwt.sign(payload, jwtSecret, { expiresIn: "24h" }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.userSignin = async (req, res) => {
  const { email, password, userType } = req.body;
  try {
    let isActive = false;
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
    }

    if (user.userType !== userType) {
      return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
    }
    const payload = {
      user: {
        id: user.id,
        userType: "user",
      },
    };
    jwt.sign(payload, jwtSecret, { expiresIn: "24h" }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.userSigninAndRedirect = async (req, res) => {
  const privateKey = `
    -----BEGIN RSA PRIVATE KEY-----
    MIICXQIBAAKBgQDlOJu6TyygqxfWT7eLtGDwajtNFOb9I5XRb6khyfD1Yt3YiCgQ
    WMNW649887VGJiGr/L5i2osbl8C9+WJTeucF+S76xFxdU6jE0NQ+Z+zEdhUTooNR
    aY5nZiu5PgDB0ED/ZKBUSLKL7eibMxZtMlUDHjm4gwQco1KRMDSmXSMkDwIDAQAB
    AoGAfY9LpnuWK5Bs50UVep5c93SJdUi82u7yMx4iHFMc/Z2hfenfYEzu+57fI4fv
    xTQ//5DbzRR/XKb8ulNv6+CHyPF31xk7YOBfkGI8qjLoq06V+FyBfDSwL8KbLyeH
    m7KUZnLNQbk8yGLzB3iYKkRHlmUanQGaNMIJziWOkN+N9dECQQD0ONYRNZeuM8zd
    8XJTSdcIX4a3gy3GGCJxOzv16XHxD03GW6UNLmfPwenKu+cdrQeaqEixrCejXdAF
    z/7+BSMpAkEA8EaSOeP5Xr3ZrbiKzi6TGMwHMvC7HdJxaBJbVRfApFrE0/mPwmP5
    rN7QwjrMY+0+AbXcm8mRQyQ1+IGEembsdwJBAN6az8Rv7QnD/YBvi52POIlRSSIM
    V7SwWvSK4WSMnGb1ZBbhgdg57DXaspcwHsFV7hByQ5BvMtIduHcT14ECfcECQATe
    aTgjFnqE/lQ22Rk0eGaYO80cc643BXVGafNfd9fcvwBMnk0iGX0XRsOozVt5Azil
    psLBYuApa66NcVHJpCECQQDTjI2AQhFc1yRnCU/YgDnSpJVm1nASoRUnU8Jfm3Oz
    uku7JUXcVpt08DFSceCEX9unCuMcT72rAQlLpdZir876
    -----END RSA PRIVATE KEY-----`;

  const encryptedData = req.query.data;
  // console.log(encryptedData)
  // const { email, password, userType } = {
  //   email: "user@gmail.com",
  //   password: "123456",
  //   userType: "user" 
  // }

  const email = "user@gmail.com"
  const  password = "123456"
  const userType = "user"

  // console.log("email", email)
  // console.log("password", password)
  // console.log("userType", userType)
  try {
    const decrypt = new JSEncrypt();
    decrypt.setPrivateKey(privateKey);
    const uncrypted = decrypt.decrypt(encryptedData);

    const decryptedData = JSON.parse(uncrypted);
    console.log("Decrypted Data: ", decryptedData);

    let isActive = false;
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
    }

    if (user.userType !== userType) {
      return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
    }
    const payload = {
      user: {
        id: user.id,
        userType: "user",
      },
    };
    jwt.sign(payload, jwtSecret, { expiresIn: "24h" }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
