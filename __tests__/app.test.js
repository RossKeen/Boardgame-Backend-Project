const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
require("jest-sorted");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});

describe("400: Bad path errors", () => {
  test("400: Should respond with an appropriate error message if the user enters an invalid path", () => {
    return request(app)
      .get("/api/reviews/invalid_path")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad path");
      });
  });
});

describe("/api/categories", () => {
  describe("GET", () => {
    test("200: Should respond with an array of category objects with slug and description properties", () => {
      return request(app)
        .get("/api/categories")
        .expect(200)
        .expect("Content-Type", "application/json; charset=utf-8")
        .then(({ body }) => {
          expect(Array.isArray(body.categories)).toBe(true);
          expect(body.categories.length === 4).toBe(true);
          body.categories.forEach((categoryObject) => {
            expect(categoryObject).toEqual(expect.objectContaining({ slug: expect.any(String), description: expect.any(String) }));
          });
        });
    });
    describe("Error handling", () => {
      test("400: Should respond with an error if the user enters the path incorrectly", () => {
        return request(app)
          .get("/api/categoriez")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Bad path");
          });
      });
    });
  });
});

describe("/api/reviews", () => {
  describe("GET", () => {
    test("200: responds with an array of review objects, sorted by date descending", () => {
      return request(app)
        .get("/api/reviews")
        .expect(200)
        .expect("Content-Type", "application/json; charset=utf-8")
        .then(({ body }) => {
          const reviews = body.reviews;
          expect(Array.isArray(reviews)).toBe(true);
          expect(reviews.length === 13).toBe(true);
          reviews.forEach((review) => {
            expect(review).toEqual(
              expect.objectContaining({
                review_id: expect.any(Number),
                title: expect.any(String),
                review_body: expect.any(String),
                designer: expect.any(String),
                review_img_url: expect.any(String),
                votes: expect.any(Number),
                category: expect.any(String),
                owner: expect.any(String),
                created_at: expect.any(String),
                comment_count: expect.any(Number),
              })
            );
          });
          expect(reviews).toBeSortedBy("created_at", { descending: true });
        });
    });
  });
});

describe("/api/reviews/:review_id", () => {
  describe("GET", () => {
    test("200: responds with a review object with correct properties", () => {
      return request(app)
        .get("/api/reviews/3")
        .expect(200)
        .expect("Content-Type", "application/json; charset=utf-8")
        .then(({ body }) => {
          const review = body.review;
          expect(typeof review).toBe("object");
          expect(review).toEqual(
            expect.objectContaining({
              review_id: 3,
              title: "Ultimate Werewolf",
              review_body: "We couldn't find the werewolf!",
              designer: "Akihisa Okui",
              review_img_url: "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
              votes: 5,
              category: "social deduction",
              owner: "bainesface",
              created_at: expect.any(String),
            })
          );
        });
    });
    describe("Error handling", () => {
      test("404: Should respond with an appropriate message if no review exists with the given ID.", () => {
        return request(app)
          .get("/api/reviews/9999")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("No review exists with that ID");
          });
      });
    });
  });
  describe("PATCH", () => {
    test("200: Should update the votes property of the given review", () => {
      return request(app)
        .patch("/api/reviews/3")
        .send({ inc_votes: 10 })
        .expect(200)
        .expect("Content-Type", "application/json; charset=utf-8")
        .then(({ body }) => {
          const review = body.review;
          expect(typeof review).toBe("object");
          expect(review).toEqual(
            expect.objectContaining({
              review_id: 3,
              title: "Ultimate Werewolf",
              review_body: "We couldn't find the werewolf!",
              designer: "Akihisa Okui",
              review_img_url: "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
              votes: 15,
              category: "social deduction",
              owner: "bainesface",
              created_at: expect.any(String),
            })
          );
        });
    });
    describe("Error handling", () => {
      test("404: Should respond with an appropriate message if no review exists with the given ID", () => {
        return request(app)
          .patch("/api/reviews/9999")
          .send({ inc_votes: 10 })
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("No review exists with that ID");
          });
      });
      test("400: Should respond with an appropriate message if the user sends an invalid request body", () => {
        return request(app)
          .patch("/api/reviews/3")
          .send({ inc_votes: "ten" })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Bad request");
          });
      });
    });
  });
});

describe("/api/users", () => {
  describe("GET", () => {
    test("200: Should respond with an array of all users", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .expect("Content-Type", "application/json; charset=utf-8")
        .then(({ body }) => {
          expect(Array.isArray(body.users)).toBe(true);
          expect(body.users.length === 4).toBe(true);
          body.users.forEach((user) => {
            expect(user).toEqual(expect.objectContaining({ username: expect.any(String), name: expect.any(String), avatar_url: expect.any(String) }));
          });
        });
    });
  });
});
