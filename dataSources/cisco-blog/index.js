const Parser = require("rss-parser");

/**
 * Fetch RSS from Cisco Blog >> Security and convert to JSON.
 * @return {Object}
 */
exports.getNews = async () => {
  const parser = new Parser({
    customFields: {
      item: ["feedburner:origLink"],
    },
  });
  try {
    const rawNews = await parser.parseURL(
      "https://feeds.feedburner.com/CiscoBlogSecurity"
    );

    return rawNews.items.map((x) => ({
      title: x.title,
      link: x["feedburner:origLink"],
      date: x.isoDate,
      summary: x.contentSnippet.substr(0, 500) + "...",
      sourceId: "CISCO_BLOG",
    }));
  } catch (err) {
    return [];
  }
};

exports.addSource = (sources) => {
  sources["CISCO_BLOG"] = {
    icon:
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAAAY1BMVEUAAAD///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+aRQ2gAAAAIXRSTlMAOJ5cuIohpXYclYZDKxC1n1QVwJFvV0gKBHxlYUc7MSrE6EzBAAAAoUlEQVQoz83JRw7CMABE0XFcE/f0kMb9T4ltiYQdS5jNfOnh97P8bm4/gFR3V+RdLmSYVG41ZQguZUTNMlAO+wSnGViNiM5doNQFrsNjmVWGc4QxGM8Mal4eKBMDrg0CX0do3Rq4cS8JQQ+UUdYbIsGbFZvvjWWNpwVkugSDXyEjoDiiLNBo0SaYj67NuUmrmwKiYhMJ6JmGCGxftK8E/nQvem0G2l8h+skAAAAASUVORK5CYII=",
    name: "Cisco Security",
    "color-dusk": "#1c6d4f",
    "color-light": "#1c6d4f",
  };
};
