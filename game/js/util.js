!function() {
  cc.util = {};

  // Gets / Sets a LZ compressed SchemeNumber number from Rhaboo
  cc.util.rhanum = function(parent, name, value) {
    if($.type(value) === 'undefined') {
      // Getter
      var number = parent[name];
      number = LZString.decompress(number);
      return number || '0';
    } else {
      // Setter
      var number = SchemeNumber(value);
      var returnValue = number = String(number);
      number = LZString.compress(number);
      parent.write(name, number);

      // This returns the string before it was compressed
      return returnValue;
    }
  }
}();
