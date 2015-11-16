// This provides general utility stuff.

!function() {
  cc.util = {};

  // Gets / Sets a LZ compressed SchemeNumber number from Rhaboo
  cc.util.rhanum = function(parent, name, value) {
    if($.type(value) === 'undefined') {
      // Getter
      var number = parent[name];

      if($.type(number) !== 'string') {
        if($.type(number) === 'number') {
          // Looks like this was stored as just a number before.
          return String(number);
        }

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
      $('head').append(element);
      var rules = {};

      function addRule(name, value) {
        if(value) {
          var nameValueObject = {};
          nameValueObject[name] = value;
          return addRule(nameValueObject);
        } else {
          // Record changed rules
          $.each(name, function(key, value) {
            if(value) {
              rules[key] = value;
            } else {
              delete rules[key];
            }
          });

          // Update css element
          var ruleString = selector + '{';
          var value;
          $.each(rules, function(rule, value) {
            ruleString += rule + ':' + value + ';';
          });
          ruleString += '}';
          element.html(ruleString);
          return addRule;
        }
      }

      return memoRuleFunctions[selector] = addRule;
    }
  };

  // Load a css file
  var loadedCss = {};
  cc.util.getcss = function(url) {
    return loadedCss[url] = loadedCss[url] || $('<link rel="stylesheet">').appendTo('head').attr('href', url);
  };
}();
