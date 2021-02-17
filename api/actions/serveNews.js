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

async function serveNews(req, res, next) {
  let [talosNews, usCertNews] = await Promise.all([
    getTalosNews(),
    getUSCertNews(),
  ]);

  const news = [...staticNews, ...talosNews, ...usCertNews]
    .sort((a, b) => {
      return a.date > b.date ? -1 : a.date < b.date ? 1 : 0;
    })
    .slice(0, 10);

  const newsSources = [...new Set(news.map((x) => x.sourceId))];
  const sources = staticSources;
  addTalosSource(sources);
  addUSCertSource(sources);
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
