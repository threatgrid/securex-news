const { asyncHandler } = require("../../utils");
const staticNews = require("../../dataSources/local/news.json");
const staticSources = require("../../dataSources/local/sources.json");
const {
  getNews: getTalosNews,
  addSource: addTalosSource,
} = require("../../dataSources/talos");
const {
  getNews: getUSCertNews,
  addSource: addUSCertSource,
} = require("../../dataSources/us-cert");
const {
  getNews: getCiscoBlogNews,
  addSource: addCiscoBlogSource,
} = require("../../dataSources/cisco-blog");
const {
  getNews: getSecureXTrainingNews,
  addSource: addSecureXTrainingSource,
} = require("../../dataSources/securex-training");

async function serveNews(req, res, next) {
  let [
    talosNews,
    usCertNews,
    ciscoBlogNews,
    secureXTrainingNews,
  ] = await Promise.all([
    getTalosNews(),
    getUSCertNews(),
    getCiscoBlogNews(),
    getSecureXTrainingNews(),
  ]);

  const news = [
    ...staticNews,
    ...talosNews,
    ...usCertNews,
    ...ciscoBlogNews,
    ...secureXTrainingNews,
  ]
    .sort(
      (
        { date: date1, highlight: highlight1 },
        { date: date2, highlight: highlight2 }
      ) => {
        let a = date1;
        if (highlight1) {
          a = new Date(
            new Date(date1).getTime() + highlight1 * 86400000
          ).toISOString();
        }

        let b = date2;
        if (highlight2) {
          b = new Date(
            new Date(date2).getTime() + highlight2 * 86400000
          ).toISOString();
        }

        return a > b ? -1 : a < b ? 1 : 0;
      }
    )
    .slice(0, 10)
    .map((x) => {
      delete x.highlight;
      return x;
    });

  const newsSources = [...new Set(news.map((x) => x.sourceId))];
  const sources = staticSources;
  addTalosSource(sources);
  addUSCertSource(sources);
  addCiscoBlogSource(sources);
  addSecureXTrainingSource(sources);
  Object.keys(sources).forEach((x) => {
    if (!newsSources.includes(x)) {
      delete sources[x];
    }
  });

  return res
    .set({
      "Cache-Control": "public, s-maxage=600, max-age=60", // 10 mins on CDN, 1 min on clients
      "Cache-Tag": "news",
    })
    .send({
      sources,
      items: news,
    });
}

module.exports = asyncHandler(serveNews);
