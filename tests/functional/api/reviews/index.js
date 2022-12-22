import chai from "chai";
import request from "supertest";
const mongoose = require("mongoose");
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

  beforeEach(async () => {
    try {
      await Review.deleteMany();
      // Create three reviews
      await request(api).post("/api/revies/user1/movie/436270/reviews").send({
        content: 'I like this movie',
        rating: 4,
      });
      await request(api).post("/api/revies/user2/movie/436270/reviews").send({
        content: 'I dont like this movie',
        rating: 1,
      });
      await request(api).post("/api/revies/user1/movie/988233/reviews").send({
        content: 'I love this movie',
        rating: 5,
      });
    } catch (err) {
      console.error(`failed to Load review test Data: ${err}`);
    }
  });

  after(async () => {
    try {
      await db.dropDatabase();
    } catch (error) {
      console.log(error);
    }
  });
  afterEach(() => {
    api.close();
  });
  describe("GET /api/reviews/movie/436270/reviews ", () => {
    it("should return the 2 reviews and a status 200", (done) => {
      request(api)
        .get("/api/reviews/movie/436270/reviews")
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          console.log(res.body)
          expect(res.body).to.be.a("array");
          expect(res.body.length).to.equal(2);
          done();
        });
    });
  });
  describe("GET /api/reviews/movie/436270/reviews ", () => {
    it("should return the 2 reviews and a status 200", (done) => {
      request(api)
        .get("/api/reviews/movie/436270/reviews")
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          console.log(res.body)
          expect(res.body).to.be.a("array");
          expect(res.body.length).to.equal(2);
          done();
        });
    });
  });
});
