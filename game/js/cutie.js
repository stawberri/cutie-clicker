!function() {
  // Duct taped together simple clicker game
  var clicker = $('#cutie-clicker');
  var cutie = $('#cutie');

  var clickstart = function() {
    cutie.addClass('clicked');

    // Update click counter and display
    var clicksPlusOne = String(SchemeNumber.fn['+'](cc.util.rhanum(cc.ls.d, 'clicks'), '1'));
    $('#click-counter').html(clicksPlusOne);
    cc.util.rhanum(cc.ls.d, 'clicks', clicksPlusOne);
  };
  // populate click counter
  $('#click-counter').html(cc.util.rhanum(cc.ls.d, 'clicks'));

  var clickend = function() {
    cutie.removeClass('clicked');
  };

  clicker.on('touchstart', clickstart);
  clicker.on('mousedown', clickstart);

  clicker.on('touchend', clickend);
  clicker.on('mouseup', clickend);

}();
