const PRODUCTION_URL = "https://example.com";

function normalizeUrl(value) {
  return String(value || "").trim().replace(/\/+$/, "");
}

function normalizeAssetPath(value) {
  const normalized = normalizeUrl(value);

  if (!normalized || normalized === "/") {
    return "";
  }

  return normalized.startsWith("/") ? normalized : `/${normalized}`;
}

module.exports = function() {
  const deployUrl = normalizeUrl(process.env.URL || process.env.DEPLOY_PRIME_URL);

  return {
    name: "Mountain Duck",
    url: deployUrl || PRODUCTION_URL,
    assetPath: normalizeAssetPath(process.env.ASSET_PATH),
    authorName: "Andy Clarke",
    authorEmail: "andy.clarke@stuffandnonsense.co.uk",
    telephone: "",
    email: "post@iterate.ch",
    siteID: "mountain-duck",
    copyrightOwner: "Iterate GmbH"
  };
};
