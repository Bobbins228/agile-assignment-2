import chai from "chai";
import request from "supertest";
const mongoose = require("mongoose");
import Movie from "../../../../api/movies/movieModel";
import api from "../../../../index";
import movies from "../../../../seedData/movies";

const expect = chai.expect;
let db;

describe("Genres endpoint", () => {
  before(() => {
  });

  after(async () => {
  
  });

  beforeEach(async () => {
  
  });
  afterEach(() => {
    api.close(); // Release PORT 8080
  });
  describe("GET /api/genres ", () => {
    it("should return 19 genres and a status 200", (done) => {
      request(api)
        .get("/api/genres")
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          expect(res.body.genres).to.be.a("array");
          expect(res.body.genres.length).to.equal(19);
          done();
        });
    });
  });
});