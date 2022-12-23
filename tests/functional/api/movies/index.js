import chai from "chai";
import request from "supertest";
const mongoose = require("mongoose");
import Movie from "../../../../api/movies/movieModel";
import api from "../../../../index";
import movies from "../../../../seedData/movies";

const expect = chai.expect;
let db;

describe("Movies endpoint", () => {
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
      await Movie.deleteMany();
      await Movie.collection.insertMany(movies);
    } catch (err) {
      console.error(`failed to Load user Data: ${err}`);
    }
  });
  afterEach(() => {
    api.close(); // Release PORT 8080
  });
  describe("GET /api/movies/tmdb/discover ", () => {
    it("should return 20 movies and a status 200", () => {
      return request(api)
        .get("/api/movies/tmdb/discover")
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .then((res) => {
          expect(res.body.results).to.be.a("array");
          expect(res.body.results.length).to.equal(20);
        });
    });
  });
  describe("GET /api/movies/tmdb/upcoming ", () => {
    it("should return 20 movies and a status 200", () => {
      return request(api)
        .get("/api/movies/tmdb/upcoming")
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .then((res) => {
          expect(res.body.results).to.be.a("array");
          expect(res.body.results.length).to.equal(20);
        });
    });
  });
  describe("GET /api/movies/tmdb/now-playing ", () => {
    it("should return 20 movies and a status 200", () => {
      return request(api)
        .get("/api/movies/tmdb/now-playing")
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .then((res) => {
          expect(res.body.results).to.be.a("array");
          expect(res.body.results.length).to.equal(20);
        });
    });
  });
  describe("GET /api/movies/tmdb/top-rated ", () => {
    it("should return 20 movies and a status 200", () => {
      return request(api)
        .get("/api/movies/tmdb/top-rated")
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .then((res) => {
          expect(res.body.results).to.be.a("array");
          expect(res.body.results.length).to.equal(20);
        });
    });
  });
  describe("GET /api/movies/tmdb/trending ", () => {
    it("should return 20 movies and a status 200", () => {
      return request(api)
        .get("/api/movies/tmdb/trending")
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .then((res) => {
          expect(res.body.results).to.be.a("array");
          expect(res.body.results.length).to.equal(20);
        });
    });
  });
  describe("GET /api/movies/tmdb/movie/:id", () => {
      it("should return the matching movie", () => {
        return request(api)
          .get(`/api/movies/tmdb/movie/436270`)
          .set("Accept", "application/json")
          .expect("Content-Type", /json/)
          .expect(200)
          .then((res) => {
            expect(res.body).to.have.property("title", "Black Adam");
          });
      });
  });
  describe("GET /api/movies/tmdb/movie/:id/similar", () => {
      it("should return similar movies", () => {
        return request(api)
          .get(`/api/movies/tmdb/movie/436270/similar`)
          .set("Accept", "application/json")
          .expect("Content-Type", /json/)
          .expect(200)
          .then((res) => {
            expect(res.body.results).to.be.a("array");
            expect(res.body.results.length).to.equal(20);
          });
    });
  });
    describe("GET /api/movies/tmdb/movie/:id/recommended", () => {
      it("should return recommended movies", () => {
        return request(api)
          .get(`/api/movies/tmdb/movie/436270/recommended`)
          .set("Accept", "application/json")
          .expect("Content-Type", /json/)
          .expect(200)
          .then((res) => {
            expect(res.body.results).to.be.a("array");
            expect(res.body.results.length).to.equal(21);
          });
      });
    });
    describe("GET /api/movies/tmdb/movie/:id/credits", () => {
      it("should return the list of actors assosiated with a movie", () => {
        return request(api)
          .get(`/api/movies/tmdb/movie/436270/credits`)
          .set("Accept", "application/json")
          .expect("Content-Type", /json/)
          .expect(200)
          .then((res) => {
            expect(res.body.cast[0]).to.have.property("name", "Dwayne Johnson");
          });
      });
  });
  });

