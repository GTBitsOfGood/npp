const withOffline = require("next-offline");
const withImages = require("next-images");

module.exports = withOffline(withImages());
