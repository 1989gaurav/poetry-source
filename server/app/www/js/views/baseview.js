// Generated by CoffeeScript 1.6.2
(function() {
  var BaseView, ModalView, PageView,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BaseView = (function(_super) {
    __extends(BaseView, _super);

    function BaseView(options) {
      if (options == null) {
        options = {};
      }
      this.countWords = __bind(this.countWords, this);
      this.countLines = __bind(this.countLines, this);
      this.sanitize = __bind(this.sanitize, this);
      this.replaceWithHumor = __bind(this.replaceWithHumor, this);
      this.onRenderComplete = __bind(this.onRenderComplete, this);
      this.defaultLayoutStyle = __bind(this.defaultLayoutStyle, this);
      this.getImageDimensions = __bind(this.getImageDimensions, this);
      this.instanceid = Poe3.uniqueId();
      this.href = window.location.href;
      BaseView.__super__.constructor.call(this, options);
    }

    BaseView.prototype.getImageDimensions = function(url, cb) {
      var img;

      img = new Image;
      img.src = url;
      return img.onload = function() {
        return cb(null, {
          width: this.width,
          height: this.height
        });
      };
    };

    BaseView.prototype.defaultLayoutStyle = function() {
      return {
        top: 0,
        colWidth: 300,
        colSpacing: 16,
        adjustWidth: true,
        widthToSpacingRatio: 6,
        marginLeft: 20,
        marginRight: 32
      };
    };

    BaseView.prototype.onRenderComplete = function(selector) {
      return Poe3.fixAnchors(selector);
    };

    BaseView.prototype.replaceWithHumor = function(reason, defaultText) {
      var list;

      list = (function() {
        switch (reason) {
          case 'empty':
            return ["Empty pockets never held anyone back. Only empty heads and empty hearts can do that.", "Education's purpose is to replace an empty mind with an open one.", "All empty souls tend toward extreme opinions.", "I keep my hands empty for the sake of what I have had in them.", "Thoughts without content are empty, intuitions without concepts are blind.", "Words empty as the wind are best left unsaid.", "Prometheus is reaching out for the stars with an empty grin on his face.", "I looked into that empty bottle and I saw myself."];
          case 'empty-profile':
            return ["When I die, I want to die like my grandfather who died peacefully in his sleep. Not screaming like all the                      passengers in his car. <span style=\"font-style: italic\">- Will Rogers</span>"];
          default:
            return [defaultText];
        }
      })();
      return list[parseInt(Math.random() * list.length)];
    };

    BaseView.prototype.sanitize = function(text) {
      text = text.replace(/^\s+|\s+$/g, '');
      text = text.replace(/[ \t]{2,}/g, ' ');
      return text;
    };

    BaseView.prototype.countLines = function(text) {
      return text.split("\n").length;
    };

    BaseView.prototype.countWords = function(text) {
      return text.split(" ").length;
    };

    return BaseView;

  })(Backbone.View);

  PageView = (function(_super) {
    __extends(PageView, _super);

    function PageView(options) {
      this.setTitle = __bind(this.setTitle, this);      app.activeView = this;
      if ($('.modal-popup').length) {
        $('.modal-popup').trigger('close', {
          navigateBack: false
        });
      }
      app.activeModals = [];
      PageView.__super__.constructor.apply(this, arguments);
    }

    PageView.prototype.setTitle = function(text, addAppname) {
      if (addAppname == null) {
        addAppname = true;
      }
      return $(document)[0].title = text;
    };

    return PageView;

  })(BaseView);

  ModalView = (function(_super) {
    __extends(ModalView, _super);

    function ModalView(options) {
      this._hack_overlayHeightRefresh = __bind(this._hack_overlayHeightRefresh, this);
      this.closeModalModal = __bind(this.closeModalModal, this);
      this.displayModalModal = __bind(this.displayModalModal, this);
      this.hideMessage = __bind(this.hideMessage, this);
      this.showMessage = __bind(this.showMessage, this);
      this.closeModal = __bind(this.closeModal, this);
      this.afterClose = __bind(this.afterClose, this);
      this.onClose = __bind(this.onClose, this);
      this.displayModal = __bind(this.displayModal, this);
      this.createModalContainer = __bind(this.createModalContainer, this);
      this.setTitle = __bind(this.setTitle, this);      this.modalConfig = {};
      ModalView.__super__.constructor.apply(this, arguments);
    }

    ModalView.prototype.setTitle = function(text, addAppname) {
      if (addAppname == null) {
        addAppname = true;
      }
      this.previousDocumentTitle = $(document)[0].title;
      return $(document)[0].title = text;
    };

    ModalView.prototype.createModalContainer = function(className) {
      var me, previous,
        _this = this;

      this.className = className;
      if (!this.modalInitialized) {
        $('body').append("<div class=\"" + this.className + " modal-popup\"></div>");
        app.activeModals.push(this);
        if (app.activeModals.length > 1) {
          me = app.activeModals[app.activeModals.length - 1];
          previous = app.activeModals[app.activeModals.length - 2];
          if (this === me) {
            $("." + previous.className).css('opacity', '0.2');
            return $(document).bindNew('click', "." + previous.className, function() {
              return $("." + _this.className).trigger('close');
            });
          }
        }
      } else {
        return $("." + this.className).html('');
      }
    };

    ModalView.prototype.displayModal = function() {
      var _this = this;

      if (!this.modalInitialized) {
        this.modalInitialized = true;
        this.lightbox = {};
        $("." + this.className).lightbox_me({
          onClose: this.onClose,
          overlayCSS: {
            background: 'black',
            opacity: .98
          },
          destroyOnClose: true,
          lightboxReference: this.lightbox
        });
        $("." + this.className).prepend('\
                <p class="close-modal">\
                    <i class="icon-remove"></i>\
                </p>');
        $(document).bindNew('mouseenter', "." + this.className, function() {
          _this.fadePopup = false;
          return $("." + _this.className + " .close-modal").addClass('visible');
        });
        $(document).bindNew('mouseleave', "." + this.className, function() {
          _this.fadePopup = true;
          return setTimeout((function() {
            if (_this.fadePopup) {
              return $("." + _this.className + " .close-modal").removeClass('visible');
            }
          }), 2000);
        });
        return $(document).bindNew('click', "." + this.className + " > .close-modal", function() {
          return $("." + _this.className).trigger('close', {
            mustClose: true
          });
        });
      }
    };

    ModalView.prototype.onClose = function(e, options) {
      var last, modalModal, _ref, _ref1;

      if (options == null) {
        options = {};
      }
      if ((_ref = options.navigateBack) == null) {
        options.navigateBack = true;
      }
      if ((_ref1 = options.mustClose) == null) {
        options.mustClose = false;
      }
      modalModal = $("." + this.className + " .modal-modal");
      if (modalModal.length && !options.mustClose) {
        this.closeModalModal();
        return {
          close: false
        };
      } else {
        if (this.previousDocumentTitle) {
          $(document)[0].title = this.previousDocumentTitle;
        }
        app.activeModals.pop();
        if (app.activeModals.length) {
          last = app.activeModals[app.activeModals.length - 1];
          $("." + last.className).css('opacity', '1.0');
          $(document).off('click', "." + last.className);
        }
        this.closeModalModal();
        return {
          close: true,
          afterClose: this.afterClose(options)
        };
      }
    };

    ModalView.prototype.afterClose = function(options) {
      var _this = this;

      return function() {
        if (options.navigateBack) {
          if (_this.modalConfig.returnUrl) {
            return app.navigate(_this.modalConfig.returnUrl, true);
          } else {
            if (app.activeView) {
              if (!_this.modalConfig.urlLess) {
                app.activeView.modalClosed = true;
                return history.back();
              }
            } else {
              if (!app.activeModals.length) {
                return app.navigate('/', true);
              }
            }
          }
        }
      };
    };

    ModalView.prototype.closeModal = function() {
      return $("." + this.className).trigger('close', {
        mustClose: true
      });
    };

    ModalView.prototype.showMessage = function(text, type) {
      $("." + this.className + " div.message").html(text);
      if (type) {
        $("." + this.className + " div.message").addClass(type);
      }
      return $("." + this.className + " div.message").show();
    };

    ModalView.prototype.hideMessage = function() {
      return $("." + this.className + " div.message").hide();
    };

    ModalView.prototype.displayModalModal = function(parentSection, content, height) {
      var modalModal, top,
        _this = this;

      $("." + this.className + " .modal-modal").remove();
      parentSection.append('<div class="modal-modal" style="display:none"></div>');
      modalModal = $("." + this.className + " .modal-modal");
      modalModal.append(content);
      height = height != null ? height : modalModal.height() + 32;
      top = parentSection.height() - (height + 48);
      if (top < 64) {
        top = 64;
      }
      modalModal.css('min-height', "" + height + "px");
      modalModal.css('top', "" + top + "px");
      modalModal.css('padding', '24px');
      modalModal.css('width', "" + (parentSection.width() - 48) + "px");
      $("." + this.className + " .modal-modal").prepend('\
            <p class="close-modal">\
                <i class="icon-remove"></i>\
            </p>');
      $(document).bindNew('click', "." + this.className + " .modal-modal > .close-modal", function() {
        return _this.closeModalModal();
      });
      $(document).bindNew('click', "." + this.className, function() {
        if ($("." + _this.className + " .modal-modal").length) {
          return _this.closeModalModal();
        }
      });
      $(document).bindNew('click', "." + this.className + " .modal-modal", function() {
        return false;
      });
      return modalModal.show();
    };

    ModalView.prototype.closeModalModal = function() {
      $(document).off('click', "." + this.className);
      $("." + this.className + " .modal-modal").remove();
      return false;
    };

    ModalView.prototype._hack_overlayHeightRefresh = function() {
      return this.lightbox.setOverlayHeight();
    };

    return ModalView;

  })(BaseView);

  window.Poe3.BaseView = BaseView;

  window.Poe3.PageView = PageView;

  window.Poe3.ModalView = ModalView;

}).call(this);
