const fetch = require("node-fetch");

const fetchBody = require("./fetch-body");

/**
 * Fetch JSON from SecureX Webinars and Training. VERY hacky.
 * @return {Object}
 */
exports.getNews = async () => {
  try {
    const page = await fetch("https://learningnetwork.cisco.com/s/event-list");
    const pageHtml = await page.text();
    const key = pageHtml.match(
      /\/s\/sfsites\/auraFW\/javascript\/([^\/]+)\/aura_prod/
    )[1];

    const response = await fetch(
      "https://learningnetwork.cisco.com/s/sfsites/aura",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
        body: fetchBody(key),
      }
    );

    const rawNews = await response.json();
    return {
      items: rawNews.actions[0].returnValue.objEventList
        .map((x) => ({
          title: x.Name,
          link: "https://learningnetwork.cisco.com/s/event/" + x.Id,
          date: x["Start_DateTime__c"],
          summary:
            x["Details__c"]
              .replace(/<[^>]*>?/gm, "")
              .replace(/^register now/gi, "")
              .substr(0, 500) + "...",
          sourceId: "SECUREX_TRAINING",
        }))
        .filter(
          (x) => new Date(x.date).getTime() < new Date().getTime() + 604800000
        ),
      sources: {
        SECUREX_TRAINING: {
          icon:
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAAAPFBMVEUAAAD////////////////////////////////////////////////////////////////////////////YSWgTAAAAE3RSTlMAnPnsxK51cxvz46WQd1E/NwwGXc+MWQAAAHNJREFUKM+t0UkOgCAQRNFGZHAe6v53VYgGiEWiiX/7UulFSwtaK6h0gpDegdXaMphxNhNQARSBIcDwZeECOAK+ARpPQAxghMAaFusDvEJM+QJ21+Gqc3sGI7LGG3j1R/3ftljT98YumxRN6exUgE6gJXYAavwR9egJckYAAAAASUVORK5CYII=",
          name: "SecureX Webinars & Training",
          "color-dusk": "#5f4091",
          "color-light": "#5f4091",
        },
      },
    };
  } catch (err) {
    return [];
  }
};
