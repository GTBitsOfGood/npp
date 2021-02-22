"use strict";
var __assign =
  (this && this.__assign) ||
  function () {
    __assign =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g;
    return (
      (g = { next: verb(0), throw: verb(1), return: verb(2) }),
      typeof Symbol === "function" &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while (_)
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y["return"]
                  : op[0]
                  ? y["throw"] || ((t = y["return"]) && t.call(y), 0)
                  : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
exports.__esModule = true;
exports.sendEmailToService = exports.sendEmail = void 0;
var email_templates_1 = require("email-templates");
var path_1 = require("path");
var FROM_ADDRESS = '"GT Bits of Good" <hello@bitsofgood.org>';
var baseTemplatePath = path_1["default"].join(process.env.ROOT, "/emails");
var transportConfig = {
  service: "Zoho",
  host: process.env.MAIL_HOST,
  port: parseInt(process.env.MAIL_PORT),
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
};
function sendEmail(to, config) {
  return __awaiter(this, void 0, void 0, function () {
    var emailConfigWithEnvironmentLocals;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          emailConfigWithEnvironmentLocals = {
            templateName: config.templateName,
            locals: __assign(
              { baseUrl: process.env.NEXT_PUBLIC_BASE_URL },
              config.locals
            ),
          };
          if (!(process.env.NODE_ENV == "development")) return [3 /*break*/, 2];
          return [
            4 /*yield*/,
            sendEmailToService(to, emailConfigWithEnvironmentLocals),
          ];
        case 1:
          _a.sent();
          return [2 /*return*/, true];
        case 2:
          return [
            2 /*return*/,
            sendEmailThroughMicroservice(emailConfigWithEnvironmentLocals, to),
          ];
      }
    });
  });
}
exports.sendEmail = sendEmail;
function sendEmailThroughMicroservice(config, to) {
  return __awaiter(this, void 0, void 0, function () {
    var fetchResult, jsonResult;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [
            4 /*yield*/,
            fetch(process.env.NEXT_PUBLIC_BASE_URL + "/email", {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + process.env.MAIL_MICROSERVICE_KEY,
              },
              body: JSON.stringify({ to: to, config: config }),
            }),
          ];
        case 1:
          fetchResult = _a.sent();
          return [4 /*yield*/, fetchResult.json()];
        case 2:
          jsonResult = _a.sent();
          if (jsonResult == null) {
            throw new Error(
              "'Could not connect to e-mail microservice!' (status=" +
                fetchResult.status +
                ")"
            );
          }
          if (!fetchResult.ok) {
            throw new Error(
              "Received a bad response (status=" +
                fetchResult.status +
                "): " +
                jsonResult
            );
          }
          return [2 /*return*/, jsonResult];
      }
    });
  });
}
/**
 * (DO NOT CALL THIS FUNCTION IF YOU"RE SENDING AN EMAIL WITHIN
 * NPP). Please call (sendEmail) instead
 * This function tells are e-mail service to send an e-mail
 * @param to - the email to send the email to
 * @param config - the email config
 */
function sendEmailToService(to, config) {
  var templateFolder = path_1["default"].join(
    baseTemplatePath,
    config.templateName
  );
  var email = new email_templates_1["default"]({
    message: {
      from: FROM_ADDRESS,
    },
    transport: transportConfig,
    // Only send emails in dev if mail_host is set, this prevents error being thrown in testing
    send: process.env.MAIL_HOST != null,
    juice: true,
    juiceResources: {
      preserveImportant: true,
      webResources: {
        relativeTo: templateFolder,
      },
    },
  });
  return email.send({
    template: templateFolder,
    message: {
      to: to,
    },
    locals: config.locals,
  });
}
exports.sendEmailToService = sendEmailToService;
