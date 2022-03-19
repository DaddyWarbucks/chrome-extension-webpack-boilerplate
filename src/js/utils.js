// This meta tag parsing function was lifted from
// https://github.com/jodacame/gmeta. Our build
// process was fighting with its import so I
// just got the source code. The package is
// still included as a dependency for license

const patterns = [
  {
    pattern: "<{{KEY}}>(.*?)</{{KEY}}>",
    KEYS: ["title"],
  },
  {
    pattern: "<{{KEY}}.*?>(.*?)</{{KEY}}>",
    KEYS: ["title"],
  },
  {
    pattern:
      '<meta.*?name="{{KEY}}".*?content="(.*?)".*?>|<meta.*?content="(.*?)".*?name="{{KEY}}".*?>',
    KEYS: [
      "description",
      "keywords",
      "copyright",
      "language",
      "robots",
      "generator",
      "viewport",
      "google-site-verification",
      "msvalidate.01",
      "twitter:card",
      "twitter:site",
      "twitter:creator",
      "twitter:title",
      "twitter:description",
      "twitter:image",
      "summary",
      "classification",
      "author",
      "designer",
      "owner",
      "url",
      "category",
      "distribution",
      "rating",
      "date",
      "apple-mobile-web-app-title",
      "apple-mobile-web-app-capable",
      "apple-touch-fullscreen",
      "apple-mobile-web-app-status-bar-style",
      "format-detection",
      "msapplication-starturl",
      "msapplication-window",
      "msapplication-navbutton-color",
      "application-name",
      "msapplication-tooltip",
      "msapplication-task",
      "application-name",
      "msapplication-TileColor",
      "msapplication-square70x70logo",
      "msapplication-square150x150logo",
      "msapplication-wide310x150logo",
      "msapplication-square310x310logo",
      "msapplication-notification",
      "dcterms.creator",
      "dc.language",
      "dcterms.title",
      "dcterms.description",
      "csrf-param",
      "csrf-token",
      "theme-color",
      "geo.region",
      "geo.position",
      "icbm",
      "thumbnail",
      "google-analytics",
      "hostname",
    ],
  },
  {
    pattern:
      '<meta.*?property="{{KEY}}".*?content="(.*?)".*?>|<meta.*?content="(.*?)".*?property="{{KEY}}".*?>',
    KEYS: [
      "fb:app_id",
      "og:url",
      "og:type",
      "og:title",
      "og:description",
      "og:image",
      "twitter:card",
      "twitter:site",
      "twitter:creator",
      "twitter:title",
      "twitter:description",
      "twitter:image",
    ],
  },
  {
    pattern: '<meta.*?{{KEY}}="(.*?)".*?>',
    KEYS: ["charset"],
  },
  {
    pattern: '<html.*?{{KEY}}="(.*?)".*?>',
    KEYS: ["lang"],
  },
  {
    pattern:
      '<link.*?rel="{{KEY}}".*?href="(.*?)".*?>|<link.*?href="(.*?)".*?rel="{{KEY}}".*?>',
    KEYS: ["icon", "canonical", "manifest", "fluid-icon"],
  },
];

export const parseMetaTags = function (url, callback, isHTML) {
  return new Promise(async (resolve, reject) => {
    if (!url || url == undefined || url == "undefined") url = "";
    if (callback === true) isHTML = true;
    let meta = {};
    if (!isHTML || isHTML === false) {
      try {
        const response = await fetch(url, { timeout: 3000 });
        const htmlString = await response.text();
        let head = htmlString.match(/<head[^>]*>[\s\S]*<\/head>/gi);
        head = head[0] ? head[0] : htmlString;

        head = head.replace(/(<style[\w\W]+style>)/gi, "");
        head = head.replace(/(<script[\w\W]+script>)/gi, "");

        patterns.forEach((el) => {
          el.KEYS.forEach((key) => {
            let m = _prepare(
              head.match(new RegExp(el.pattern.split("{{KEY}}").join(key), "i"))
            );
            if (m) meta[key] = m;
          });
        });
        if (typeof callback === "function") callback(false, meta);
        return resolve(meta);
      } catch (error) {
        if (typeof callback === "function") callback(error, false);
        console.error(error);
        return reject(error);
      }
    } else {
      patterns.forEach((el) => {
        el.KEYS.forEach((key) => {
          let m = _prepare(
            url.match(new RegExp(el.pattern.split("{{KEY}}").join(key), "i"))
          );
          if (m) meta[key] = m;
        });
      });
      if (typeof callback === "function") callback(false, meta);
      return resolve(meta);
    }
  });
};

const _prepare = function (data) {
  return data ? data[1] : false;
};