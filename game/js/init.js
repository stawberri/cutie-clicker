// Initalize cutie clicker main object
window.cc = window.cc ? cc : {};

// Create init function
cc.init = function() {
  // How many asynchronious things need to be completed?
  var pendingActions = 1;

  // This function starts the game once all the things are done
  function startGame() {
    // Decrement pendingActions and compare to 0
    if(--pendingActions <= 0) {
      $('body').load('game/cutie.html');
    }
  }


  // Pre-launch tasks:


  // Rhaboo (data storage library)
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

    startGame();
  });
};

// Run it to simplify calling code (for now)
cc.init()
