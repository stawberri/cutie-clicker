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

  // Gets rid of caching and adds 'game/' to the front of url if it's not already there so I can stop typing it
  cc.util.l = function(url) {
    if(url.search(/^\/?game\//i) < 0) {
      // Need to add game
      url = 'game/' + url;
    }

    if(url.search(/ /) < 0) {
      // No spaces. Add a ? or a ; intelligently.
      return url + ((url.search(/\?/) < 0) ? '?' : ';') + '_=' + cc.v;
    } else {
      // There's a space.
      return url.replace(/ /, ((url.search(/\?/) < 0) ? '?' : ';') + '_=' + cc.v + ' ');
    }
  }

  // Load a css file
  var loadedCss = {};
  cc.util.getcss = function(url) {
    // Disable caching (add ? or ; on based on whether there's already a ? or not)
    return loadedCss[url] = loadedCss[url] || $('<link rel="stylesheet">').appendTo('head').attr('href', cc.util.l(url));
  };
}();
