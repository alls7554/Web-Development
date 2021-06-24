const moment = require("moment");

exports.now = function () {
  return moment().format();
};
