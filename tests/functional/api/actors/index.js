import chai from "chai";
import request from "supertest";
import api from "../../../../index";

const expect = chai.expect;
let db;

describe("Actors endpoint", () => {
  afterEach(() => {
    api.close(); // Release PORT 8080
  });
  describe("GET /api/actors/tmdb/popular ", () => {
    it("should return 20 actors and a status 200", (done) => {
      request(api)
        .get("/api/actors/tmdb/popular")
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          expect(res.body.results).to.be.a("array");
          expect(res.body.results.length).to.equal(20);
          done();
        });
    });
  });
  describe("GET /api/actors/tmdb/trending ", () => {
    it("should return 20 trending actors and a status 200", (done) => {
      request(api)
        .get("/api/actors/tmdb/trending")
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          expect(res.body.results).to.be.a("array");
          expect(res.body.results.length).to.equal(20);
          done();
        });
    });
  });
  describe("GET /api/actors/tmdb/actor/:id ", () => {
    it("should return the actor Jason Statham and a status 200", (done) => {
      request(api)
        .get("/api/actors/tmdb/actor/976")
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
            expect(res.body).to.have.property("name", "Jason Statham");
          done();
        });
    });
  });
  describe("GET /api/actors/tmdb/actor/:id/movie-credits ", () => {
    it("should return movies Jason Statham has a credit in and a status 200", (done) => {
      request(api)
        .get("/api/actors/tmdb/actor/976/movie-credits")
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          expect(res.body.cast).to.be.a("array");
          expect(res.body.cast[0]).to.have.property("original_title", "Snatch");
          done();
        });
    });
  });
});

