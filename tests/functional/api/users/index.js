import chai from "chai";
import request from "supertest";
const mongoose = require("mongoose");
import User from "../../../../api/users/userModel";
import api from "../../../../index";

const expect = chai.expect;
let db;
let user1token;

describe("Users endpoint", () => {
  before(() => {
    mongoose.connect(process.env.MONGO_DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = mongoose.connection;
  });

  after(async () => {
    try {
      await db.dropDatabase();
    } catch (error) {
      console.log(error);
    }
  });
  beforeEach(async () => {
    try {
      await User.deleteMany();
      // Register two users
      await request(api).post("/api/users?action=register").send({
        username: "user1",
        password: "Test123*",
        favourites: 
        [
          436270,
          64690
        ]
      });
      await request(api).post("/api/users?action=register").send({
        username: "user2",
        password: "Test123*",
        favourites: 
        [
          988233
        ]
      });
    } catch (err) {
      console.error(`failed to Load user test Data: ${err}`);
    }
  });
  afterEach(() => {
    api.close();
  });
  describe("GET /api/users ", () => {
    it("should return the 2 users and a status 200", (done) => {
      request(api)
        .get("/api/users")
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          expect(res.body).to.be.a("array");
          expect(res.body.length).to.equal(2);
          let result = res.body.map((user) => user.username);
          expect(result).to.have.members(["user1", "user2"]);
          done();
        });
    });
  });

  describe("POST /api/users ", () => {
    describe("For a register action", () => {
      describe("when the payload is correct", () => {
        it("should return a 201 status and the confirmation message", () => {
          return request(api)
            .post("/api/users?action=register")
            .send({
              username: "user3",
              password: "Test123*",
            })
            .expect(201)
            .expect({ msg: "Successful created new user.", code: 201 });
        });
        after(() => {
          return request(api)
            .get("/api/users")
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200)
            .then((res) => {
              expect(res.body.length).to.equal(3);
              const result = res.body.map((user) => user.username);
              expect(result).to.have.members(["user1", "user2", "user3"]);
            });
        });
      });
      describe("when the password is not valid", () => {
        it("should return a 401 status and the error message", () => {
          return request(api)
            .post("/api/users?action=register")
            .send({
              username: "user3",
              password: "badpass",
            })
            .expect(401)
            .expect({code: 401,msg: 'Registration failed. Bad password'});
        });
      });
    });
    describe("For an authenticate action", () => {
      describe("when the payload is correct", () => {
        it("should return a 200 status and a generated token", () => {
          return request(api)
            .post("/api/users?action=authenticate")
            .send({
              username: "user1",
              password: "Test123*",
            })
            .expect(200)
            .then((res) => {
              expect(res.body.success).to.be.true;
              expect(res.body.token).to.not.be.undefined;
              user1token = res.body.token.substring(7);
            });
        });
      });
      describe("when the username does not exist", () => {
        it("should return a 401 status and an error message", () => {
          return request(api)
            .post("/api/users?action=authenticate")
            .send({
              username: "user7",
              password: "Test123*",
            })
            .expect(401)
            .expect({ code: 401, msg: 'Authentication failed. User not found.' })
        });
      });
      describe("when the password is incorrect", () => {
        it("should return a 401 status and an error message", () => {
          return request(api)
            .post("/api/users?action=authenticate")
            .send({
              username: "user1",
              password: "WrongPassword",
            })
            .expect(401)
            .expect({code: 401,msg: 'Authentication failed. Wrong password.'})
        });
      });
      describe("when no username or password are passed", () => {
        it("should return a 401 status and an error message", () => {
          return request(api)
            .post("/api/users?action=authenticate")
            .send({
              falseInfo: "falseInfo"
            })
            .expect(401)
            .expect({success: false, msg: 'Please pass username and password.'})
        });
      });
    });
    describe("GET /api/users/:userName/favourites", () => {
      it("should return user1's favourites and status 200", (done) => {
        request(api)
        .get("/api/users/user1/favourites")
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          expect(res.body).to.be.a("array");
          expect(res.body).to.include(64690)
          done();
        });
      });
    });
    describe("GET /api/users/:userName/favourites", () => {
      it("should return user1's favourites and status 200", (done) => {
        request(api)
        .get("/api/users/user1/favourites")
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          expect(res.body).to.be.a("array");
          expect(res.body).to.include(64690)
          done();
        });
      });
    });
    describe("POST /api/users/:userName/favourites", () => {
      it("should add a movie id to user2's favourites and status 201", () => {
        return request(api)
        .post("/api/users/user2/favourites")
        .send({movie: 64690})
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(201)
        .expect({ msg: "Favourite added Sucessfully", code: 201 });
      });
      after(() => {
        return request(api)
          .get("/api/users/user2/favourites")
          .set("Accept", "application/json")
          .expect("Content-Type", /json/)
          .expect(200)
          .then((res) => {
            expect(res.body.length).to.equal(2);
            expect(res.body).to.include(64690);
          });
      });
    });
    describe("POST /api/users/:userName/movie/:id/favourites", () => {
      it("should remove a movie id from user1's favourites and status 201", () => {
        return request(api)
        .post("/api/users/user1/movie/64690/favourites")
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(201)
        .expect({ msg: "Favourite deleted Sucessfully", code: 201 });
      });
      after(() => {
        return request(api)
          .get("/api/users/user1/favourites")
          .set("Accept", "application/json")
          .expect("Content-Type", /json/)
          .expect(200)
          .then((res) => {
            expect(res.body.length).to.equal(1);
            expect(res.body).to.include(436270);
          });
      });
    })
  });
  });

