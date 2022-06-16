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

describe("Dwelltime Analysis API", function () {
  // 1.Test the POST route to add data
  describe("POST /api/dwell-time-analysis", () => {
    it("It should add client's dwell-time data", (done) => {
      const data = {
        ClientID: "testingclient",
        BranchID: "testingbranch",
        Timestamp: "2020-12-11T09:06:10.000+00:00",
        CameraID: "cam1",
        PersonID: "1",
        TimeSpent: "20",
        Zone: "Third Section",
      };
      chai
        .request(server)
        .post("/api/dwell-time-analysis")
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
              "PersonID",
              "Timestamp",
              "Zone",
              "TimeSpent",
              "__v",
              "_id",
            ]);
        });
      done();
    });
  });
  // 2.Test the POST route to fetch specific branch data
  describe("POST /api/dwell-time-analysis/me/:id", () => {
    it("It should fetch client's today dwell-time data", (done) => {
      const camera = [],
        dates = "[]";
      const branchId = "c19c36d8-2a21-405b-b091-34a6137b8965",
        type = "client";
      chai
        .request(server)
        .post("/api/dwell-time-analysis/me/" + branchId)
        .set({ "x-auth-token": `${token}` })
        .send({ camera, dates })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
        });
      done();
    });
  });

  // 3 Test Post that fetch Weekly data
  describe("POST /api/dwell-time-analysis/weekly/:id/:type", () => {
    it("It should fetch client's weekly dwell-time data", (done) => {
      const camera = [];
      const branchId = "c19c36d8-2a21-405b-b091-34a6137b8965",
        type = "client";
      chai
        .request(server)
        .post("/api/dwell-time-analysis/weekly/" + branchId + "/" + type)
        .set({ "x-auth-token": `${token}` })
        .send(camera)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
        });
      done();
    });
  });
  // 4.Test the POST route to get today data in form of chart
  describe("POST /api/dwell-time-analysis/todayme/:id/:type", () => {
    it("It should fetch client's today's dwell-time data in formatted array", (done) => {
      const camera = [];
      const branchId = "c19c36d8-2a21-405b-b091-34a6137b8965",
        type = "client";
      chai
        .request(server)
        .post("/api/dwell-time-analysis/todayme/" + branchId + "/" + type)
        .send(camera)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
        });
      done();
    });
  });

  // 5 Test the Post route to get today parserby data
  describe("POST /api/dwell-time-analysis/todayparserby/:id/:type", function () {
    it("It should fetch client's today's parsersby dwell-time data", async (done) => {
      const camera = [];
      const branchId = "c19c36d8-2a21-405b-b091-34a6137b8965",
        type = "client";
      chai
        .request(server)
        .post("/api/dwell-time-analysis/todayparserby/" + branchId + "/" + type)
        .send(camera)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
        });
      await done();
    });
  });

  // 5 Test the Post route to get max min and avg data
  describe("POST /api/dwell-time-analysis/maxmin/:id/:type", function () {
    it("It should fetch client's max min and avg dwell-time data", async (done) => {
      const camera = ["cam1"];
      const branchId = "testingbranch",
        type = "client";
      chai
        .request(server)
        .post("/api/dwell-time-analysis/maxmin/" + branchId + "/" + type)
        .send(camera)
        .end((err, res) => {
          // res.should.have.status(200);
          res.body.should.be.a("object");
        });
      await done();
    });

    it("It should not fetch client's max min and avg dwell-time data as branchd doesn't exist", async (done) => {
      const camera = ["cam1"];
      const branchId = "tesbranch",
        type = "client";
      chai
        .request(server)
        .post("/api/dwell-time-analysis/maxmin/" + branchId + "/" + type)
        .send(camera)
        .end((err, res) => {
          res.should.have.status(500);
        });
      await done();
    });
  });
});
