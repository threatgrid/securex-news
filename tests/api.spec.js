jest.mock("node-fetch", () => {
  return jest.fn((url) => {
    const responseBody = url.startsWith(
      "https://learningnetwork.cisco.com/s/sfsites/aura"
    )
      ? mockParseURLSecureXTraining()
      : url.startsWith("https://cdn.contentful.com/")
      ? mockParseURLSecureXCms()
      : "";

    return Promise.resolve({
      ok: true,
      json: () => responseBody,
      text: () => "/s/sfsites/auraFW/javascript/key/aura_prod",
    });
  });
});

const request = require("supertest");
const Parser = require("rss-parser");
const fetch = require("node-fetch");
const { Response } = jest.requireActual("node-fetch");

const mockTalosFixture = require("./fixtures/talos/response.json");
const mockUSCertFixture = require("./fixtures/us-cert/response.json");
const mockCiscoBlogFixture = require("./fixtures/cisco-blog/response.json");
const mockSecureXTrainingFixture = require("./fixtures/securex-training/response.json");
const mockSecureXCmsFixture = require("./fixtures/contentful/response.json");
const mockDuoFixture = require("./fixtures/duo/response.json");
const handler = require("../api/index.js");
const { response } = require("express");

const mockParseURLTalos = jest.fn().mockImplementation(() => mockTalosFixture);
const mockParseURLUSCert = jest
  .fn()
  .mockImplementation(() => mockUSCertFixture);
const mockParseURLCiscoBlog = jest
  .fn()
  .mockImplementation(() => mockCiscoBlogFixture);
const mockParseURLSecureXTraining = jest
  .fn()
  .mockImplementation(() => mockSecureXTrainingFixture);
const mockParseURLSecureXCms = jest
  .fn()
  .mockImplementation(() => mockSecureXCmsFixture);
const mockParseURLDuo = jest.fn().mockImplementation(() => mockDuoFixture);
jest.mock("rss-parser", () =>
  jest.fn().mockImplementation(() => ({
    parseURL: (source) =>
      source.startsWith("https://blog.talosintelligence.com/")
        ? mockParseURLTalos()
        : source.startsWith("https://us-cert.cisa.gov/")
        ? mockParseURLUSCert()
        : source.startsWith("https://feeds.feedburner.com/CiscoBlogSecurity")
        ? mockParseURLCiscoBlog()
        : source.startsWith("https://duo.com/")
        ? mockParseURLDuo()
        : "",
  }))
);

describe("news service", () => {
  it("serves news", async () => {
    await request(handler)
      .get("/")
      .expect(200)
      .expect((res) => {
        const result = JSON.parse(res.text, { compact: true, spaces: 0 });
        expect(result.items.length).toBe(25);
        expect(Object.keys(result.sources).length).toBe(5);
      });

    expect(mockParseURLTalos).toHaveBeenCalledTimes(1);
    expect(mockParseURLUSCert).toHaveBeenCalledTimes(1);
    expect(mockParseURLCiscoBlog).toHaveBeenCalledTimes(1);
    expect(mockParseURLSecureXTraining).toHaveBeenCalledTimes(1);
    expect(mockParseURLSecureXCms).toHaveBeenCalledTimes(1);
    expect(mockParseURLDuo).toHaveBeenCalledTimes(1);
  });

  it("serves passing healthcheck", async () => {
    fetch.mockReturnValue(
      Promise.resolve({
        ok: true,
        text: () => "/s/sfsites/auraFW/javascript/key/aura_prod",
      })
    );

    await request(handler)
      .get("/.well-known/healthcheck")
      .expect(200)
      .expect((res) => {
        const result = JSON.parse(res.text, { compact: true, spaces: 0 });
        expect(Object.keys(result.checks).length).toBe(6);
        expect(result.status).toBe("pass");
      });

    expect(fetch).toHaveBeenCalledTimes(10);

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
        expect(Object.keys(result.checks).length).toBe(6);
        expect(result.status).toBe("fail");
      });
  });

  afterAll(() => {
    handler.close();
  });
});
