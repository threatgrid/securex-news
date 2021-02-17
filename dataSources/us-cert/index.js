const Parser = require("rss-parser");

const stripFirstLine = (html) => html.slice(html.indexOf("\n"));

const convertDate = (dateString) =>
  new Date(Date.parse(dateString)).toISOString();

/**
 * Fetch RSS from US CERT Current Activity and convert to JSON.
 * @return {Object}
 */
exports.getNews = async () => {
  const parser = new Parser();
  try {
    const rawNews = await parser.parseURL(
      "https://us-cert.cisa.gov/ncas/current-activity.xml"
    );

    return rawNews.items.map((x) => ({
      title: x.title,
      link: x.link,
      date: convertDate(x.pubDate),
      summary: stripFirstLine(x.contentSnippet).substr(0, 500) + "...",
      sourceId: "US_CERT",
    }));
  } catch (err) {
    return [];
  }
};

exports.addSource = (sources) => {
  sources["US_CERT"] = {
    icon:
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAACK1BMVEUAAAD////////////6+/3////////////////////////9/v65z97I2ub///////////////////+vyNnh6/Hc6O/T4erP3unE1+P///////8AUogAUIcATYQAS4OqxtgCT4azy9yTtsyErMY8msTw9fje6fCXuM6BqcQfh7hilLYThLY+fKXT4erK2+d4o79dkbQAda0qbZrF2OSQxdxztdOfvtJirc9AmsNto8JmmrtLhq1XkapIg6oAbqhDgKc7eqMrb5wla5kcZZUUYJELWY0HVosLVooIUogASYICU3j5+/zz9/nh6/GlwtWhwNR3t9SZutBYpsyKscpUpMlGoMg0lsVLn8R9p8Iskb9pm7wljrxunbsei7sigbIDe7FVjLAvg69Oh6xDfaUQc6JYkp8tcZ5km5w8e5kVbpdpn5QARX8OXGtTjlQnb1JFhzz6/P33+vvp8PXY5e3N3eiDvthsstF8ss5eqsyPs8t3rstOo8twpsRCm8Nzo8Evk79Ul716prwJgLthmLoZh7c1irUxiLRWj7Nbj7IYg7IOfrByn68Kfq5hla0AcqpSjKkAcalZkqUwfaMNeaMsfKEIbKE0daAEcqBBfp8ydJ8BaJ4vgJkRZ5kegpgqapgAXpcfZpYdY5QTdJMBXZMSWY0WWIwZcostcIUOXIQSaoMASoIFVoEVYoAARoAadn0OW3w/eno9enoAPXkAT3YAS3YTZHM5g24nfGoIWWNHOhSbAAAAGnRSTlMAHvnkqLm4eHdZIKn+9vRyb1dO/vb29vb1153dXHkAAAH0SURBVCjPTVJldxsxEDxj7LhNmnIl+dh4MTM7ZjtpmJkZyszMzMzM/PMqO4njefqgN/O0q90ZYgmiMplEXLFFXlZOlEIkpewZkiRR8v4qqWiFX7t5PBSpxkCfsyi2SbnMr2mCaaMJAJO7vjOE6JS7cpGvaoKQJnUAAA0+SYTUVFWh/moIoTq2FWBY7/QiCFFmQ76PNI6vM/G8UBf5MUOSH8hsjQo/YDCPzulYTrefO+L3nzw7HLGnzSJCUQNhlgXb6yxnvK1dPXwfzx9u3mtVEPIUJAM7Bwd7jf2eVlej0+D0hsNtw3JCgjsbrVqNmT29x+vat9vlbLwW7qiWEOK8wIEd+ob+9uZ2/iDfxfcZPFExFhDk3Nsc1OWxienpibHrwWDwasu4uFBKz1pMzL1/8wsL87OzuVzulzUuIWQpOsFw2l3M5O8/c3N/745++vrxXXdCjr+L0nodpw29ff/4+7cvJ84/nPo5GYgqiHJGHTNZzKzx4pubN269EAyXbFPHk2Zsi/T5s06NjqrVd9gGbBcEw8CVtoBdVViiXcNSADh8Qy8fjQoGW4+PXl8wS+looAAGYxl6+kAQjvoy65RLRmlr8wL12n/s9ilP96v6yqK1FVoAWmi1euTQgZEnG5UlYVABPU3jURPRYhhK4yOWyIrx+Q9PZXHitueVzQAAAABJRU5ErkJggg==",
    name: "US-CERT",
    "color-dusk": "#1a6c9c",
    "color-light": "#1a6c9c",
  };
};
