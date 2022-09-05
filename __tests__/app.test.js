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
    test("200: Should respond with an array of category objects with slug and description properties", () => {
      return request(app)
        .get("/api/categories")
        .expect(200)
        .expect("Content-Type", "application/json; charset=utf-8")
        .then(({ body }) => {
          expect(Array.isArray(body)).toBe(true);
          expect(body.length > 0).toBe(true);
          body.forEach((categoryObject) => {
            expect(categoryObject).toHaveProperty("slug");
            expect(categoryObject).toHaveProperty("description");
          });
        });
    });
    test("404: Should respond with an error if the user enters the error incorrectly", () => {
      return request(app)
        .get("/api/categoriez")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Not found");
        });
    });
  });
});
