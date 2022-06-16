let chai = require("chai");
let chaiHttp = require("chai-http");
let app = require("../server").default;
var assert = require("assert");
let should = chai.should();
let token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbiI6eyJpZCI6IjVmZDdhMjcwOWRmYTdlMTYxNGFlMjAwNyIsInVzZXJUeXBlIjoiYWRtaW4ifSwiaWF0IjoxNjA3OTY3MzQ1LCJleHAiOjE2MDgwNTM3NDV9.e1ZScrUXU_uK-JxbuqyF9WchCkTs9L_x6i0MSgPWtZA";

chai.should();
chai.use(chaiHttp);

const server = "http://localhost:4000";
describe("ADMIN API", function () {
  // 1.Test Get all admin
  describe("Get /api/admin", function () {
    it("It should get all the Admin", (done) => {
      chai
        .request("http://localhost:4000")
        .get("/api/admin")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
        });
      done();
    });
    it("It should not get all the Admin", (done) => {
      chai
        .request("http://localhost:4000")
        .get("/api/admins")
        .end((err, res) => {
          res.should.have.status(404);
        });
      done();
    });
  });

  // 2.Test the POST route
  describe("POST /api/admin", function () {
    //   cannot post all the time with same clientId so error occur ...working fine
    it("It should post new admin", async (done) => {
      const client = {
        name: "newadmin",
        email: "newadmin@gmail.com",
        password: "123456",
        userType: "admin",
      };
      chai
        .request("http://localhost:4000")
        .post("/api/admin")
        .send(client)
        .end((err, res) => {
          res.should.have.status(200);
        });
      done();
    });

    it("It should not post as admin already exist", async (done) => {
      const client = {
        name: "newadmin",
        email: "newadmin@gmail.com",
        password: "123456",
        userType: "admin",
      };
      chai
        .request(server)
        .post("/api/admin")
        .send(client)
        .end((err, res) => {
          res.should.have.status(400);
        });
      done();
    });
  });

  // 3.DELETE Test the DELETE route
  describe("DELETE /api/admin/:email", () => {
    it("It should DELETE an existing admin", async (done) => {
      const email = "newadmin@gmail.com";
      chai
        .request(server)
        .delete("/api/admin/" + email)
        .set({ "x-auth-token": `${token}` })
        .end((err, response) => {
          response.should.have.status(200);
        });
      done();
    });
    it("It should NOT DELETE a client that is not in the database", (done) => {
      const email = "nadmin@gmail.com";
      chai
        .request(server)
        .delete("/api/admin/" + email)
        .set({ "x-auth-token": `${token}` })
        .end((err, response) => {
          response.should.have.status(404);
          response.text.should.be.eq(
            "Admin with the provided Mail does not exist."
          );
        });
      done();
    });
  });
});
