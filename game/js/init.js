// Initalize cutie clicker main object
window.cc = window.cc ? cc : {};

// Create init function
cc.init = function() {
  // Empty out body to remove JavaScript disabled message (for now)
  $('body').html('');

  // Start game!
  $('body').load('game/cutie.html');
};

// Run it to simplify calling code (for now)
cc.init()
