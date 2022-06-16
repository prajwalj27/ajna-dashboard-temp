// dev config variables name
const dev = {
  hostName: "https://localhost:4000",
  cookie_expiration: 7200,
};

// production variables name
const prod = {
  hostName: "http://3.128.120.207",
  cookie_expiration: 7200,
};
const config = process.env.REACT_APP_STAGE === "production" ? prod : dev;

// export the default configuration
export default {
  ...config,
};