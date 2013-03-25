// Generated by CoffeeScript 1.6.2
(function() {
  var TagListViewItem,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  TagListViewItem = (function(_super) {
    __extends(TagListViewItem, _super);

    function TagListViewItem(model, containerPrefix, fnAppend, fnOnAsyncWidgetLoad, fnOnSyncWidgetLoad, getCoverPost) {
      this.model = model;
      this.containerPrefix = containerPrefix;
      this.fnAppend = fnAppend;
      this.fnOnAsyncWidgetLoad = fnOnAsyncWidgetLoad;
      this.fnOnSyncWidgetLoad = fnOnSyncWidgetLoad;
      this.getCoverPost = getCoverPost;
      this.attachEvents = __bind(this.attachEvents, this);
      this.render = __bind(this.render, this);
      TagListViewItem.__super__.constructor.call(this);
      this.render();
    }

    TagListViewItem.prototype.render = function() {
      var html,
        _this = this;

      this.mainPost = this.getCoverPost(this.model.posts);
      this.model.content = this.mainPost.formatAsIcon();
      this.model.stacktype = ['stacktwo', 'stackthree', 'stackfour'][parseInt(Math.random() * 3)];
      this.model.containerPrefix = this.containerPrefix;
      html = this.template(this.model);
      this.fnAppend(html);
      if (this.mainPost.get('attachmentType') === 'image') {
        $("#" + this.containerPrefix + "-posts-by-tag-" + this.model.tag).imagesLoaded(function() {
          return _this.fnOnAsyncWidgetLoad(_this.model);
        });
      } else {
        this.fnOnSyncWidgetLoad(this.model);
      }
      this.attachEvents();
      return this.onRenderComplete("#" + this.containerPrefix + "-posts-by-tag-" + this.model.tag);
    };

    TagListViewItem.prototype.attachEvents = function() {
      var _this = this;

      return $(document).bindNew("click", "#" + this.containerPrefix + "-posts-by-tag-" + this.model.tag, function() {
        app.navigate("/" + (_this.mainPost.get('createdBy').domain) + "/" + (_this.mainPost.get('createdBy').username) + "/tagged/" + _this.model.tag, false);
        return new Poe3.PostView({
          mode: 'gallery',
          data: {
            posts: _this.model.posts
          }
        });
      });
    };

    return TagListViewItem;

  })(Poe3.BaseView);

  window.Poe3.TagListViewItem = TagListViewItem;

}).call(this);
