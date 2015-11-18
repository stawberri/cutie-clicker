!function() {
  // Create cutie clicker main object containing a getScript that evals code in this scope.
  var cc = {
    getScript: function(script, callback) {
      return $.get(script, undefined, function(data) {
        eval(data);
        if($.isFunction(callback)) {
          callback();
        }
      }, 'text');
    }
  };

  // Start game
  cc.getScript('game/js/init.js?cc-time=' + $.now());

  // Allow file urls to access cc
  if(location.protocol == 'file:') {
    window.cc = cc;
  }
}();
