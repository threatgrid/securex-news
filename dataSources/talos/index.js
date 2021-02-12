const Parser = require("rss-parser");

/**
 * Fetch RSS from the Talos Blog API and convert to JSON.
 * @return {Object}
 */
exports.getNews = async () => {
  const parser = new Parser();
  try {
    const rawNews = await parser.parseURL(
      "https://blog.talosintelligence.com/feeds/posts/default/-/SecureX"
    );

    return rawNews.items.map((x) => ({
      title: x.title,
      link: x.link,
      date: x.pubDate,
      summary: x.contentSnippet.substr(0, 500) + "...",
      sourceId: "TALOS_BLOG",
    }));
  } catch (err) {
    return [];
  }
};

exports.addSource = (sources) => {
  sources["TALOS_BLOG"] = {
    icon:
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAAASFBMVEUAAAAAd74Ad74Ad74Ad74Ad74Ad74Ad74Ad74Ad74Ad74Ad74Ad74Ad74Ad74Ad74Ad74Ad74Ad74Ad74Ad74Ad74Ad74Ad74eie12AAAAF3RSTlMA+x7bpOT4uXgkGfPOczgtC8u0b1jPTpaSb6AAAAChSURBVCjPdZJJDsMgDABtzJawZG39/59WpER1GmeOM0IgG+iYGJxHt5YRJMYid9Can38nFuT59BtKT5W2r995mUAwvOg4YxI3L0td2hMsM/xBbAEM3gOzHyGyFrhA0MMKTg8EXg8e8Ck4PThY9RCg6CHC6LWApo2E7sG2IeY6XP3E6VjWTHm4+IX3viiqxJICnTlLnfbHzyAZY3CILsTzug8V4w9eOopmvwAAAABJRU5ErkJggg==",
    name: "Talos Intelligence",
    "color-dusk": "#1b4c6f",
    "color-light": "#1b4c6f",
  };
};
