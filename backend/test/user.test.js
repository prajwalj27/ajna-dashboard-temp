let chai = require("chai");
let chaiHttp = require("chai-http");
let app = require("../server").default;
var assert = require("assert");
let should = chai.should();
chai.should();
chai.use(chaiHttp);
const server = "http://localhost:4000";
describe("Users API", function () {
  // 1.Test the Get all users
  describe("Get /api/users", function () {
    it("It should get all the users", (done) => {
      chai
        .request("http://localhost:4000")
        .get("/api/users")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          done();
        });
    });
    it("It should not get all the client", (done) => {
      chai
        .request("http://localhost:4000")
        .get("/api/client")
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
  });
  // 2.Test the Get users by clientId
  describe("Get /api/users/:id", function () {
    // it("It should get client by clientId", (done) => {
    const clientId = "faefffbf-9220-404e-9bde-b32ee149f958";
    let token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNWY1MDk0MDliN2UxNzIwNzczYTgxMGNhIn0sImlhdCI6MTYwNzUwOTQ2OSwiZXhwIjoxNjA3NTk1ODY5fQ.gfnlx4SBdGVVWyPqSqztcLjFOjuEynbgynagxNCARwU";
    chai
      .request("http://localhost:4000")
      .get("/api/users/" + clientId)
      .set({ "x-auth-token": `${token}` })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("clientId");
        res.body.should.have
          .property("clientId")
          .eq("faefffbf-9220-404e-9bde-b32ee149f958");
        done();
      });

    it("It should not get client by clientId", (done) => {
      const clientId = "ABC1";
      let token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNWZkMWY3ZDMxODc3ODcwZGQzMzM0NWYwIiwidXNlclR5cGUiOiJjbGllbnQifSwiaWF0IjoxNjA3NTk3ODExLCJleHAiOjE2MDc2ODQyMTF9.i75ynbbCd99zeZGBY2lvSgItj0nOB-pgFqEBHIGUmGI";
      chai
        .request("http://localhost:4000")
        .get("/api/users/" + clientId)
        .set({ "x-auth-token": `${token}` })
        .end((err, res) => {
          res.should.have.status(404);
          res.text.should.be.eq(
            "The client with the provided ID does not exist."
          );
          done();
        });
    });
  });
  // 3.Test the Get user by employeeId
  describe("Get /api/users/me/:id", function () {
    // it("It should get client by employeeId", (done) => {
    const clientId = "faefffbf-9220-404e-9bde-b32ee149f958";
    let token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNWY1MDk0MDliN2UxNzIwNzczYTgxMGNhIn0sImlhdCI6MTYwNzUwOTQ2OSwiZXhwIjoxNjA3NTk1ODY5fQ.gfnlx4SBdGVVWyPqSqztcLjFOjuEynbgynagxNCARwU";
    chai
      .request("http://localhost:4000")
      .get("/api/users/me/" + clientId)
      .set({ "x-auth-token": `${token}` })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        done();
      });
  });

  // 3.Test the POST route
  describe("POST /api/users", function () {
    //   cannot post all the time with same clientId so error occur ...working fine
    it("It should post new user", async (done) => {
      const user = {
        name: "rajni",
        email: "rajni@ajna.ai",
        password: "123456",
        userType: "user",
        EmployeeId: "abcd",
        clientId: "abcd",
        editAccess: [],
        notifications: [],
        branches: [],
        alertConfig: {},
        modules: [],
        camera: [],
      };
      chai
        .request("http://localhost:4000")
        .post("/api/users")
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
        });
      done();
    });
    it("It should not post as employeeId doesn't exist", async (done) => {
      const user = {
        name: "rajni",
        email: "rajni@ajna.ai",
        password: "123456",
        userType: "user",
        EmployeeId: "abcd",
        clientId: "abcd",
        editAccess: [],
        notifications: [],
        branches: [],
        alertConfig: {},
        modules: [],
        camera: [],
      };
      chai
        .request(server)
        .post("/api/users")
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
        });
      done();
    });
  });

  // 4.DELETE Test the DELETE route
  describe("DELETE /api/users/:id", () => {
    it("It should DELETE an existing user", async (done) => {
      const employeeId = "abcd";
      chai
        .request(server)
        .delete("/api/users/" + employeeId)
        .end((err, response) => {
          response.should.have.status(200);
        });
      done();
    });
    it("It should NOT DELETE a user that is not in the database", (done) => {
      const employeeId = "abc";
      chai
        .request(server)
        .delete("/api/users/" + employeeId)
        .end((err, response) => {
          response.should.have.status(404);
          response.text.should.be.eq(
            "The Employee with the provided ID does not exist."
          );
        });
      done();
    });
  });

  // 5. Change Password
  describe("PUT /api/users/:id", () => {
    it("It should PUT an existing Client Password", async (done) => {
      const clientId = "ABCD";
      const data = {
        password: "123456",
        newpassword: "1234567",
      };
      chai
        .request(server)
        .put("/api/users/" + clientId)
        .send(data)
        .end(async (err, response) => {
          response.should.have.status(200);
          response.body.should.be.a("object");
        });
      done();
    });

    it("It should NOT PUT an existing task with a name without password and new pawword", async (done) => {
      const clientId = "Rajni01";
      const data = {
        // password: "Ta",
        newpassword: true,
      };
      chai
        .request(server)
        .put("/api/users/" + clientId)
        .send(data)
        .end((err, response) => {
          response.should.have.status(400);
        });
      done();
    });
  });
});
