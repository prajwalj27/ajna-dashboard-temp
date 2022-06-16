const { check, validationResult } = require("express-validator");

exports.userSignupValidator = (req, res, next) => {
  req.check("firstname", "firstname is required").notEmpty();
  req.check("lastname", "lastname is required").notEmpty();
  req
    .check("email", "Email must be between 3 to 32 characters")
    .matches(/.+\@.+\..+/)
    .withMessage("Email must contain @")
    .isLength({
      min: 4,
      max: 32,
    });

  req.check("password", "Password is required").notEmpty();

  req
    .check("password")
    .isLength({ min: 6 })
    .withMessage("Password must contain at least 6 characters")
    .matches(/\d/)
    .withMessage("Password must contain a number");
  const errors = req.validationErrors();
  if (errors) {
    const firstError = errors.map((error) => error.msg)[0];
    return res.status(400).json({ error: firstError });
  }
  next();
};

exports.SigninValidator = (req, res, next) => {
  req.check("email", "Please include a valid Email").notEmpty();
  req.check("password", "Password is required").notEmpty();
  const errors = req.validationErrors();
  if (errors) {
    const firstError = errors.map((error) => error.msg)[0];
    return res.status(400).json({ error: firstError });
  }
  next();
};

exports.clientSignupValidator = (req, res, next) => {
  req.check("clientId", "Client ID is Required").not().isEmpty(),
    req.check("name", "Name is Required").not().isEmpty(),
    req
      .check("email", "Please include a valid Email")
      .isEmail()
      .matches(/.+\@.+\..+/)
      .withMessage("Email must contain @")
      .isLength({
        min: 4,
        max: 32,
      }),
    req
      .check("password", "Please enter password with 6 or more character")
      .isLength({
        min: 6,
      });
  const errors = req.validationErrors();
  if (errors) {
    const firstError = errors.map((error) => error.msg)[0];
    return res.status(400).json({ error: firstError });
  }
  next();
};

exports.ClientPasswordValidator = (req, res, next) => {
  req.check("password", "Password is Required").not().isEmpty(),
    req.check("newpassword", "Newpassword is Required").not().isEmpty();

  const errors = req.validationErrors();
  if (errors) {
    const firstError = errors.map((error) => error.msg)[0];
    return res.status(400).json({ error: firstError });
  }
  next();
};

exports.UserSignUpValidator = (req, res, next) => {
  req.check("clientId", "Client ID is Required").not().isEmpty(),
    req.check("name", "Name is Required").not().isEmpty(),
    req.check("email", "Please include a valid Email").isEmail(),
    req.check("EmployeeId", "Employee id is required").not().isEmpty(),
    req.check("camera", "Camera is required").not().isEmpty(),
    req
      .check("password", "Please enter password with 6 or more character")
      .isLength({
        min: 6,
      });
  const errors = req.validationErrors();
  if (errors) {
    const firstError = errors.map((error) => error.msg)[0];
    return res.status(400).json({ error: firstError });
  }
  next();
};

exports.CameraStatusValidator = (req, res, next) => {
  req.check("cameraStatus", "Camera Status is required").exists();
  const errors = req.validationErrors();
  if (errors) {
    const firstError = errors.map((error) => error.msg)[0];
    return res.status(400).json({ error: firstError });
  }
  next();
};

exports.addNewBranchValidator = (req, res, next) => {
  req.check("clientId", "Client ID is Required").not().isEmpty(),
    req.check("branchName", "Branch Name is Required").not().isEmpty(),
    req.check("branchId", "Branch ID is Required").not().isEmpty(),
    req.check("modules", "Modules is Required").not().isEmpty(),
    req.check("NoOfCameras", "No of Cameras is Required").not().isEmpty(),
    req.check("userType", "Something Went Wrong").not().isEmpty(),
    req.check("dates", "Dates is Required").not().isEmpty(),
    req.check("amount", "Amount is Required").not().isEmpty();
  const errors = req.validationErrors();
  if (errors) {
    const firstError = errors.map((error) => error.msg)[0];
    return res.status(400).json({ error: firstError });
  }
  next();
};

exports.MacAddressValidator = (req, res, next) => {
  req.check("Mac_address", "Mac_address is required").exists(),
    req.check("client_email", "client_email is required").exists();
  const errors = req.validationErrors();
  if (errors) {
    const firstError = errors.map((error) => error.msg)[0];
    return res.status(400).json({ error: firstError });
  }
  next();
};

exports.branchMacAddressValidator = (req, res, next) => {
  req.check("Mac_address", "Mac_address is required").exists(),
    req.check("branchId", "branchId is required").exists();
  const errors = req.validationErrors();
  if (errors) {
    const firstError = errors.map((error) => error.msg)[0];
    return res.status(400).json({ error: firstError });
  }
  next();
};

exports.AdminSignUpValidation = (req, res, next) => {
  req.check("name", "Name is Required").not().isEmpty(),
    req.check("userType", "user Type is Required").not().isEmpty(),
    req.check("email", "Please include a valid Email").isEmail(),
    req
      .check("password", "Please enter password with 6 or more character")
      .isLength({
        min: 6,
      });
  const errors = req.validationErrors();
  if (errors) {
    const firstError = errors.map((error) => error.msg)[0];
    return res.status(400).json({ error: firstError });
  }
  next();
};

exports.DateValidator = (req, res, next) => {
  req.check("dateObj", "dates are Required").not().isEmpty();

  const errors = req.validationErrors();
  if (errors) {
    const firstError = errors.map((error) => error.msg)[0];
    return res.status(400).json({ error: firstError });
  }
  next();
};
