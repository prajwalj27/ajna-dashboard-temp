const express = require("express");
const mongoose = require("mongoose");
const connectDb = require("./config/db");
const http = require("http");
const cors = require("cors");
const socketio = require("socket.io");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const basicAuth = require("express-basic-auth");
const expressValidator = require("express-validator");

const app = express();
const {
  insertFootfall,
  updateFootfall,
  insertMaskNotification,
  updateMaskNotification,
  insertDwellTimeNotification,
  updateDwellTimeNotification,
} = require("./controllers/notifications");
app.use(cors());
app.use(expressValidator());

// sockets
const server = http.createServer(app);
const io = socketio(server, {
  pingInterval: 60000,
  pingTimeout: 180000,
  cookie: false,
  origins: "*",
  transports: ["flashsocket", "polling", "websocket"],
  // transports: ["websocket", "polling"],
  connection: "upgrade",
  allowUpgrades: "websocket",
});
io.set("transports", ["websocket", "flashsocket", "polling"]);
io.origins("*:*");

io.on("connect", (socket) => {
  // console.log("New ws Connection");
});

io.of("/api/socket").on("connection", async (socket) => {
  // await console.log("socket.io: User connected: ", socket.id);

  socket.on("disconnect", (reason) => {
    console.log("socket.io: User disconnected: ", reason);
    io.emit("user disconnected", socket.userId);
  });
  socket.on("reconnect_attempt", () => {
    console.log("reconnected");
    socket.io.opts.transports = ["polling", "websocket"];
  });
});

// connect db
connectDb();
// init middleware
app.use(express.json({ limit: "50mb", extended: true }));

// Extended: https://swagger.io/specification/#infoObject
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.1",
    info: {
      version: "1.0.0",
      title: "AJNA AI API Documentation",
      description: "User Management API Information",
      contact: {
        name: "Ajna AI",
        email: "info@ajna.ai",
        url: "https://www.ajna.ai",
      },

      host: "http://3.128.120.207/",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "apiKey",
          name: "x-auth-token",
          scheme: "bearer",
          in: "header",
        },
      },
    },
    // security: {
    //   bearerAuth: [],
    // },
    basePath: "/",
    servers: [
      {
        url: "http://localhost:4000/api",
      },
    ],
  },
  apis: ["server.js", "./swagger/*.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

app.get("/swagger.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerDocs);
});

app.use(
  "/api/api-docs",
  basicAuth({
    users: { Ajna: "Ajna@123" },
    challenge: true,
  }),
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocs, { explorer: true })
);

/**
 * @swagger
 * /home:
 *  get:
 *    summary: Test api server working fine
 *    tags: [Home]
 *    description: Test Server Working
 *    responses:
 *      '200':
 *        description: A successful response
 */

app.get("/api/home", (req, res) => {
  res.send("A successful response Api Running Fine");
});

// Define Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/user"));
app.use("/api/admin", require("./routes/admin"));
// app.use("/api/data", require("./routes/data"));
app.use("/api/clients", require("./routes/client"));
app.use("/api/branch", require("./routes/branch"));
app.use("/api/maskdetection", require("./routes/maskDetection"));
app.use("/api/social-distancing", require("./routes/socialDistancing"));
app.use("/api/contact-tracing", require("./routes/contactTracing"));
app.use("/api/footfall-analysis", require("./routes/footfallAnalysis"));
app.use("/api/dwell-time-analysis", require("./routes/dwellTimeAnalysis"));
app.use("/api/path-tracking", require("./routes/pathTracking"));
app.use("/api/heatmap", require("./routes/heatmap"));
app.use("/api/awsTrigger", require("./routes/AwsTrigger"));
app.use("/api/notification", require("./routes/notification"));
app.use("/api/pdf", require("./routes/pdfapi"));
app.use("/api/compare", require("./routes/comparisonPdf"));

const PORT =
  process.env.NODE_ENV === "production" ? process.env.PORT || 80 : 4000;

server.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});

const connection = mongoose.connection;
connection.on("error", (error) => console.log("Error: " + error));

