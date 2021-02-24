const fetch = require("node-fetch");

/**
 * Fetch JSON from SecureX CMS.
 * @return {Object}
 */
exports.getNews = async () => {
  try {
    const response = await fetch(
      `https://cdn.contentful.com/spaces/20j8s5zi43vw/environments/master/entries?content_type=news`,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer sMXk4-Ut9HyfnQ33NxzR2G7YEHl4vcx1hZOMb-kBZek",
        },
      }
    );

    const rawNews = await response.json();
    return {
      items: rawNews.items.map((x) => ({
        title: x.fields.title,
        link: x.fields.link,
        date: x.fields.date,
        summary: x.fields.summary.substr(0, 500) + "...",
        sourceId: x.fields.source.sys.id,
        highlight: x.fields.highlight,
      })),
      sources: rawNews.includes.Entry.reduce((acc, x) => {
        acc[x.sys.id] = {
          icon: x.fields.icon,
          name: x.fields.name,
          "color-dusk": x.fields.colorDusk,
          "color-light": x.fields.colorLight,
        };

        return acc;
      }, {}),
    };
  } catch (err) {
    return [];
  }
};
