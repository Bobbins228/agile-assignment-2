import chai from "chai";
import request from "supertest";
const mongoose = require("mongoose");
import User from "../../../../api/users/userModel";
import Review from "../../../../api/reviews/reviewModel";
import api from "../../../../index";

const expect = chai.expect;
let db;
let user1token;

describe("Reviews endpoint", () => {
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
      await Review.deleteMany();
      // Create two reviews
      await request(api).post("/user1/movie/436270/reviews").send({
        content: 'I like this movie',
        rating: 4,
      });
      await request(api).post("/user2/movie/436270/reviews").send({
        content: 'I dont like this movie',
        rating: 1,
      });
      await request(api).post("/user1/movie/988233/reviews").send({
        content: 'I love this movie',
        rating: 5,
      });
    } catch (err) {
      console.error(`failed to Load review test Data: ${err}`);
    }
  });
  afterEach(() => {
    api.close();
  });
  describe("GET /api/reviews/movie/436270/reviews ", () => {
    it("should return 2 reviews for Black Adam and a status 200", (done) => {
      request(api)
        .get("/api/reviews/movie/436270/reviews")
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(201)
        .end((err, res) => {
          expect(res.body).to.be.a("array");
          //expect(res.body.length).to.equal(2);
          expect(res.body[0].author).to.equal('user1');
          expect(res.body[1].author).to.equal('user2');
          done();
        });
    });
  });

  describe("POST /api/reviews/user1/movie/436270/reviews ", () => {
    it("should update the review for Black Adam made by user2 and return status 200", () => {
      request(api)
        .post("/api/reviews/user2/movie/436270/reviews")
        .send({
            content: 'I  like this movie now',
            rating: 5,
          })
        .expect(201)
        .expect((res) => {
            expect(res.body.author).to.equal("user2");
            expect(res.body.rating).to.equal(5);
          });
          after(() => {
            return request(api)
              .get("api/reviews/movie/436270/reviews")
              .set("Accept", "application/json")
              .expect("Content-Type", /json/)
              .expect(200)
              .then((res) => {
                expect(res.body.length).to.equal(2);
            });
        });
    });
});
});
/*
  describe("POST /api/users ", () => {
    describe("For a register action", () => {
      describe("when the payload is correct", () => {
        it("should return a 201 status and the confirmation message", () => {
          return request(api)
            .post("/api/users?action=register")
            .send({
              username: "user3",
              password: "test3",
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
    });
    describe("For an authenticate action", () => {
      describe("when the payload is correct", () => {
        it("should return a 200 status and a generated token", () => {
          return request(api)
            .post("/api/users?action=authenticate")
            .send({
              username: "user1",
              password: "test1",
            })
            .expect(200)
            .then((res) => {
              expect(res.body.success).to.be.true;
              expect(res.body.token).to.not.be.undefined;
              user1token = res.body.token.substring(7);
            });
        });
      });
    });
  });
  */
