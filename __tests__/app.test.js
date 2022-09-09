const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const { response } = require("../app");
const e = require("express");
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
          const { reviews } = body;
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
    describe("Queries", () => {
      test("200: accepts a category query which responds with only those reviews which have the category", () => {
        return request(app)
          .get("/api/reviews?category=social+deduction")
          .expect(200)
          .expect("Content-Type", "application/json; charset=utf-8")
          .then(({ body }) => {
            const { reviews } = body;
            expect(reviews.length).toBe(11);
            reviews.forEach((review) => {
              expect(review).toEqual(
                expect.objectContaining({
                  review_id: expect.any(Number),
                  title: expect.any(String),
                  review_body: expect.any(String),
                  designer: expect.any(String),
                  review_img_url: expect.any(String),
                  votes: expect.any(Number),
                  category: "social deduction",
                  owner: expect.any(String),
                  created_at: expect.any(String),
                  comment_count: expect.any(Number),
                })
              );
            });
            expect(reviews).toBeSortedBy("created_at", { descending: true });
          });
      });
      test("200: responds with an empty array if there are no reviews with the queried category", () => {
        return request(app)
          .get("/api/reviews?category=children's+games")
          .expect(200)
          .then(({ body }) => {
            const { reviews } = body;
            expect(reviews).toEqual([]);
          });
      });
      test("200: can be queried with order to choose ascending order", () => {
        return request(app)
          .get("/api/reviews?order=asc")
          .expect(200)
          .expect("Content-Type", "application/json; charset=utf-8")
          .then(({ body }) => {
            const { reviews } = body;
            expect(Array.isArray(reviews)).toBe(true);
            expect(reviews.length).toBe(13);
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
            expect(reviews).toBeSortedBy("created_at", { descending: false });
          });
      });
      test("200: can be queried with order to choose descending order", () => {
        return request(app)
          .get("/api/reviews?order=desc")
          .expect(200)
          .expect("Content-Type", "application/json; charset=utf-8")
          .then(({ body }) => {
            const { reviews } = body;
            expect(Array.isArray(reviews)).toBe(true);
            expect(reviews.length).toBe(13);
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
      test("200: can be queried to sort_by any valid column (defaults to date)", () => {
        return request(app)
          .get("/api/reviews?sort_by=votes")
          .expect(200)
          .expect("Content-Type", "application/json; charset=utf-8")
          .then(({ body }) => {
            const { reviews } = body;
            expect(Array.isArray(reviews)).toBe(true);
            expect(reviews.length).toBe(13);
            expect(reviews).toBeSortedBy("votes", { descending: true });
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
          });
      });
      test("200: can respond when multiple queries are used", () => {
        return request(app)
          .get("/api/reviews?category=social+deduction&order=asc&sort_by=votes")
          .expect(200)
          .expect("Content-Type", "application/json; charset=utf-8")
          .then(({ body }) => {
            const { reviews } = body;
            expect(Array.isArray(reviews)).toBe(true);
            expect(reviews.length).toBe(11);
            expect(reviews).toBeSortedBy("votes");
            reviews.forEach((review) => {
              expect(review).toEqual(
                expect.objectContaining({
                  review_id: expect.any(Number),
                  title: expect.any(String),
                  review_body: expect.any(String),
                  designer: expect.any(String),
                  review_img_url: expect.any(String),
                  votes: expect.any(Number),
                  category: "social deduction",
                  owner: expect.any(String),
                  created_at: expect.any(String),
                  comment_count: expect.any(Number),
                })
              );
            });
          });
      });
      describe("Error Handling", () => {
        test("400: responds with an error when an invalid category query is entered", () => {
          return request(app)
            .get("/api/reviews?category=social+deduction;+DROP+TABLE+reviews;")
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).toBe("Invalid category query");
            });
        });
        test("400: responds with an error when an invalid order query is entered", () => {
          return request(app)
            .get("/api/reviews?order=asc;+DROP+TABLE+reviews;")
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).toBe("Invalid order query");
            });
        });
        test("400: responds with an error when an invalid sort_by query is entered", () => {
          return request(app)
            .get("/api/reviews?sort_by=votes;+DROP+TABLE+reviews;")
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).toBe("Invalid sort_by query");
            });
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
                comment_count: 3,
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

  describe("/api/reviews/:review_id/comments", () => {
    describe("GET", () => {
      test("200: should respond with an array of comment objects, each of which with the correct properties", () => {
        return request(app)
          .get("/api/reviews/2/comments")
          .expect(200)
          .expect("Content-Type", "application/json; charset=utf-8")
          .then(({ body }) => {
            const { comments } = body;
            expect(Array.isArray(comments)).toBe(true);
            expect(comments.length).toBe(3);
            comments.forEach((comment) => {
              expect(typeof comment).toBe("object");
              expect(comment).toEqual(
                expect.objectContaining({
                  comment_id: expect.any(Number),
                  votes: expect.any(Number),
                  created_at: expect.any(String),
                  author: expect.any(String),
                  body: expect.any(String),
                  review_id: 2,
                })
              );
            });
          });
      });
      test("200: responds with an empty array if the review_id is valid but there are no comments", () => {
        return request(app)
          .get("/api/reviews/1/comments")
          .expect(200)
          .then(({ body }) => {
            expect(body.comments).toEqual([]);
          });
      });
      describe("Error Handling", () => {
        test("404: responds with an appropriate error when no review exits with the ID parameter", () => {
          return request(app)
            .get("/api/reviews/9999/comments")
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).toBe("No review exists with that ID");
            });
        });
        test("400: responds with an appropriate error when a user enters an invalid review_id", () => {
          return request(app)
            .get("/api/reviews/ten/comments")
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).toBe("Bad path");
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
});

describe("/api/comments/:comment_id", () => {
  describe("DELETE", () => {
    test("204: deletes the given comment and returns no content", () => {
      return request(app)
        .delete("/api/comments/4")
        .expect(204)
        .then(({ body }) => {
          expect(body).toEqual({});
          return db.query("SELECT comment_id FROM comments;");
        })
        .then(({ rows }) => {
          expect(rows.length).toBe(5);
          expect(rows).toEqual([{ comment_id: 1 }, { comment_id: 2 }, { comment_id: 3 }, { comment_id: 5 }, { comment_id: 6 }]);
        });
    });
    describe("Error Handling", () => {
      test("400: responds with an appropriate error when an invalid comment_id is entered", () => {
        return request(app)
          .delete("/api/comments/eight")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Invalid comment ID");
          });
      });
      test("404: responds with an appropriate error when the specified comment_id does not exist", () => {
        return request(app)
          .delete("/api/comments/9999")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("No comment exists with that ID");
          });
      });
    });
  });
});