connection.once("open", () => {
  // user
  const usersChangeStream = connection
    .collection("users")
    .watch({ fullDocument: "updateLookup" });
  usersChangeStream.on("change", (change) => {
    switch (change.operationType) {
      case "insert":
        io.of("/api/socket").emit("insertUser", change.fullDocument);
        break;

      case "delete":
        io.of("/api/socket").emit("deleteUser", change.documentKey._id);
        break;

      case "update":
        io.of("/api/socket").emit("updateUser", change.fullDocument);
        break;
    }
  });

  // footfall analysis
  const footfallAnalysisChangeStream = connection
    .collection("footfall_analyses")
    .watch({ fullDocument: "updateLookup" });
  footfallAnalysisChangeStream.on("change", (change) => {
    switch (change.operationType) {
      case "insert":
        io.of("/api/socket").emit("insertFootfall", change.fullDocument);
        insertFootfall(change.fullDocument);
        break;

      case "delete":
        io.of("/api/socket").emit("deleteFootfall", change.documentKey._id);
        break;

      case "update":
        io.of("/api/socket").emit("updateFootfall", change.fullDocument);
        updateFootfall(change.fullDocument);
        break;
    }
  });

  // mask detection
  const maskDetectionChangeStream = connection
    .collection("mask_detections")
    .watch({ fullDocument: "updateLookup" });

  maskDetectionChangeStream.on("change", (change) => {
    switch (change.operationType) {
      case "insert":
        io.of("/api/socket").emit("insertMask", change.fullDocument);
        let { Mask_detected, Face_detected } = change.fullDocument;
        if (Face_detected && !Mask_detected)
          insertMaskNotification(change.fullDocument);
        break;

      case "delete":
        io.of("/api/socket").emit("deleteMask", change.documentKey._id);
        break;

      case "update":
        io.of("/api/socket").emit("updateMask", change.fullDocument);
        // let { Mask_detected, Face_detected } = change.fullDocument;
        if (Face_detected && !Mask_detected)
          updateMaskNotification(change.fullDocument);
        break;
    }
  });

  // contact tracing
  const contact_tracingsChangeStream = connection
    .collection("contact_tracings")
    .watch({ fullDocument: "updateLookup" });
  contact_tracingsChangeStream.on("change", (change) => {
    switch (change.operationType) {
      case "insert":
        io.of("/api/socket").emit("insertContact", change.fullDocument);
        break;

      case "delete":
        io.of("/api/socket").emit("deleteContact", change.documentKey._id);
        break;

      case "update":
        io.of("/api/socket").emit("updateContact", change.fullDocument);
        break;
    }
  });

  // dwell time
  const dwellTimeChangeStream = connection
    .collection("dwelltime_analyses")
    .watch({ fullDocument: "updateLookup" });
  dwellTimeChangeStream.on("change", (change) => {
    switch (change.operationType) {
      case "insert": {
        io.of("/api/socket").emit("insertDwellTime", change.fullDocument);
        let { passerBy } = change.fullDocument;
        let insertNotification = false;
        passerBy.map((item, index) => {
          if (!item.Threshold) insertNotification = true;
        });
        if (insertNotification)
          insertDwellTimeNotification(change.fullDocument);
        break;
      }
      case "delete":
        io.of("/api/socket").emit("deleteDwellTime", change.documentKey._id);
        break;

      case "update": {
        let { passerBy } = change.fullDocument;
        io.of("/api/socket").emit("updateDwellTime", change.fullDocument);
        let insertNotification = false;
        passerBy.map((item, index) => {
          if (!item.Threshold) insertNotification = true;
        });
        if (insertNotification)
          updateDwellTimeNotification(change.fullDocument);
        break;
      }
    }
  });

  // Heatmap
  const heatmapChangeStream = connection
    .collection("heatmaps")
    .watch({ fullDocument: "updateLookup" });
  heatmapChangeStream.on("change", (change) => {
    switch (change.operationType) {
      case "insert":
        io.of("/api/socket").emit("insertHeatmap", change.fullDocument);
        break;

      case "delete":
        io.of("/api/socket").emit("deleteHeatmap", change.documentKey._id);
        break;

      case "update":
        io.of("/api/socket").emit("updateHeatmap", change.fullDocument);
        break;
    }
  });

  // PathTracking
  const pathTrackingChangeStream = connection
    .collection("path_trackings")
    .watch({ fullDocument: "updateLookup" });
  pathTrackingChangeStream.on("change", (change) => {
    switch (change.operationType) {
      case "insert":
        io.of("/api/socket").emit("insertPathTracking", change.fullDocument);
        break;

      case "delete":
        io.of("/api/socket").emit("deletePathTracking", change.documentKey._id);
        break;

      case "update":
        io.of("/api/socket").emit("updatePathTracking", change.fullDocument);
        break;
    }
  });

  // Social Distancing
  const social_distancesChangeStream = connection
    .collection("social_distances")
    .watch({ fullDocument: "updateLookup" });
  social_distancesChangeStream.on("change", (change) => {
    switch (change.operationType) {
      case "insert":
        io.of("/api/socket").emit("insertSocial", change.fullDocument);
        break;

      case "delete":
        io.of("/api/socket").emit("deleteSocial", change.documentKey._id);
        break;

      case "update":
        io.of("/api/socket").emit("updateSocial", change.fullDocument);
        break;
    }
  });
});
