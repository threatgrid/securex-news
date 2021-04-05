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

    return {
      items: rawNews.items.map((x) => ({
        title: x.title,
        link: x.link,
        date: x.pubDate,
        summary: x.contentSnippet.substr(0, 500) + "...",
        sourceId: "TALOS_BLOG",
      })),
      sources: {
        TALOS_BLOG: {
          icon:
            "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCI+CiAgPHBhdGggZmlsbD0iIzJmYWNlMyIgZD0iTTAgLjY5OWgyNHYyMi42MDJIMHoiLz4KICA8cGF0aCBmaWxsPSIjZmZmIiBkPSJNMTguNTg1IDYuMzUzYy4xMjguMTcxLjI5OS4zNDIuNDI3LjUxMyAxLjExIDEuNTggMS43MDggMy4zMyAxLjY2NSA1LjI1MSAwIDIuMDUtLjU5OCAzLjg4NS0xLjkyMSA1LjQ2NS0xLjI4MSAxLjUzNy0yLjk0NiAyLjUxOS00LjkxIDIuOTQ2LTIuMzQ4LjUxMi00LjU2OC4wODUtNi42MTctMS4xNTMtLjE3MS0uMDg1LS4zLS4yMTMtLjQ3LS4zNDJsLS4xMjgtLjEyOC4xMjgtLjEyOGMuMzQyLS4zNDEuNjQtLjcyNi45ODItMS4wNjdhLjMyNC4zMjQgMCAwMS4xNy0uMDg1aDcuOTg0Yy4zNDIgMCAuNjgzLS4wODYuOTgyLS4zLjI5OS0uMjU1LjQyNy0uNTk3LjQyNy0uOTgxVjcuODljMC0uMTI4LjA0My0uMjEzLjEyOC0uMjk4LjM4NC0uMzg1Ljc2OS0uODEyIDEuMTUzLTEuMjM5ek0xNy4xNzYgNS4wM2MtLjM4NC4zODQtLjcyNi43NjgtMS4xMSAxLjE1My0uMTI4LjEyOC0uMjEzLjE3LS4zODQuMTdINy44NjljLS43NjggMC0xLjMyMy41NTUtMS4zMjMgMS4zMjR2OC4zNjhjMCAuMDQzIDAgLjEyOC0uMDQzLjEyOC0uMzg0LjQyNy0uODExLjg1NC0xLjE5NiAxLjI4bC0uMDQyLjA0M2MtLjA0My0uMDg1LS4xMjgtLjEyOC0uMTcxLS4yMTMtLjk0LTEuMjM4LTEuNTM3LTIuNjQ3LTEuNzA4LTQuMjI3LS4yMTMtMS45NjQuMDg2LTMuODQyIDEuMDY4LTUuNTUuOTgxLTEuNzUgMi40NzYtMi45MDMgNC4zNTQtMy42MjlhOC41MTEgOC41MTEgMCAwMTMuNzE1LS41OThjMS42NjUuMTI5IDMuMjAxLjY0IDQuNTY4IDEuNjIzIDAgLjA0Mi4wNDIuMDg1LjA4NS4xMjggMC0uMDQzIDAgMCAwIDB6bS0uNTk4IDEuMzY2Yy4zNDItLjM0MS42NC0uNjgzLjk4Mi0xLjAyNS4yMTQuMjE0LjQyNy40MjcuNjgzLjY0LS4zNDEuMzg1LS42ODMuNzI3LTEuMDI0IDEuMDY4YTIuMzQ2IDIuMzQ2IDAgMDAtLjMtLjM4NGMtLjA4NS0uMTI4LS4yMTMtLjIxNC0uMzQtLjI5OXpNNS41NjQgMTcuOTIzYy4zNDEtLjM4NC43MjUtLjcyNSAxLjAyNC0xLjA2Ny4wODYuMTI4LjEyOC4yOTkuMjU2LjM4NC4wODYuMTI4LjIxNC4yMTQuMzg1LjMtLjMuMzQtLjY0LjY4Mi0uOTgyIDEuMDI0YTkuOTE3IDkuOTE3IDAgMDAtLjY4My0uNjR6Ii8+Cjwvc3ZnPg==",
          name: "Talos Intelligence",
          "color-dusk": "#1b4c6f",
          "color-light": "#1b4c6f",
        },
      },
    };
  } catch (err) {
    return [];
  }
};
