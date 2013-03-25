// Generated by CoffeeScript 1.6.2
(function() {
  var AppError, TokensController, conf, controller, fs, models, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  controller = require('./controller');

  conf = require('../../conf');

  models = new (require('../../models')).Models(conf.db);

  fs = require('fs');

  AppError = require('../../common/apperror').AppError;

  TokensController = (function(_super) {
    __extends(TokensController, _super);

    function TokensController() {
      this.createToken = __bind(this.createToken, this);
      this.getToken = __bind(this.getToken, this);      _ref = TokensController.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    TokensController.prototype.getToken = function(req, res, next) {
      var _this = this;

      return this.attachUser(arguments, function() {
        return models.Token.get({
          type: req.params.type,
          key: req.params.key
        }, {
          user: req.user
        }, function(err, token) {
          if (!err) {
            return res.send(token);
          } else {
            return next(err);
          }
        });
      });
    };

    TokensController.prototype.createToken = function(req, res, next) {
      var _this = this;

      return this.attachUser(arguments, function() {
        var token;

        token = new models.Token({
          type: req.body.type,
          key: req.body.key,
          value: req.body.value
        });
        return token.save({
          user: req.user
        }, function(err, token) {
          if (!err) {
            return res.send(token);
          } else {
            return next(err);
          }
        });
      });
    };

    return TokensController;

  })(controller.Controller);

  exports.TokensController = TokensController;

}).call(this);
