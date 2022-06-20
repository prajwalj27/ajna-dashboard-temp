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
  MIIEowIBAAKCAQEAhcGz/pPv0Y40/MLNuYAFDyOE2Ku1I4HVuiZ15sSkxvwDIFjk
  ktn0v9tuDhvR22kooDhE6jLarIjWMU1PPet3DOaop1MNm7BFuGaeNKzZJk8yAjTG
  Z5jgFxDgJaCTHxQ7bGDFINnL34uQ/588Auk0okLAnVfnDDPoscmxg0HHTi35HY+n
  esJr4TAq+9JRV92Im2dMxL8BM+xzteTkd0AfwAFgAIv7+wV+MhxgXFwGRzjF4yi+
  uzROF/mmgEJ7aplVrUldi9a2ZhX/Bwnnq+NiH3UukdvO324FOEdTN79UaWyOHrfd
  nB7SSKic8U7FieKlNK4Jv5Po9nIpm5brMghUTwIDAQABAoIBAAoTeoS+Dj3iEZnM
  7wR/YWIvkc1kugOPv1MDnLQisisPRwkDyUxKwQZG+HZ1oAyAUoAnXQGrjQ+cS05x
  fXuzpkdBhQj917OXxtjKWjarorwhESpbYWrieFckfU44V3zq4EMc0xzTa2lOsUCg
  dTve54klsC7qNUyVCH2ELSwvI11/OuZMFr+Yup1o37Je2vosEk4HhMdf7VMOryEz
  BVfdP6bi0TxeQh3ucyVKoPcDXbg5bKNRYQ7r7uJDaLNd2TAtxS9QsBP5LflW5vIe
  xRjHrQZ3/JuNf3wVlkg67TwuqjsVllxOXzZwZjgDIoYfsFwNH+I+jnqShFBJY+Su
  dIREr6ECgYEA12RMSSRrrefhKg77Qx1qzSyCKV5ePDKJqKho9ReQV66PcSL9Tnsy
  S9ca6riUYJ4K6iBnQupTyTZXkIGNTiTAXGGX/ahYcux7ZYYNT3XVGHeaW7Rw74Oi
  tcmOI4JZk2AJsLTaoSYp2FQF1uFV2tTUCWbPp2cCpeBJNdqWcn2QvrECgYEAnvla
  wIMQQy2NK5Z5wNyXUN6LY9vx3u7SbHprkrfBOrV8FwrMuJYKaqE6EfHACdzelPFE
  chqPo08h2rz7Jm1CHRHvUaWD3dDGm7t99RqV16ytMFQatIyi5cPNzMRI2a4U9UWH
  ZFiGPEE0dCwrZZz41WTlCSbJ1wjMEs9za4xtAv8CgYEA00pHb0S0AK/D+H8jyg20
  dDqiILS62nB1C6bQ9wS7itfpTIGXXQKLL0x+0hxpKXI/oLZStZiqwmp1cYM0u6Bf
  tv/hmmonAe2risb6jaU4ejzxhd43Hy3RUmS682huOJzwRJDVG1oVmGmsJMN9diJr
  MiHRuBTbyx5+kr6v8PXuJLECgYAz2sA4ZUfrsbMHkbi7KPkOftjWxMp7Xkky6yel
  ntyfis0kMvieCQryxw5LBiEO1oWf7abW1UUfDtPLJrOBUEgtdUkrx6JguxXdfGXU
  ikxwIjoHtpdTZ0BHU/wQG8JrhrX9XyWPnLSEePxkHHg3V+Fusc9nkchqpMr0I8jR
  Pufb/wKBgB3xq7bKYo59rtPUaZyTICDJnt1w9BNJrnkNwZMi4pNVm+9nfCBoYiXB
  NznN7GqqxgAnZ94GqHQPHsh911m7/kMGvQJIDjWEA1cO8H1I7Y/BHbI4Mw/LX2Ap
  P7UvXJBvKJrUdLcxV7hwUhQGkVxk7NBT9gaEhHkvIQXRWMThAKrQ
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
