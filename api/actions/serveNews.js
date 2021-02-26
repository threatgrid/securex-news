const { asyncHandler } = require("../../utils");
const { getNews: getTalosNews } = require("../../dataSources/talos");
const { getNews: getUSCertNews } = require("../../dataSources/us-cert");
const { getNews: getCiscoBlogNews } = require("../../dataSources/cisco-blog");
const {
  getNews: getSecureXTrainingNews,
} = require("../../dataSources/securex-training");
const { getNews: getLocalNews } = require("../../dataSources/contentful");

async function serveNews(req, res, next) {
  let [
    talosNews,
    usCertNews,
    ciscoBlogNews,
    secureXTrainingNews,
    localNews,
  ] = await Promise.all([
    getTalosNews(),
    getUSCertNews(),
    getCiscoBlogNews(),
    getSecureXTrainingNews(),
    getLocalNews(),
  ]);

  const news = [
    ...talosNews.items,
    ...usCertNews.items,
    ...ciscoBlogNews.items,
    ...secureXTrainingNews.items,
    ...localNews.items,
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
  const sources = {
    ...talosNews.sources,
    ...usCertNews.sources,
    ...ciscoBlogNews.sources,
    ...secureXTrainingNews.sources,
    ...localNews.sources,
  };

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
