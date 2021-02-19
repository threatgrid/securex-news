const fetch = require("node-fetch");

const fetchBody = require("../../dataSources/securex-training/fetch-body");
const packageVersion = require("../../package.json").version;
const { asyncHandler } = require("../../utils");

const healthchecks = {
  "https://blog.talosintelligence.com/": async () => {
    const response = await fetch(
      new URL(
        "https://blog.talosintelligence.com/feeds/posts/default/-/SecureX"
      )
    );

    if (!response.ok) {
      throw new Error("response status: " + response.status);
    }
  },
  "https://us-cert.cisa.gov/": async () => {
    const response = await fetch(
      new URL("https://us-cert.cisa.gov/ncas/current-activity.xml")
    );

    if (!response.ok) {
      throw new Error("response status: " + response.status);
    }
  },
  "https://feeds.feedburner.com/": async () => {
    const response = await fetch(
      new URL("https://feeds.feedburner.com/CiscoBlogSecurity")
    );

    if (!response.ok) {
      throw new Error("response status: " + response.status);
    }
  },
  "https://learningnetwork.cisco.com/": async () => {
    const response = await fetch(
      new URL("https://learningnetwork.cisco.com/s/sfsites/aura"),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
        body: fetchBody(),
      }
    );

    if (!response.ok) {
      throw new Error("response status: " + response.status);
    }
  },
};

async function runHealthchecks() {
  return Object.keys(healthchecks).reduce(
    async (previousValue, currentValue) => {
      const accumulator = await previousValue;
      accumulator[currentValue] = await checkHealth(healthchecks[currentValue]);
      return Promise.resolve(accumulator);
    },
    Promise.resolve({})
  );
}

async function checkHealth(fn) {
  const result = await benchmark(fn);

  return {
    observedValue: result.timeInMs,
    observedUnit: "milliseconds",
    status: !result.error ? "pass" : "fail",
    ...(result.error ? { output: result.error } : {}),
  };
}

/**
 * Basic wrapper for benchmarking an API request. This will not throw if the API
 * is unavailable. This is important because we want to be able to have a highly
 * predictable healthcheck endpoint to narrow down the cause of an issue.
 */
async function benchmark(fn) {
  const start = Date.now();
  let error;
  try {
    await fn();
  } catch (err) {
    error = err;
  }
  return {
    error,
    timeInMs: Date.now() - start,
  };
}

/**
 * Provide a healthcheck endpoint for underlying services. This is useful when
 * debugging when the error may not be within our app.
 * See: https://inadarei.github.io/rfc-healthcheck/
 */
async function serveHealthcheck(req, res, next) {
  const response = {
    version: packageVersion,
    serviceId: "bf5a3e4f-d416-412f-9b05-8f6b73a05f78",
    checks: await runHealthchecks(),
  };

  response.status = Object.keys(response.checks).every(
    (x) => response.checks[x].status === "pass"
  )
    ? "pass"
    : "fail";

  return res
    .set({
      "Content-Type": "application/health+json",
    })
    .send(response);
}

module.exports = asyncHandler(serveHealthcheck);
