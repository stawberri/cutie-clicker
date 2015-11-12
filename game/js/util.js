// This provides general utility stuff.

!function() {
  cc.util = {};

  // Gets / Sets a LZ compressed SchemeNumber number from Rhaboo
  cc.util.rhanum = function(parent, name, value) {
    if($.type(value) === 'undefined') {
      // Getter
      var number = parent[name];

      if($.type(number) !== 'string') {
        // Something weird happened.
        return;
      }

      return LZString.decompress(number);
    } else {
      // Setter
      var number = String(value);
      number = SchemeNumber(value);
      var uncompressedNumber = number = String(number);
      number = LZString.compress(number);
      parent.write(name, number);

      // This returns number before it was compressed
      return uncompressedNumber;
    }
  }
}();
