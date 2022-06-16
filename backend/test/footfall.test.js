let chai = require("chai");
let chaiHttp = require("chai-http");
let app = require("../server").default;
var assert = require("assert");
let should = chai.should();
var expect = chai.expect;
chai.use(chaiHttp);
const server = "http://localhost:4000";
let token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNWZkMWY3ZDMxODc3ODcwZGQzMzM0NWYwIiwidXNlclR5cGUiOiJjbGllbnQifSwiaWF0IjoxNjA3NzU4MDQwLCJleHAiOjE2MDc4NDQ0NDB9.3oWfaPt3yyXLclQCi-jvDEC4DAAOSnnIVSPYppMqb5M";

describe("Footfall Analysis API", function () {
  // 1.Test the POST route
  describe("POST /api/footfall-analysis", function () {
    it("It should add client's footfall data", async (done) => {
      const data = {
        ClientID: "testingclient",
        BranchID: "testingbranch",
        Total_Person_Count: 10,
        Current_Person_Count: 2,
        Timestamp: "2020-12-10T09:06:10.000+00:00",
        CameraID: "cam1",
        Zone: "Womens Section",
        PercentValue: "14",
        Density: "HIGH",
      };
      chai
        .request(server)
        .post("/api/footfall-analysis")
        .send(data)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.deep
            .property("client")
            .that.includes.all.keys([
              "ClientID",
              "BranchID",
              "CameraID",
              "Current_Person_Count",
              "Density",
              "PercentValue",
              "PercentValue",
              "Total_Person_Count",
              "Zone",
            ]);
        });
      done();
    });
  });
  // 2.Test the POST route
  describe("GET /api/footfall-analysis/metoday/:id/:type", () => {
    it("It should fetch client's today footfall data", async (done) => {
      const camera = ["0_33f2cd8d-8af5-4d2d-a320-1fbe4d2b4aa3"];
      const branchId = "testingbranch",
        type = "client";
      chai
        .request(server)
        .get(`/api/footfall-analysis/metoday/${branchId}/${type}`)
        .send(camera)
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.body).to.be.an("array");
        });

      done();
    });
  });

  // 2.Test the GET route
  describe("GET /api/footfall-analysis/all/:id/:type", () => {
    it("It should fetch client's all footfall data", async (done) => {
      const camera = ["0_33f2cd8d-8af5-4d2d-a320-1fbe4d2b4aa3"];
      const branchId = "testingbranch",
        type = "client",
        dates = "[]";
      chai
        .request(server)
        .get(`/api/footfall-analysis/all/${branchId}/${type}`)
        .send({ camera, dates })
        .end((err, res) => {
          let members = [];
          res.body.forEach(function (e) {
            members = Object.keys(e);
          });
          expect(members).to.have.members([
            "ClientID",
            "BranchID",
            "CameraID",
            "Current_Person_Count",
            "Total_Person_Count",
            "Timestamp",
            "Zone",
            "PercentValue",
            "Density",
            "__v",
            "_id",
          ]);
          res.should.have.status(200);
          res.body.should.be.a("array");
        });
      done();
    });
  });

  // 4.Test the DELETE route
  describe("DELETE /api/footfall-analysis/:id", () => {
    // it("It should DELETE a footfall object", async (done) => {
    //   const id = "5fd267ac85e4ed17986d210c";
    //   chai
    //     .request(server)
    //     .delete("/api/footfall-analysis/" + id)
    //     .end((err, response) => {
    //       response.should.have.status(200);
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //     });
    //   await done();
    // });
  });

  describe("GET /api/footfall-analysis/weekly/:id/:type", function () {
    it("It should fetch client's weekly footfall data", async (done) => {
      const camera = ["0_33f2cd8d-8af5-4d2d-a320-1fbe4d2b4aa3"],
        branchId = "testingbranch",
        type = "client";
      chai
        .request(server)
        .get("/api/footfall-analysis/weekly/" + branchId + "/" + type)
        .set({ "x-auth-token": `${token}` })
        .send(camera)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
        });
      done();
    });
  });

  describe("GET /api/footfall-analysis/today/:id/:type", function () {
    it("It should fetch client's today footfall data", async (done) => {
      const camera = [],
        branchId = "c19c36d8-2a21-405b-b091-34a6137b8965",
        type = "client";
      chai
        .request(server)
        .get("/api/footfall-analysis/today/" + branchId + "/" + type)
        .set({ "x-auth-token": `${token}` })
        .send(camera)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
        });
      done();
    });
  });

  describe("POST /api/footfall-analysis/dates/:id/:type", function () {
    it("It should fetch client's range-wise footfall data", async (done) => {
      const camera = [],
        dateObj = ["2020-11-30T19:26:08.482Z", "2020-12-08T19:26:08.482Z"],
        branchId = "c19c36d8-2a21-405b-b091-34a6137b8965",
        type = "client";
      chai
        .request(server)
        .post("/api/footfall-analysis/dates/" + branchId + "/" + type)
        .set({ "x-auth-token": `${token}` })
        .send({ camera, dateObj })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
        });
      done();
    });
  });
});
