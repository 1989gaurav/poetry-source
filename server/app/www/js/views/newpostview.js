// Generated by CoffeeScript 1.6.2
(function() {
  var NewPostView, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  NewPostView = (function(_super) {
    __extends(NewPostView, _super);

    function NewPostView() {
      this.createPost = __bind(this.createPost, this);
      this.hideContentError = __bind(this.hideContentError, this);
      this.showContentError = __bind(this.showContentError, this);
      this.validateContent = __bind(this.validateContent, this);
      this.setCreatePostHeading = __bind(this.setCreatePostHeading, this);
      this.otherMode = __bind(this.otherMode, this);
      this.updateForm = __bind(this.updateForm, this);
      this.getAttachmentType = __bind(this.getAttachmentType, this);
      this.getPostType = __bind(this.getPostType, this);
      this.getAuthoringMode = __bind(this.getAuthoringMode, this);
      this.onFileSelect = __bind(this.onFileSelect, this);
      this.applyImageFilter = __bind(this.applyImageFilter, this);
      this.setPicture = __bind(this.setPicture, this);
      this.onImageUrlChange = __bind(this.onImageUrlChange, this);
      this.onResetPicture = __bind(this.onResetPicture, this);
      this.attachEvents = __bind(this.attachEvents, this);
      this.render = __bind(this.render, this);
      this.initialize = __bind(this.initialize, this);      _ref = NewPostView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    NewPostView.prototype.initialize = function() {
      $('#content').html(this.el);
      return this.render();
    };

    NewPostView.prototype.render = function() {
      this.setTitle('Create a New Poem');
      $(this.el).html(this.template({}));
      this.attachEvents();
      this.updateForm();
      return this.onRenderComplete('.new-post-view');
    };

    NewPostView.prototype.attachEvents = function() {
      var self, _fn, _i, _len, _ref1, _t,
        _this = this;

      self = this;
      $(document).bindNew('click', '.authoring-mode li', function() {
        if (!$(this).hasClass('disabled')) {
          $('.authoring-mode li').removeClass('selected');
          $(this).addClass('selected');
          self.updateForm();
        }
        return false;
      });
      $(document).bindNew('click', '.post-type li', function() {
        if (!$(this).hasClass('disabled')) {
          $('.post-type li').removeClass('selected');
          $(this).addClass('selected');
          self.updateForm();
        }
        return false;
      });
      self.speechBubble = {};
      _ref1 = ['haiku', 'six-word-story', 'quote', 'free-verse'];
      _fn = function(_t) {
        $(document).bindNew('mouseenter', ".post-type li[data-value=\"" + _t + "\"]", function() {
          self.speechBubble[_t] = function() {
            $(".speech-bubble").hide();
            return $(".speech-bubble." + _t).show();
          };
          return setTimeout((function() {
            var _base;

            return typeof (_base = self.speechBubble)[_t] === "function" ? _base[_t]() : void 0;
          }), 1000);
        });
        return $(document).bindNew('mouseleave', ".post-type li[data-value=\"" + _t + "\"]", function() {
          self.speechBubble[_t] = null;
          return setTimeout((function() {
            if (self.speechBubble[_t] == null) {
              return $(".speech-bubble." + _t).hide();
            }
          }), 2000);
        });
      };
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        _t = _ref1[_i];
        _fn(_t);
      }
      $(document).bindNew('click', '.credits-link', function() {
        if ($('.picture-credits').hasClass('hidden')) {
          $('.picture-credits').removeClass('hidden');
          return $('.credits-link').html('Remove image credits');
        } else {
          $('.picture-credits').addClass('hidden');
          $('.image-credits-name').val('');
          $('.image-credits-website').val('');
          return $('.credits-link').html('Add image credits');
        }
      });
      $(document).bindNew('click', '.attachment-type li', function() {
        if (!$(this).hasClass('disabled')) {
          $('.attachment-type li').removeClass('selected');
          $(this).addClass('selected');
          self.updateForm();
        }
        return false;
      });
      $(document).bindNew('change', '.file-input', this.onFileSelect);
      $(document).bindNew('paste', '.image-url', function() {
        return _this.onImageUrlChange();
      });
      $(document).bindNew('blur', '.image-url', function() {
        return _this.onImageUrlChange();
      });
      $(document).bindNew('click', '.show-upload-box', function() {
        $('.image-url').val('');
        $('.with-url').hide();
        $('.with-upload').show();
        return false;
      });
      $(document).bindNew('click', '.show-image-url', function() {
        $('.image-url').val('');
        $('.with-upload').hide();
        $('.with-url').show();
        return false;
      });
      $(document).bindNew('click', 'a.change-picture', this.onResetPicture);
      $(document).bindNew('click', 'a.image-effect', function() {
        return self.applyImageFilter(this);
      });
      return $(document).bindNew('click', 'button.create', function() {
        return _this.createPost();
      });
    };

    NewPostView.prototype.onResetPicture = function() {
      $('.create-post-section .background').hide();
      $('.new-post-view .image-url').val('');
      $('.new-post-view .file-input').replaceWith('<input type="file" class="file-input" name="file" />');
      $('.new-post-view .file-input').bindNew('change', this.onFileSelect);
      $('.new-post-view .upload-box').show();
      return false;
    };

    NewPostView.prototype.onImageUrlChange = function() {
      var ext, msg, url,
        _this = this;

      $('.picture-section .message').hide();
      url = $('.image-url').val().trim();
      if (url !== '') {
        ext = url.split('/').pop().split('.').pop().toLowerCase();
        if (ext === 'png' || ext === 'jpg' || ext === 'jpeg' || ext === 'gif' || ext === 'bmp') {
          $('.upload-box').hide();
          $('.create-post-section .background .picture-options').hide();
          $('.create-post-section .background').show();
          $('.create-post-section .background .pic-container').html('\
                    <img src="/images/loading.gif" class="loading" alt="loading" /> \
                    <span class="text">Loading...</span> \
                    <a class="text cancel" href="#">cancel</a>');
          $(document).bindNew('click', '.create-post-section .background .cancel', function() {
            $('.create-post-section .background .pic-container').html('');
            return _this.onResetPicture();
          });
          return $.ajax({
            url: Poe3.apiUrl("files/processurl"),
            data: {
              url: url
            },
            type: 'GET',
            success: function(resp) {
              if ($('.create-post-section .background img.loading').length) {
                return _this.setPicture(resp.attachment, resp.attachmentThumbnail);
              }
            }
          });
        } else {
          msg = "Url should end with .jpg, .jpeg or .png. Alternatively, you could upload it.";
          $('.picture-section .message').html("<i class=\"icon-remove-sign\"></i>" + msg);
          return $('.picture-section .message').show();
        }
      }
    };

    NewPostView.prototype.setPicture = function(url, thumbnailUrl, options) {
      if (options == null) {
        options = {
          clearFilterSelection: true
        };
      }
      $('.create-post-section .background').show();
      $('.create-post-section .background .picture-options').show();
      $('.create-post-section .background .pic-container').html("<img src=\"" + url + "\" data-filter=\"none\" data-src=\"" + url + "\" data-thumbnail-src=\"" + thumbnailUrl + "\" class=\"picture\" />");
      if (options.clearFilterSelection) {
        $('a.image-effect').removeClass('selected');
        return $('a.image-effect').first().addClass('selected');
      }
    };

    NewPostView.prototype.applyImageFilter = function(elem) {
      var attachment, attachmentThumbnail, currentFilter, filter, fnApply, pic,
        _this = this;

      elem = $(elem);
      $('a.image-effect').removeClass('selected');
      elem.addClass('selected');
      attachment = $('.new-post-view .picture-section .background img.picture').data('src');
      attachmentThumbnail = $('.new-post-view .picture-section .background img.picture').data('thumbnail-src');
      pic = $('.new-post-view .picture-section .background img.picture');
      fnApply = function() {
        pic.data('filter', filter);
        $('.new-post-view .picture-section .background .effects .text').html(filter === 'none' ? 'faithful' : filter);
        switch (filter) {
          case 'none':
            return _this.setPicture(attachment, attachmentThumbnail);
          case 'vintage':
            return pic.vintage({
              preset: 'default'
            });
          case 'grayscale':
            return pic.vintage({
              preset: 'grayscale'
            });
          case 'sepia':
            return pic.vintage({
              preset: 'sepia'
            });
        }
      };
      filter = elem.data('filter');
      currentFilter = pic.data('filter');
      if (filter !== 'none' && currentFilter !== 'none') {
        this.setPicture(attachment, attachmentThumbnail, {
          clearFilterSelection: false
        });
        pic = $('.new-post-view .picture-section .background img.picture');
        setTimeout(fnApply, 200);
      } else {
        fnApply();
      }
      return false;
    };

    NewPostView.prototype.onFileSelect = function() {
      var form, frame,
        _this = this;

      form = $('.upload-form');
      form.attr('action', Poe3.apiUrl("files", {
        passkey: app.passkey
      }));
      frame = $('#upload-frame');
      frame.bindNew('load', function() {
        var attachment, attachmentThumbnail;

        attachment = JSON.parse($(frame[0].contentWindow.document).text()).attachment;
        attachmentThumbnail = JSON.parse($(frame[0].contentWindow.document).text()).attachmentThumbnail;
        $('.upload-box').hide();
        return _this.setPicture(attachment, attachmentThumbnail);
      });
      return form.submit();
    };

    NewPostView.prototype.getAuthoringMode = function() {
      return $('.authoring-mode li.selected').data('value');
    };

    NewPostView.prototype.getPostType = function() {
      return $('.post-type li.selected').data('value');
    };

    NewPostView.prototype.getAttachmentType = function() {
      return $('.attachment-type li.selected').data('value');
    };

    NewPostView.prototype.updateForm = function() {
      var attachmentType, mode, postType, _ref1;

      mode = this.getAuthoringMode();
      postType = this.getPostType();
      attachmentType = this.getAttachmentType();
      if (mode === 'collaborative' && postType === 'quote') {
        $('.post-type li').removeClass('selected');
        $('.post-type li[data-value="haiku"]').addClass('selected');
        return this.updateForm();
      }
      $('.radio li[data-value="quote"]')[mode === 'collaborative' ? 'addClass' : 'removeClass']('disabled');
      if (attachmentType === 'image') {
        $('.picture-section').show();
      } else {
        $('.picture-section').hide();
      }
      this.setCreatePostHeading();
      $('.post-type-form').hide();
      $("." + postType + "-form ." + mode).show();
      $("." + postType + "-form ." + (this.otherMode(mode))).hide();
      $("." + postType + "-form").show();
      if ((_ref1 = this.currentContent) != null ? _ref1.val() : void 0) {
        $("." + postType + "-form ." + mode + " .content").val(this.currentContent.val());
      }
      this.currentContent = $("." + postType + "-form ." + mode + " .content");
      return $('button.create').html('<i class="icon-ok"></i>' + (mode === 'solo' ? 'Publish' : 'Create'));
    };

    NewPostView.prototype.otherMode = function(mode) {
      if (mode === 'solo') {
        return 'collaborative';
      } else {
        return 'solo';
      }
    };

    NewPostView.prototype.setCreatePostHeading = function() {
      var attachmentType, hasPic, postType;

      attachmentType = this.getAttachmentType();
      postType = this.getPostType();
      hasPic = attachmentType === 'image';
      return $('.create-post-section h2').html((function() {
        switch (postType) {
          case 'haiku':
            if (hasPic) {
              return 'Upload a Picture and Write some Haiku';
            } else {
              return 'Write some Haiku';
            }
            break;
          case 'free-verse':
            if (hasPic) {
              return 'Upload a Picture and Write Free-Style Poetry';
            } else {
              return 'Write Free-Style Poetry';
            }
            break;
          case 'six-word-story':
            if (hasPic) {
              return 'Upload a Picture and Write a Six-Word Story';
            } else {
              return 'Write a Six-Word Story';
            }
            break;
          case 'quote':
            if (hasPic) {
              return 'Upload a Picture and Write a Quote';
            } else {
              return 'Write a Quote';
            }
        }
      })());
    };

    NewPostView.prototype.validateContent = function(text) {
      var mode, postType;

      mode = this.getAuthoringMode();
      postType = this.getPostType();
      text = this.sanitize(text);
      if (!text) {
        this.showContentError("You haven't written anything.");
        return false;
      }
      if (mode === 'collaborative') {
        if (postType === 'haiku' && this.countLines(text) >= 3) {
          this.showContentError('In a collaborative Haiku, you cannot write more than two lines.');
          return false;
        } else if (postType === 'six-word-story' && this.countWords(text) >= 6) {
          this.showContentError('In a collaborative Six Word Story, you cannot write more than five words.');
          return false;
        }
      } else {
        if (postType === 'haiku' && this.countLines(text) !== 3) {
          this.showContentError('There should be three lines in a Haiku.');
          return false;
        } else if (postType === 'six-word-story' && this.countWords(text) !== 6) {
          this.showContentError('There should be six words in a Six Word Story.');
          return false;
        }
      }
      this.hideContentError();
      return true;
    };

    NewPostView.prototype.showContentError = function(error) {
      $('.content-error').html('<i class="icon-remove-sign"></i> ' + error);
      return $('.content-error').show();
    };

    NewPostView.prototype.hideContentError = function() {
      return $('.content-error').hide();
    };

    NewPostView.prototype.createPost = function() {
      var content, imageSrc, imgElem, params, post, postType,
        _this = this;

      if (!this.saving) {
        postType = this.getPostType();
        content = this.currentContent.val();
        if (this.validateContent(content)) {
          params = {
            type: postType,
            tags: $('input.tags').val(),
            attachmentType: this.getAttachmentType(),
            content: content,
            authoringMode: this.getAuthoringMode()
          };
          if (postType === 'free-verse' && $(".free-verse-form .title").val()) {
            params.title = $(".free-verse-form .title").val();
          }
          imgElem = $('.create-post-section .background img.picture');
          imageSrc = imgElem.attr('src');
          if (params.attachmentType && imageSrc) {
            params.attachment = imageSrc;
            params.attachmentSourceFormat = imgElem.data('filter') === 'none' ? 'url' : 'binary';
            params.attachmentThumbnail = imgElem.data('filter') === 'none' ? imgElem.data('thumbnail-src') : void 0;
            if ($('.image-credits-name').val()) {
              params.attachmentCreditsName = $('.image-credits-name').val();
              if ($('.image-credits-website').val()) {
                params.attachmentCreditsWebsite = $('.image-credits-website').val();
              }
            }
          } else {
            params.attachmentType = '';
          }
          this.saving = true;
          post = new Poe3.Post(params);
          return post.save({}, {
            success: function(model, resp) {
              new Poe3.PostView(resp.uid, {
                returnUrl: "/" + (app.getUser().domain) + "/" + (app.getUser().username)
              });
              return app.navigate("/" + resp.uid, false);
            }
          });
        }
      }
    };

    return NewPostView;

  })(Poe3.PageView);

  window.Poe3.NewPostView = NewPostView;

}).call(this);
