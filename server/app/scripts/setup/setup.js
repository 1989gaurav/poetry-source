// Generated by CoffeeScript 1.6.2
(function() {
  var HOST, PORT, async, conf, data, database, dbconf, doHttpRequest, http, init, querystring, utils,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  async = require('../../common/async');

  utils = require('../../common/utils');

  querystring = require('querystring');

  http = require('http');

  data = require('./data');

  conf = require('../../conf');

  dbconf = {
    db: {
      name: 'poetry-db-dev',
      host: '127.0.0.1'
    }
  };

  database = new (require('../../common/database')).Database(dbconf.db);

  console.log("Setup started at " + (new Date));

  console.log("NODE_ENV is " + process.env.NODE_ENV);

  console.log("Setup will connect to database " + dbconf.db.name + " on " + dbconf.db.host);

  HOST = 'scribble.poe3.com';

  PORT = '80';

  if (process.env.NODE_ENV !== 'development') {
    console.log('Setup can only be run in development.');
    process.exit();
  }

  if (HOST !== 'scribble.poe3.com') {
    console.log('HOST should be local.');
    process.exit();
  }

  init = function() {
    var completePost, completePostTasks, createPart, createPost, createPostTasks, createUser, createUserTasks, followUsers, followUsersTasks, getPartName, getPostName, likePosts, likePostsTasks, post, selectPart, tasks, unfollowUsers, unfollowUsersTasks, unlikePosts, unlikePostsTasks, user, _fn, _fn1, _globals, _i, _j, _len, _len1, _ref, _ref1;

    _globals = {};
    if (__indexOf.call(process.argv, '--delete') >= 0) {
      return database.getDb(function(err, db) {
        console.log('Deleting main database.');
        return db.dropDatabase(function(err, result) {
          console.log('Everything is gone now.');
          return process.exit();
        });
      });
    } else if (__indexOf.call(process.argv, '--create') >= 0) {
      console.log('This script will setup basic data. Calls the latest HTTP API.');
      getPostName = function(post) {
        return post.parts[0].content.split('\n')[0];
      };
      getPartName = function(part) {
        return part.content.split('\n')[0];
      };
      _globals.sessions = {};
      createUser = function(user, cb) {
        console.log("Creating " + user.username + "...");
        user.domain = 'poets';
        user.secret = conf.auth.adminkeys["default"];
        return doHttpRequest('/api/v1/sessions', querystring.stringify(user), 'post', function(err, resp) {
          console.log("Created " + resp.username);
          _globals.sessions[user.username] = resp;
          return cb();
        });
      };
      createUserTasks = [];
      _ref = data.users;
      _fn = function(user) {
        return createUserTasks.push(function(cb) {
          return createUser(user, cb);
        });
      };
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        user = _ref[_i];
        _fn(user);
      }
      _globals.posts = [];
      createPost = function(_post, cb) {
        var passkey, post, _ref1;

        passkey = _globals.sessions[_post.user].passkey;
        console.log("Creating a new post with passkey(" + passkey + ")....");
        post = utils.clone(_post);
        post.content = _post.parts[0].content;
        if ((_ref1 = post.attachmentType) == null) {
          post.attachmentType = '';
        }
        post.authoringMode = _post.parts.length > 1 ? 'collaborative' : 'solo';
        delete post.user;
        delete post.parts;
        return doHttpRequest("/api/v1/posts/?passkey=" + passkey, querystring.stringify(post), 'post', function(err, savedPost) {
          var addPartTasks, otherParts, part, _fn1, _j, _len1;

          console.log("Created post: " + (getPostName(savedPost)) + "...");
          _globals.posts.push(savedPost);
          if (post.authoringMode === 'collaborative') {
            otherParts = _post.parts.slice(1);
            addPartTasks = [];
            _fn1 = function(part) {
              return addPartTasks.push(function(cb) {
                return createPart(part, savedPost._id, function(err, post) {
                  return selectPart(savedPost._id, post.parts.pop().id, passkey, cb);
                });
              });
            };
            for (_j = 0, _len1 = otherParts.length; _j < _len1; _j++) {
              part = otherParts[_j];
              _fn1(part);
            }
            return async.series(addPartTasks, cb);
          } else {
            return cb();
          }
        });
      };
      createPart = function(_part, postid, cb) {
        var part, passkey;

        passkey = _globals.sessions[_part.user].passkey;
        part = utils.clone(_part);
        delete part.user;
        console.log("Creating part(" + (getPartName(part)) + ") for post " + postid + " with passkey(" + passkey + ")....");
        return doHttpRequest("/api/v1/posts/" + postid + "/parts?passkey=" + passkey, querystring.stringify(part), 'post', function(err, resp) {
          console.log("Added part.");
          return cb(err, resp);
        });
      };
      selectPart = function(postid, partid, passkey, cb) {
        console.log("Selecting part(" + partid + ") in post(" + postid + ").");
        return doHttpRequest("/api/v1/posts/" + postid + "/selectedParts?passkey=" + passkey, querystring.stringify({
          id: partid
        }), 'post', function(err, resp) {
          console.log("Selected part.");
          return cb();
        });
      };
      createPostTasks = [];
      _ref1 = data.posts;
      _fn1 = function(post) {
        return createPostTasks.push(function(cb) {
          return createPost(post, cb);
        });
      };
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        post = _ref1[_j];
        _fn1(post);
      }
      completePost = function(passkey, postid, cb) {
        console.log("Completing post(" + postid + ").");
        return doHttpRequest("/api/v1/posts/" + postid + "/state?passkey=" + passkey, querystring.stringify({
          value: 'complete'
        }), 'put', function(err, _r) {
          console.log("Completed post.");
          return cb();
        });
      };
      completePostTasks = [];
      completePostTasks.push(function(cb) {
        var tasks, _fn2, _k, _len2, _ref2;

        tasks = [];
        _ref2 = _globals.posts;
        _fn2 = function(post) {
          var passkey;

          if (post.state !== 'complete') {
            passkey = _globals.sessions[post.createdBy.username].passkey;
            return tasks.push(function(cb) {
              return completePost(passkey, post._id, cb);
            });
          }
        };
        for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
          post = _ref2[_k];
          _fn2(post);
        }
        return async.series(tasks, cb);
      });
      followUsers = function(list, user, cb) {
        var following, passkey, tasks, _fn2, _k, _len2;

        passkey = _globals.sessions[user].passkey;
        tasks = [];
        _fn2 = function(following) {
          var followingid;

          followingid = _globals.sessions[following].userid;
          return tasks.push(function(cb) {
            console.log("Following " + following + "(" + followingid + ") with passkey(" + passkey + ")....");
            return doHttpRequest("/api/v1/users/" + followingid + "/followers?passkey=" + passkey, null, 'post', function(err, resp) {
              console.log("" + user + " followed " + following);
              return cb();
            });
          });
        };
        for (_k = 0, _len2 = list.length; _k < _len2; _k++) {
          following = list[_k];
          _fn2(following);
        }
        return async.series(tasks, cb);
      };
      unfollowUsers = function(list, user, cb) {
        var following, passkey, tasks, userid, _fn2, _k, _len2;

        passkey = _globals.sessions[user].passkey;
        userid = _globals.sessions[user].userid;
        tasks = [];
        _fn2 = function(following) {
          var followingid;

          followingid = _globals.sessions[following].userid;
          return tasks.push(function(cb) {
            console.log("Unfollowing " + following + "(" + followingid + ") with passkey(" + passkey + ")....");
            return doHttpRequest("/api/v1/users/" + followingid + "/followers/" + userid + "?passkey=" + passkey, null, 'delete', function(err, resp) {
              console.log("" + user + " unfollowed " + following);
              return cb();
            });
          });
        };
        for (_k = 0, _len2 = list.length; _k < _len2; _k++) {
          following = list[_k];
          _fn2(following);
        }
        return async.series(tasks, cb);
      };
      followUsersTasks = [];
      followUsersTasks.push(function(cb) {
        return followUsers(['buson', 'issa', 'shiki', 'hemingway'], 'basho', cb);
      });
      followUsersTasks.push(function(cb) {
        return followUsers(['basho', 'issa', 'shiki'], 'buson', cb);
      });
      followUsersTasks.push(function(cb) {
        return followUsers(['basho', 'buson', 'shiki'], 'issa', cb);
      });
      followUsersTasks.push(function(cb) {
        return followUsers(['basho', 'buson', 'issa'], 'shiki', cb);
      });
      followUsersTasks.push(function(cb) {
        return followUsers(['basho', 'buson', 'issa', 'shiki'], 'hemingway', cb);
      });
      unfollowUsersTasks = [];
      unfollowUsersTasks.push(function(cb) {
        return unfollowUsers(['buson', 'issa'], 'shiki', cb);
      });
      likePosts = function(list, user, cb) {
        var passkey, postid, tasks, userid, _fn2, _k, _len2;

        userid = _globals.sessions[user].userid;
        passkey = _globals.sessions[user].passkey;
        tasks = [];
        _fn2 = function(postid) {
          return tasks.push(function(cb) {
            console.log("" + user + "(" + userid + ") liking post(" + postid + ")....");
            return doHttpRequest("/api/v1/posts/" + postid + "/like?passkey=" + passkey, null, 'put', function(err, resp) {
              console.log("" + user + " liked " + postid);
              return cb();
            });
          });
        };
        for (_k = 0, _len2 = list.length; _k < _len2; _k++) {
          postid = list[_k];
          _fn2(postid);
        }
        return async.series(tasks, cb);
      };
      unlikePosts = function(list, user, cb) {
        var passkey, postid, tasks, userid, _fn2, _k, _len2;

        userid = _globals.sessions[user].userid;
        passkey = _globals.sessions[user].passkey;
        tasks = [];
        _fn2 = function(postid) {
          return tasks.push(function(cb) {
            console.log("" + user + "(" + userid + ") unliking post(" + postid + ")....");
            return doHttpRequest("/api/v1/posts/" + postid + "/like?passkey=" + passkey, null, 'delete', function(err, resp) {
              console.log("" + user + " unliked " + postid);
              return cb();
            });
          });
        };
        for (_k = 0, _len2 = list.length; _k < _len2; _k++) {
          postid = list[_k];
          _fn2(postid);
        }
        return async.series(tasks, cb);
      };
      likePostsTasks = [];
      likePostsTasks.push(function(cb) {
        var postids, _k, _len2, _ref2;

        postids = [];
        _ref2 = _globals.posts;
        for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
          post = _ref2[_k];
          if (post.createdBy.username === 'basho' || post.createdBy.username === 'hemingway') {
            postids.push(post._id);
          }
        }
        return likePosts(postids, 'shiki', cb);
      });
      unlikePostsTasks = [];
      unlikePostsTasks.push(function(cb) {
        var i, postids, _k, _len2, _ref2;

        postids = [];
        _ref2 = _globals.posts;
        for (i = _k = 0, _len2 = _ref2.length; _k < _len2; i = ++_k) {
          post = _ref2[i];
          if (post.createdBy.username === 'basho' && (i % 3 === 0)) {
            postids.push(post._id);
          }
        }
        return unlikePosts(postids, 'shiki', cb);
      });
      tasks = function() {
        return async.series(createUserTasks, function() {
          console.log('Created users.');
          return async.series(createPostTasks, function() {
            console.log('Created posts.');
            return async.series(completePostTasks, function() {
              console.log('Completed posts.');
              return async.series(followUsersTasks, function() {
                console.log('Followed users.');
                return async.series(unfollowUsersTasks, function() {
                  console.log('Unfollowed users.');
                  return async.series(likePostsTasks, function() {
                    console.log('Liked posts.');
                    return async.series(unlikePostsTasks, function() {
                      console.log('Unliked posts.');
                      return console.log('Setup complete.');
                    });
                  });
                });
              });
            });
          });
        });
      };
      console.log('Setup will begin in 3 seconds.');
      return setTimeout(tasks, 1000);
    } else {
      console.log('Invalid option.');
      return process.exit();
    }
  };

  doHttpRequest = function(url, data, method, cb) {
    var options, req, response;

    options = {
      host: HOST,
      port: PORT,
      path: url,
      method: method,
      headers: data ? {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': data.length
      } : {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': 0
      }
    };
    response = '';
    req = http.request(options, function(res) {
      res.setEncoding('utf8');
      res.on('data', function(chunk) {
        return response += chunk;
      });
      return res.on('end', function() {
        return cb(null, JSON.parse(response));
      });
    });
    if (data) {
      req.write(data);
    }
    return req.end();
  };

  init();

}).call(this);
