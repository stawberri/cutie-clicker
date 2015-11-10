!function() {

  // Duct taped together simple clicker game
  var clicker = $('#cutie-clicker');
  var cutie = $('#cutie');

  var clickstart = function() {
    cutie.addClass('clicked');

    // Load clicks
    var clicks = SchemeNumber(cc.ls.d.clicks ? LZString.decompress(cc.ls.d.clicks) : 1);
    // Add one
    clicks = SchemeNumber.fn['+'](clicks, '1');
    // Convert it to a string
    clicks = String(clicks);

    // Update click counter
    $('#click-counter').html(clicks);

    // Update data
    cc.ls.d.write('clicks', LZString.compress(clicks));
  };
  // populate click counter
  $('#click-counter').html(cc.ls.d.clicks ? String(SchemeNumber(LZString.decompress(cc.ls.d.clicks))) : 0);

  var clickend = function() {
    cutie.removeClass('clicked');
  };

  clicker.on('touchstart', clickstart);
  clicker.on('mousedown', clickstart);

  clicker.on('touchend', clickend);
  clicker.on('mouseup', clickend);

}();
