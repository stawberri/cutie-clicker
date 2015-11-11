!function() {
  cc.util = {};

  // Gets / Sets a LZ compressed SchemeNumber number from Rhaboo
  cc.util.rhanum = function(parent, name, value) {
    if($.type(value) === 'undefined') {
      // getter
      var number = parent[name];
      number = LZString.decompress(number);
      return number || '0';
    } else {
      // setter
      var number = SchemeNumber(value);
      number = String(number);
      number = LZString.compress(number);
      parent.write(name, number);
    }
  }
}();
