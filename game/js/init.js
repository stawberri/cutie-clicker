!function() {
  // Move people to https://cc.aideen.pw/ if they aren't already there.
  // Disabled for now since this would clear players' saves.
  // if(location.protocol != 'file:' && location.protocol + location.host != 'https:cc.aideen.pw') {
  //   location.replace('https://cc.aideen.pw' + location.pathname + location.search + location.hash)
  // }

  // Create a temporary version variable, then load real one
  var cc = {v: String($.now())};
  $.get('version.txt', {_: cc.v}, function(data) {
    cc.v = $.trim(data);
  }, 'text');

  // Create init function
  cc.init = function() {
    if(cc.init.once) return;
    cc.init.once = true;

    // Remember when we started
    var initBeginTime = $.now();

    // Keep track of pending tasks
    var pendingActions = [];

    // Make done no longer run the start check
    var disableActionCheck = false;

    // Switch site to loading mode
    $('html').addClass('loading');
    var loadingMessageIntervalId = setInterval(function() {
      // Make a new array of all the action messages
      var actionMsgs = $.map(pendingActions, function(action) {
        // If it's undefined, it just skips over this.
        return action.msg;
      });

      // Set loading message to those messages
      $('#site-game-loading').html(actionMsgs.join(' '));
    }, 100);

    // Create getScript function
    cc.getScript = function(url, callback) {
      // Add game if it's not there. Use $ to add libraries.
      if(url.search(/^\/?game\//i) < 0) {
        url = 'game/' + url;
      }

      return $.get(url, {_: cc.v}, function(data) {
        eval(data);
        if($.isFunction(callback)) {
          callback();
        }
      }, 'text');
    };

    // This function actually uses pendingActions above
    function addAction(action, readableAction, runFunction) {
      // When did this start?
      var actionBeginTime = $.now();

      // Create a default function that just returns argument
      runFunction = runFunction || function(arg) {
        return arg;
      };

      var actionRemover = function() {
        // Remove this function from array
        pendingActions.splice(pendingActions.indexOf(actionRemover), 1);

        // Calculate and record how long this action took
        // Disabled for now - too bursty.
        var actionTotalTime = $.now() - actionBeginTime;
        // ga('send', 'timing', 'game init', readableAction, actionTotalTime);

        // Are we ready to start?
        if(pendingActions.length <= 0 && !disableActionCheck) {
          // This happened once, so it can't happen again
          disableActionCheck = true;

          // Data update script. This is here because it pretty much requires everything.
          addAction('&#9853;', 'data update', function(done) { // ♽
            cc.getScript('js/update.js').done(function() {
              // Remove this item
              done();

              // Remove loading message timer thingie
              clearInterval(loadingMessageIntervalId);

              // Clear body
              $('body').html('');
              // Remove all classes from html
              $('html').removeClass();

              // Load page
              $('body').load(cc.util.l('game.html'), function() {
                cc.getScript('js/game.js').done(function() {
                  // How long did this all take?
                  var msSinceStart = $.now() - initBeginTime;

                  // Send it to Google Analytics
                  ga('send', 'timing', 'game init', 'total', msSinceStart);
                });
              });
            });
          });
        }
      }

      // Add actionRemover to pending actions
      pendingActions.push(actionRemover);

      // Set message to action parameter
      actionRemover.msg = action;
      actionRemover.internalMsg = readableAction;

      return runFunction(actionRemover);
    }
    // Make this function accessible everywhere
    cc.init.addAction = addAction;

    // Helper function because I do this a million times below
    function addScript(action, readableAction, script, library) {
      addAction(action, readableAction, function(done) {
        // Decide which getScript to use based on whether or not this is an external library
        (library ? $ : cc).getScript(script).done(done);
      });
    }
    // Make this accessible everywhere as well
    cc.init.addScript = addScript;

    // This action ensures that all actions have time to start
    addAction('&#9852;', 'action launcher', function(done) { // ♼

      // Existing instance checker
      addAction('&#10063;', 'instance checker', function(done) { // ❏
        // Allow code below to run too
        setTimeout(function() {
          // Use this method of "checking" to see if localStorage works
          try {
            // Retrieve opposite of flag
            var flag = window.localStorage.getItem('cc-instchk') || '0';
            flag = flag == '0' ? '1' : '0';
            // Update flag
            window.localStorage.setItem('cc-instchk', flag);

            // Watch flag for changes
            $(window).on('storage', function(ev) {
              if(ev.originalEvent.key == 'cc-instchk' && ev.originalEvent.storageArea == window.localStorage) {
                // It changed! Exit!
                window.location = 'about:blank';
              }
            });

            done();
          } catch(e) {
            // Looks like it failed, and there's no need to check for multiple instances.
            done();
          }
        }, 0);
      });

      // This file is for loading blocking, "Cutie Clicker will not work at all without these" scripts. Non-critical scripts go into index.js

      // lz-string (data compression library)
      addScript('&#11075;', 'lz-string', 'lib/lz-string.2015.11.9.js', true); // ⭃

      // Rhaboo (data storage library)
      addScript('&#9923;', 'rhaboo', 'lib/rhaboo.2015.11.8.js', true); // ⛃

      // schemeNumber (accurate numbers library)
      addScript('&#9320;', 'schemeNumber', 'lib/schemeNumber.2015.11.9.js', true); // ⑨

      // cc.util
      addScript('&#9939;', 'cc.util', 'js/util.js'); // ⛓

      // cc.stats
      addScript('&#127918;', 'cc.stats', 'js/stats.js'); // 🎮

      // cc.cuties
      addScript('&#9829;', 'cc.cuties', 'js/cuties.js') // ♥

      done();
    });
  };

  // Register jquery ajax handler for analytics
  // $(document).ajaxSend(function(ev, jqxhr, options) {
  //   // Local root address converter for analytics
  //   function localRoot(url) {
  //     // This filters out non-local addresses
  //     if(url.search(/(?:\w+:)?\/\//i) != -1) {
  //       return;
  //     }

  //     // Add a slash to the beginning if necessary.
  //     // This assumes all urls are relative to root (they should be).
  //     return (url.charAt(0) == '/') ? url : '/' + url;
  //   };

  //   var localUrl = localRoot(options.url);
  //   if(localUrl) {
  //     // Only track .html files (prevent bursting)
  //     if(localUrl.search(/\.html(?:[#?].*)?$/i) != -1) {
  //       ga('send', 'pageview', localUrl);
  //     }
  //   }
  // });

  // Make cc global for debugging
  if(location.protocol == 'file:') {
    cc.f = true;
    window.cc = cc;
  }

  // Go!
  cc.init();
}();
