jest.mock("node-fetch");

const request = require("supertest");
const Parser = require("rss-parser");
const fetch = require("node-fetch");
const { Response } = jest.requireActual("node-fetch");

const mockTalosFixture = require("./fixtures/talos/response.json");
const handler = require("../index.js");

const mockParseURL = jest.fn().mockImplementation(() => mockTalosFixture);
jest.mock("rss-parser", () =>
  jest.fn().mockImplementation(() => ({ parseURL: mockParseURL }))
);

describe("news service", () => {
  it("serves news", async () => {
    await request(handler)
      .get("/")
      .expect(200)
      .expect((res) => {
        const result = JSON.parse(res.text, { compact: true, spaces: 0 });
        expect(result.items.length).toBe(10);
        expect(Object.keys(result.sources).length).toBe(6);
      });

    expect(mockParseURL).toHaveBeenCalledTimes(1);
  });

  it("serves passing healthcheck", async () => {
    fetch.mockReturnValue(Promise.resolve(new Response("200 OK")));

    await request(handler)
      .get("/.well-known/healthcheck")
      .expect(200)
      .expect((res) => {
        const result = JSON.parse(res.text, { compact: true, spaces: 0 });
        expect(Object.keys(result.checks).length).toBe(1);
        expect(result.status).toBe("pass");
      });

    expect(fetch).toHaveBeenCalledTimes(1);

    fetch.mockReturnValue(
      Promise.resolve(
        new Response("403 Forbidden", {
          status: 403,
        })
      )
    );

    await request(handler)
      .get("/.well-known/healthcheck")
      .expect(200)
      .expect((res) => {
        const result = JSON.parse(res.text, { compact: true, spaces: 0 });
        expect(Object.keys(result.checks).length).toBe(1);
        expect(result.status).toBe("fail");
      });
  });

  afterAll(() => {
    handler.close();
  });
});
