const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});

describe("/api/categories", () => {
  describe("GET", () => {
    test("Should respond with an array of category objects with slug and description properties", () => {
      return request(app)
        .get("/api/categories")
        .expect(200)
        .expect("Content-Type", "application/json; charset=utf-8")
        .then((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length > 0).toBe(true);
          res.body.forEach((categoryObject) => {
            expect(categoryObject).toHaveProperty("slug");
            expect(categoryObject).toHaveProperty("description");
          });
        });
    });
  });
});
