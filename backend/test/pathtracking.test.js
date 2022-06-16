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
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNWZkMWY3ZDMxODc3ODcwZGQzMzM0NWYwIiwidXNlclR5cGUiOiJjbGllbnQifSwiaWF0IjoxNjA3NjY0MDYxLCJleHAiOjE2MDc3NTA0NjF9.NOoJ2JJ6S6KrCCY3qPbu7D4F-5O5ZN45ppbZjxEueiY";

describe("Path Tracking API", function () {
  // 1.Test the POST route to add data
  describe("POST /api/path-tracking", () => {
    it("It should add client's path-tracking data", (done) => {
      const data = {
        ClientID: "testingclient",
        BranchID: "testingbranch",
        Timestamp: "2020-12-11T09:06:10.000+00:00",
        CameraID: "0_33f2cd8d-8af5-4d2d-a320-1fbe4d2b4aa3",
        zone: "top",
        PersonTimestamps: [
          "2020-12-11T09:06:10.000+00:00",
          "2020-12-11T09:06:10.000+00:00",
          "2020-11-16T09:06:10.000+00:00",
          "2020-12-11T09:06:10.000+00:00",
        ],
      };
      chai
        .request(server)
        .post("/api/path-tracking")
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
              "PersonTimestamps",
              "Timestamp",
              "__v",
              "_id",
              "zone",
            ]);
        });
      done();
    });
  });

  // 2 Test Post that fetch Weekly data
  describe("POST /api/path-tracking/dates/:id/:type", () => {
    it("It should fetch client's selected-range path-tracking data", (done) => {
      const date = "26/12/2020, 00:00:00",
        start = "",
        end = "",
        camera = "0_33f2cd8d-8af5-4d2d-a320-1fbe4d2b4aa3";
      const branchId = "c19c36d8-2a21-405b-b091-34a6137b8965",
        type = "client";
      chai
        .request(server)
        .post("/api/path-tracking/dates/" + branchId + "/" + type)
        .set({ "x-auth-token": `${token}` })
        .send({ date, start, end, camera })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
        });
      done();
    });
  });

  // 3 Test the Post route to get monthly data
  describe("POST /api/path-tracking/month/:id/:type", function () {
    it("It should fetch client's month path-tracking data", async (done) => {
      const camera = ["cam1"];
      const branchId = "testingbranch",
        type = "client";
      chai
        .request(server)
        .post("/api/path-tracking/month/" + branchId + "/" + type)
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
