let chai = require("chai");
let chaiHttp = require("chai-http");
let app = require("../server").default;
var assert = require("assert");
let should = chai.should();
chai.should();
chai.use(chaiHttp);
let token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbiI6eyJpZCI6IjVmZDdhMjcwOWRmYTdlMTYxNGFlMjAwNyIsInVzZXJUeXBlIjoiYWRtaW4ifSwiaWF0IjoxNjA3OTY3MzQ1LCJleHAiOjE2MDgwNTM3NDV9.e1ZScrUXU_uK-JxbuqyF9WchCkTs9L_x6i0MSgPWtZA";

const server = "http://localhost:4000";
describe("Branch API", function () {
  // 1.Test the Get all branch
  describe("Get /api/branch", function () {
    it("It should get all the branches", (done) => {
      chai
        .request("http://localhost:4000")
        .get("/api/branch")
        .set({ "x-auth-token": `${token}` })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
        });
      done();
    });
    it("It should not get all the branches", (done) => {
      chai
        .request("http://localhost:4000")
        .get("/api/branches")
        .set({ "x-auth-token": `${token}` })
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
  });

  // 2.Test the Get branch by clientId
  describe("Get /api/branch/:id", function () {
    // authorisation refresh token required everytime
    it("It should get client by clientId", (done) => {
      const clientId = "faefffbf-9220-404e-9bde-b32ee149f958";
      chai
        .request("http://localhost:4000")
        .get("/api/branch/" + clientId)
        .set({ "x-auth-token": `${token}` })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
        });
      done();
    });
  });

  // 2.Test the Get branch by clientId
  describe("Delete /api/branch/:id", function () {
    // authorisation refresh token required everytime
    it("It should delete branch by branchId", (done) => {
      const branchId = "faefffbf-9220-404e-9bde-b32ee149f958";
      chai
        .request("http://localhost:4000")
        .delete("/api/branch/" + branchId)
        .set({ "x-auth-token": `${token}` })
        .end((err, res) => {
          res.should.have.status(200);
        });
      done();
    });
  });

  // 3.Test the POST route to add new branch
  describe("POST /api/branch", function () {
    //   cannot post all the time with same clientId so error occur ...working fine
    it("It should post new branch", (done) => {
      const client = {
        clientId: "client",
        userType: "client",
        branchId: "some",
        branchName: "some",
        Mac_address: "",
        isDefaultBranch: false,
        isAdminAccepted: false,
        modules: [],
        NoOfCameras: 0,
        deviceStatus: [],
        camera: [],
        location: "chennai",
        image: "",
        configuration: "",
        dates: [],
        amount: 500,
        subscribed: 2,
        description: 1,
      };
      chai
        .request("http://localhost:4000")
        .post("/api/branch")
        .set({ "x-auth-token": `${token}` })
        .send(client)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("branch.clientId").eq("client");
          res.body.should.have.property("branch.userType").eq("client");
        });
      done();
    });

    it("It should not post as branchid already exist", async (done) => {
      const client = {
        clientId: "client",
        userType: "client",
        branchId: "some",
        branchName: "some",
        Mac_address: "",
        isDefaultBranch: false,
        isAdminAccepted: false,
        modules: [],
        NoOfCameras: 0,
        deviceStatus: [],
        camera: [],
        location: "chennai",
        image: "",
        configuration: "",
        dates: [],
        amount: 0,
        subscribed: 2,
        description: 1,
      };
      chai
        .request(server)
        .post("/api/branch")
        .send(client)
        .end((err, res) => {
          res.should.have.status(409);
        });
      await done();
    });
    it("It should not post as branchid, clientid and location is required", async (done) => {
      const client = {
        clientId: "",
        userType: "client",
        branchId: "",
        branchName: "some",
        Mac_address: "",
        isDefaultBranch: false,
        isAdminAccepted: false,
        modules: [],
        NoOfCameras: 0,
        deviceStatus: [],
        camera: [],
        location: "",
        image: "",
        configuration: "",
        dates: [],
        amount: [],
        subscribed: 2,
        description: 1,
      };
      chai
        .request(server)
        .post("/api/branch")
        .send(client)
        .end((err, res) => {
          res.should.have.status(400);
        });
      await done();
    });
  });

  //4 get branches which are accepted by admin
  describe("Get /api/branch/accept", function () {
    it("It should get all the branches accepted by admin", (done) => {
      chai
        .request("http://localhost:4000")
        .get("/api/branch/accept")
        .set({ "x-auth-token": `${token}` })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
        });
      done();
    });
  });

  //5 get branches of specific client which are accepted by admin
  describe("Get /api/branch/me/:id", function () {
    it("It should get branch via branchId", (done) => {
      let branchId = "some";
      chai
        .request("http://localhost:4000")
        .get("/api/branch/me/" + branchId)
        .set({ "x-auth-token": `${token}` })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
        });
      done();
    });
    it("It should not get branch via branchId branchid doesn't exist", (done) => {
      let branchId = "some1";
      chai
        .request("http://localhost:4000")
        .get("/api/branch/me/" + branchId)
        .set({ "x-auth-token": `${token}` })
        .end((err, res) => {
          res.should.have.status(400);
          //   res.body.should.be.a("object");
        });
      done();
    });
  });

  //6 Update branch on admin accept or reject action
  describe("Put /api/branch/:id", function () {
    it("It should update branch via branchId", (done) => {
      let branchId = "some",
        val = "true";
      chai
        .request("http://localhost:4000")
        .put("/api/branch/" + branchId)
        .set({ "x-auth-token": `${token}` })
        .send(val)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
        });
      done();
    });
  });

  //   add zone in camera
  describe("Post /api/branch/configurezone/:id", function () {
    it("It should add zone in camera", (done) => {
      let configuration = {
        points: [],
        zone: "top",
        direction: "Down",
        camera: "0_33f2cd8d-8af5-4d2d-a320-1fbe4d2b4aa3",
      };
      let branchId = "some";
      chai
        .request("http://localhost:4000")
        .post("/api/branch/configurezone/" + branchId)
        .set({ "x-auth-token": `${token}` })
        .send(configuration)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
        });
      done();
    });

    it("It should not add zone in camera as branchid doesn't exist", (done) => {
      let branchId = "";
      let configuration = {
        points: [],
        zone: "top",
        direction: "Down",
        camera: "0_33f2cd8d-8af5-4d2d-a320-1fbe4d2b4aa3",
      };
      chai
        .request("http://localhost:4000")
        .post("/api/branch/configurezone/" + branchId)
        .set({ "x-auth-token": `${token}` })
        .send(configuration)
        .end((err, res) => {
          res.should.have.status(404);
        });
      done();
    });
  });

  //   get zone in camera
  describe("Get /api/branch/configurezone/:id", function () {
    it("It should add zone in camera", (done) => {
      let branchId = "some";
      chai
        .request("http://localhost:4000")
        .get("/api/branch/configurezone/" + branchId)
        .set({ "x-auth-token": `${token}` })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
        });
      done();
    });

    it("It should not add zone in camera as branchid doesn't exist", (done) => {
      let branchId = "";

      chai
        .request("http://localhost:4000")
        .get("/api/branch/configurezone/" + branchId)
        .set({ "x-auth-token": `${token}` })
        .end((err, res) => {
          res.should.have.status(404);
        });
      done();
    });
  });

  //   add configureSocial in camera
  describe("Post /api/branch/configureSocial/:id", function () {
    it("It should add configureSocial in camera", (done) => {
      let configuration = {
        points: [],
        zone: "top",
        direction: "Down",
        camera: "0_33f2cd8d-8af5-4d2d-a320-1fbe4d2b4aa3",
      };
      let branchId = "some";
      chai
        .request("http://localhost:4000")
        .post("/api/branch/configureSocial/" + branchId)
        .set({ "x-auth-token": `${token}` })
        .send(configuration)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
        });
      done();
    });

    it("It should not add zone in camera as branchid doesn't exist", (done) => {
      let branchId = "";
      let configuration = {
        points: [],
        zone: "top",
        direction: "Down",
        camera: "0_33f2cd8d-8af5-4d2d-a320-1fbe4d2b4aa3",
      };
      chai
        .request("http://localhost:4000")
        .post("/api/branch/configureSocial/" + branchId)
        .set({ "x-auth-token": `${token}` })
        .send(configuration)
        .end((err, res) => {
          res.should.have.status(404);
        });
      done();
    });
  });

  //   get configureSocial in camera
  describe("Get /api/branch/configureSocial/:id", function () {
    it("It should add zone in camera", (done) => {
      let branchId = "some";
      chai
        .request("http://localhost:4000")
        .get("/api/branch/configureSocial/" + branchId)
        .set({ "x-auth-token": `${token}` })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
        });
      done();
    });

    it("It should not add zone in camera as branchid doesn't exist", (done) => {
      let branchId = "";

      chai
        .request("http://localhost:4000")
        .get("/api/branch/configurezone/" + branchId)
        .set({ "x-auth-token": `${token}` })
        .end((err, res) => {
          res.should.have.status(404);
        });
      done();
    });
  });

  //   get configurePath in camera with type and cam id
  describe("Get /api/branch/configurepath/:id/:type/:c_id", function () {
    it("It should add zone in camera", (done) => {
      let branchId = "some",
        type = "client",
        camera = "first";
      chai
        .request("http://localhost:4000")
        .get(`/api/branch/configurepath/${branchId}/${type}/${camera}`)
        .set({ "x-auth-token": `${token}` })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
        });
      done();
    });
  });

  // add configure-path in camera
  describe("Post /api/branch/configurepath/:id/:type", function () {
    it("It should add configurepath in camera", (done) => {
      let configuration = {
        points: [],
        zone: "top",
        direction: "Down",
        camera: "0_33f2cd8d-8af5-4d2d-a320-1fbe4d2b4aa3",
      };
      let branchId = "some",
        type = "client";
      chai
        .request("http://localhost:4000")
        .post("/api/branch/configurepath/" + branchId + "/" + type)
        .set({ "x-auth-token": `${token}` })
        .send(configuration)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
        });
      done();
    });
  });

  //   add configure-image in camera
  describe("Post /api/branch/configure-image/:id/:type", function () {
    it("It should add configure-image in camera", (done) => {
      let image = "",
        camera = "0_33f2cd8d-8af5-4d2d-a320-1fbe4d2b4aa3";
      let Id = "some",
        type = "client";
      chai
        .request("http://localhost:4000")
        .post("/api/branch/configure-image/" + Id + "/" + type)
        .set({ "x-auth-token": `${token}` })
        .send({ image, camera })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
        });
      done();
    });
  });

  //   add camera in branch
  describe("Post /api/branch/camera/:id", function () {
    it("It should add camera in branch", (done) => {
      let id = "some",
        camera = "0_33f2cd8d-8af5-4d2d-a320-1fbe4d2b4aa3";
      chai
        .request("http://localhost:4000")
        .post("/api/branch/configure-image/" + id)
        .set({ "x-auth-token": `${token}` })
        .send(camera)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
        });
      done();
    });
  });

  //   delete camera in branch
  describe("Delete /api/branch/camera/:id/:c_id", function () {
    it("It should delete camera in branch", (done) => {
      let id = "some",
        camera = "0_33f2cd8d-8af5-4d2d-a320-1fbe4d2b4aa3";
      chai
        .request("http://localhost:4000")
        .delete("/api/branch/camera/" + id + "/" + c_id)
        .set({ "x-auth-token": `${token}` })
        .send(camera)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
        });
      done();
    });
  });

  //   update camera in branch
  describe("POST /api/branch/updatecamera/:id/:c_id", function () {
    it("It should update camera in branch", (done) => {
      let id = "some",
        c_id = "02",
        camera = "0_33f2cd8d-8af5-4d2d-a320-1fbe4d2b4aa3";
      chai
        .request("http://localhost:4000")
        .post("/api/branch/configure-image/" + id + c_id)
        .set({ "x-auth-token": `${token}` })
        .send(camera)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
        });
      done();
    });
  });

  //   update Device in branch
  describe("POST /api/branch/updatedevice/:id/:device_id", function () {
    it("It should update device in branch", (done) => {
      let id = "some",
        device_id = "02",
        camera = "0_33f2cd8d-8af5-4d2d-a320-1fbe4d2b4aa3";
      chai
        .request("http://localhost:4000")
        .post("/api/branch/updatedevice/" + id + device_id)
        .set({ "x-auth-token": `${token}` })
        .send(camera)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
        });
      done();
    });
  });

  //   delete camera in branch
  describe("Delete /api/branch/device/:id/:device_id", function () {
    it("It should delete device in branch", (done) => {
      let id = "some",
        device_id = "",
        camera = "0_33f2cd8d-8af5-4d2d-a320-1fbe4d2b4aa3";
      chai
        .request("http://localhost:4000")
        .delete("/api/branch/device/" + id + "/" + device_id)
        .set({ "x-auth-token": `${token}` })
        .send(camera)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
        });
      done();
    });
  });

  //   get camera in camera with type and cam id
  describe("Get /api/branch/camera/:id/:type", function () {
    it("It should get camera", (done) => {
      let branchId = "some",
        type = "client",
        camera = "first";
      chai
        .request("http://localhost:4000")
        .get(`/api/branch/camera/${branchId}/${type}`)
        .set({ "x-auth-token": `${token}` })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
        });
      done();
    });
  });

  //   get cameraFrame in camera with type and cam id
  describe("Get /api/branch/cameraFrame/:id/:type/:camera", function () {
    it("It should get camera", (done) => {
      let branchId = "some",
        type = "client",
        camera = "first";
      chai
        .request("http://localhost:4000")
        .get(`/api/branch/camera/${branchId}/${type}/${camera}`)
        .set({ "x-auth-token": `${token}` })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
        });
      done();
    });
  });

  //   get cameraName in camera with type and camera
  describe("Get /api/branch/cameraName/:id/:type/:camera", function () {
    it("It should get camera", (done) => {
      let branchId = "some",
        type = "client",
        camera = "first";
      chai
        .request("http://localhost:4000")
        .get(`/api/branch/cameraName/${branchId}/${type}/${camera}`)
        .set({ "x-auth-token": `${token}` })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
        });
      done();
    });
  });

  //   add Device in branch
  describe("Post /api/branch/device/:id", function () {
    it("It should add device in branch", (done) => {
      let id = "some",
        camera = "0_33f2cd8d-8af5-4d2d-a320-1fbe4d2b4aa3";
      chai
        .request("http://localhost:4000")
        .post("/api/branch/device/" + id)
        .set({ "x-auth-token": `${token}` })
        .send(camera)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
        });
      done();
    });
  });

  //   get Device in branch
  describe("Get /api/branch/device/:id", function () {
    it("It should get device ", (done) => {
      let id = "some",
        camera = "0_33f2cd8d-8af5-4d2d-a320-1fbe4d2b4aa3";
      chai
        .request("http://localhost:4000")
        .get("/api/branch/device/" + id)
        .set({ "x-auth-token": `${token}` })
        .send(camera)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
        });
      done();
    });
  });

  //   add camera in branch
  describe("Post /api/branch/allcamera/:id/:type", function () {
    it("It should get allcamera in branch", (done) => {
      let id = "some",
        type = "client",
        camera = "0_33f2cd8d-8af5-4d2d-a320-1fbe4d2b4aa3";
      chai
        .request("http://localhost:4000")
        .post("/api/branch/allcamera/" + id + type)
        .set({ "x-auth-token": `${token}` })
        .send(camera)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
        });
      done();
    });
  });

  //   get camera in branch
  describe("Get /api/branch/getcamera/:id", function () {
    it("It should get allcamera in branch", (done) => {
      let id = "some",
        type = "client",
        camera = "0_33f2cd8d-8af5-4d2d-a320-1fbe4d2b4aa3";
      chai
        .request("http://localhost:4000")
        .post("/api/branch/getcamera/" + id)
        .set({ "x-auth-token": `${token}` })
        .send(camera)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
        });
      done();
    });
  });

  //   put mac-address in branch
  describe("Put /api/branch/mac-address", function () {
    it("It should update mac-address in branch", (done) => {
      let branchId = "some",
        Mac_address = "client";
      chai
        .request("http://localhost:4000")
        .put("/api/branch/mac-address")
        .set({ "x-auth-token": `${token}` })
        .send({ Mac_address, branchId })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
        });
      done();
    });
  });
});
