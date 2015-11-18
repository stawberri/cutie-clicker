$.get('version.txt', {_: $.now()}, function(d) {
  var cc = {
    v: $.trim(d),
    getScript: function(s, c) {
      return $.get(s, {_: cc.v}, function(d) {
        eval(d);
        c&&c();
      }, 'text');
    }
  }
  cc.getScript('game/js/init.js');
  if(location.protocol == 'file:') {
    window.cc = cc;
  }
}, 'text');
