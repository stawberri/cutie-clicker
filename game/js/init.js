// Initalize cutie clicker main object
window.cc = window.cc ? cc : {};

!function() {

  // Create init function
  cc.init = function() {
    // Keep track of pending tasks
    var pendingActions = [];
    function addAction(action, runFunction) {
      // Create a default function that just returns argument
      runFunction = runFunction || function(arg) {
        return arg;
      };

      var actionRemover = function() {
        // Remove this function from array
        pendingActions.splice(pendingActions.indexOf(actionRemover), 1);

        // Are we ready to start?
        if(pendingActions.length <= 0) {
          $('body').load('game/cutie.html');
        }
      }

      // Add actionRemover to pending actions
      pendingActions.push(actionRemover);

      // Set actionName to action parameter
      actionRemover.actionName = action;

      return runFunction(actionRemover);
    }

    // This action ensures that all actions have time to start
    addAction('&#10003;', function(done) { // ✓

      // Existing instance checker -- not async, so blocks execution of stuff below
      addAction('&#10063;', function(done) { // ❏
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
      });

      // lz-string (data compression library)
      addAction('&#11075;', function(done) { // ⭃
        $.getScript('lib/lz-string.min.js').done(function() {

          // Rhaboo (data storage library)
          addAction('&#9923;', function(done) { // ⛃
            $.getScript('lib/rhaboo.min.js').done(function() {
              // Create localStorage and sessionStorage data (respectively)
              cc.ls = Rhaboo.persistent('cc-ls');
              cc.ss = Rhaboo.perishable('cc-ss');

              // Data update script
              addAction('&#9850;', function(done) { // ♺
                $.getScript('game/js/update.js').done(function() {
                  done();
                });
              });

              done();
            });
          });

          done();
        });
      });



      done();
    });
  };

}();

// Run it to simplify calling code (for now)
cc.init()
