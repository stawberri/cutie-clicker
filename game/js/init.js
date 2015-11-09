// Initalize cutie clicker main object
window.cc = window.cc ? cc : {};

!function() {

  // Create init function
  cc.init = function() {
    // Keep track of pending tasks
    var pendingActions = [];
    function addAction(action) {
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

      return actionRemover;
    }

    // Create action to ensure this function has time to finsih running
    var doneWithThisFunction = addAction('&#10003;'); // ✓

    // Pre-launch tasks:



    // Rhaboo (data storage library)
    var rhabooDone = addAction('&#9923;'); // ⛃
    $.getScript('lib/rhaboo.min.js').done(function() {
      // Create localStorage and sessionStorage data (respectively)
      cc.ls = Rhaboo.persistent('cc-ls');
      cc.ss = Rhaboo.perishable('cc-ss');

      // Check localStorage version
      switch(cc.ls.v) {
        default:
          cc.ls.write('d', {})

          cc.ls.write('v', 1);
        case 1:
      }

      // Check sessionStorage version
      switch(cc.ss.v) {
        default:
          cc.ss.write('d', {})

          cc.ss.write('v', 1);
        case 1:
      }

      rhabooDone();
    });

    // All tasks complete
    doneWithThisFunction();
  };

  // Run it to simplify calling code (for now)
  cc.init()

}();
