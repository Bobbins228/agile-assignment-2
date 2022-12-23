import chai from "chai";
import request from "supertest";
const mongoose = require("mongoose");
import Review from "../../../../api/reviews/reviewModel";
import api from "../../../../index";
import reviews from "../../../../seedData/reviews"
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
      await Review.collection.insertMany(reviews);
    } catch (err) {
      console.error(`failed to Load show Data: ${err}`);
    }
  });
  afterEach(() => {
    api.close();
  });
  describe("GET /api/reviews/movie/:id/reviews ", () => {
    it("should return 2 reviews for Black Adam and a status 200", (done) => {
      request(api)
        .get("/api/reviews/movie/436270/reviews")
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(201)
        .end((err, res) => {
          expect(res.body).to.be.a("array");
          expect(res.body.length).to.equal(2);
          expect(res.body[0].author).to.equal('user1');
          expect(res.body[1].author).to.equal('user2');
          done();
        });
    });
  });
  describe("POST /api/reviews/:username/movie/:id/reviews ", () => {
    it("should update the review for Black Adam made by user1 and return status 200", () => {
      return request(api)
        .post("/api/reviews/user1/movie/436270/reviews")
        .send({
            content: 'I  hate this movie now',
            rating: 1,
          })
        .expect(200)
        .expect({ msg: "Review Updated Sucessfully", code: 200 });
    });
    after(() => {
      return request(api)
        .get("/api/reviews/movie/436270/reviews")
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .then((res) => {
          expect(res.body.length).to.equal(2);
          expect(res.body[0].author).to.equal('user1');
          expect(res.body[0].content).to.equal('I  hate this movie now');
        });
    });
  });
    describe("POST /api/reviews/:username/movie/:id/reviews ", () => {
      it("should add a review for Drive(2011) made by user2 and return status 201", () => {
        return request(api)
          .post("/api/reviews/user2/movie/64690/reviews")
          .send({
              movieId: 64690,
              author: 'user2',
              content: 'I drive',
              rating: 5
            })
          .expect(201)
          .expect({ msg: "Review Created Sucessfully", code: 201 });
      });
      after(() => {
        return request(api)
          .get("/api/reviews/movie/64690/reviews")
          .set("Accept", "application/json")
          .expect("Content-Type", /json/)
          .expect(200)
          .then((res) => {
            expect(res.body.length).to.equal(1);
            expect(res.body[0].author).to.equal('user2');
            expect(res.body[0].content).to.equal('I drive');
          });
      });
});
});
