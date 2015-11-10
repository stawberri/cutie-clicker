// Initalize cutie clicker main object
window.cc = window.cc ? cc : {};

!function() {

  // Create init function
  cc.init = function() {
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

    // This function actually uses pendingActions above
    function addAction(action, runFunction) {
      // Create a default function that just returns argument
      runFunction = runFunction || function(arg) {
        return arg;
      };

      var actionRemover = function() {
        // Remove this function from array
        pendingActions.splice(pendingActions.indexOf(actionRemover), 1);

        // Are we ready to start?
        if(pendingActions.length <= 0 && !disableActionCheck) {
          // This happened once, so it can't happen again
          disableActionCheck = true;

          // Data update script. This is here because it pretty much requires everything.
          addAction('&#9853;', function(done) { // ♽
            $.getScript('game/js/update.js').done(function() {
              // Remove this item
              done();

              // Remove loading message timer thingie
              clearInterval(loadingMessageIntervalId);

              // Clear body
              $('body').html('');
              // Remove all classes from html
              $('html').removeClass();

              // Load page
              $('body').load('game/cutie.html');
            });
          });
        }
      }
      // Make this function accessible everywhere
      cc.init.addAction = function(action, runFunction) {
        return addAction(action, runFunction);
      }

      // Add actionRemover to pending actions
      pendingActions.push(actionRemover);

      // Set message to action parameter
      actionRemover.msg = action;

      return runFunction(actionRemover);
    }

    // This action ensures that all actions have time to start
    addAction('&#9852;', function(done) { // ♼

      // Existing instance checker
      addAction('&#10063;', function(done) { // ❏
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
              console.log(ev.key);
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

      // lz-string (data compression library)
      addAction('&#11075;', function(done) { // ⭃
        $.getScript('lib/lz-string.min.js').done(done);
      });

      // Rhaboo (data storage library)
      addAction('&#9923;', function(done) { // ⛃
        $.getScript('lib/rhaboo.min.js').done(done);
      });

      // schemeNumber (accurate numbers library)
      addAction('&#9320;', function(done) { // ⑨
        $.getScript('lib/schemeNumber.min.js').done(done);
      });

      done();
    });
  };

}();

// Run it to simplify calling code (for now)
cc.init()
