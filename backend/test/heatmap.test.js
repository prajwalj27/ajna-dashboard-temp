let chai = require("chai");
let chaiHttp = require("chai-http");
let app = require("../server").default;
var assert = require("assert");
const should = require("should");
let expect = chai.expect;
chai.should();
chai.use(chaiHttp);
const server = "http://localhost:4000";
let token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNWZkMWY3ZDMxODc3ODcwZGQzMzM0NWYwIiwidXNlclR5cGUiOiJjbGllbnQifSwiaWF0IjoxNjA3NzU4MDQwLCJleHAiOjE2MDc4NDQ0NDB9.3oWfaPt3yyXLclQCi-jvDEC4DAAOSnnIVSPYppMqb5M";

describe("Heatmap API", function () {
  // 1.Test the POST route to add data
  describe("POST /api/heatmap", () => {
    it("It should add client's heatmap data", (done) => {
      const data = {
        ClientID: "testingclient",
        BranchID: "testingbranch",
        CameraID: "0_33f2cd8d-8af5-4d2d-a320-1fbe4d2b4aa3",
        Coordinates: [
          { x: 144, y: 384, Timestamp: "2020-12-11T19:04:50.305+00:00" },
          { x: 144, y: 384, Timestamp: "2020-12-11T19:04:50.305+00:00" },
          { x: 124, y: 384, Timestamp: "2020-12-11T19:04:50.305+00:00" },
        ],
        Timestamp: "2020-12-11T19:04:50.305+00:00",
      };
      chai
        .request(server)
        .post("/api/heatmap")
        .send(data)
        .end((err, res) => {
          should.exist(res.body);
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.deep
            .property("client")
            .that.includes.all.keys([
              "BranchID",
              "CameraID",
              "ClientID",
              "Coordinates",
              "Timestamp",
              "__v",
              "_id",
            ]);
        });
      done();
    });
  });

  // 2 Test Post that fetch Weekly data
  describe("POST /api/heatmap/dates/:id/:type", () => {
    it("It should fetch client's selected-range heatmap data", (done) => {
      const date = "26/12/2020, 00:00:00",
        start = "",
        end = "",
        camera = "0_33f2cd8d-8af5-4d2d-a320-1fbe4d2b4aa3";
      const branchId = "testbranch",
        type = "client";
      chai
        .request(server)
        .post("/api/heatmap/dates/" + branchId + "/" + type)
        .set({ "x-auth-token": `${token}` })
        .send(date, start, end, camera)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
        });
      done();
    });
  });

  // 3 Test the Post route to get monthly data
  describe("POST /api/heatmap/month/:id/:type", function () {
    it("It should fetch client's month heatmap data", async (done) => {
      const camera = ["cam1"];
      const branchId = "testingbranch",
        type = "client";
      chai
        .request(server)
        .post("/api/heatmap/month/" + branchId + "/" + type)
        .set({ "x-auth-token": `${token}` })
        .send(camera)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
        });
      await done();
    });
  });
});
