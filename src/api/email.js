"use strict";
exports.__esModule = true;
// test to see if an email actually sends
var Email_1 = require("&server/emails/Email");
var StatusEmail_1 = require("&server/emails/StatusEmail");
void Email_1.sendEmail(
  "navbarry@gmail.com",
  new StatusEmail_1.StatusEmail({
    name: "Bryce",
    status: 0,
  })
);
function default_1(req, res) {
  res.send("test");
}
exports["default"] = default_1;
