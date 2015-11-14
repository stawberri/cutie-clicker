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

  // Create a css rule
  var memoRuleFunctions = {};
  cc.util.cssrule = function(selector) {
    if(memoRuleFunctions[selector]) {
      return memoRuleFunctions[selector];
    } else {
      var element = $('<style>');
      var dummy = $('<div>');
      var control = $('<div>');
      $('head').append(element);
      var rules = [];

      function addRule(name, value) {
        if(value) {
          var nameValueObject = {};
          nameValueObject[name] = value;
          return addRule(nameValueObject);
        } else if($.isPlainObject(name)) {
          // Send rules
          dummy.css(name);
          // Record changed rules
          $.each(name, function(key, value) {
            if($.inArray(key, rules) == -1) {
              rules.push(key);
            }
          });

          // Update css element
          var ruleString = selector + '{';
          var value;
          $.each(rules, function(index, rule) {
            // Check if it's equivalent and store it at the same time
            if((value = dummy.css(rule)) != control.css(rule)) {
              ruleString += rule + ':' + value + ';';
            }
          });
          ruleString += '}';
          element.html(ruleString);
          return addRule;
        } else {
          return dummy.css(name);
        }
      }

      return memoRuleFunctions[selector] = addRule;
    }
  };
}();
