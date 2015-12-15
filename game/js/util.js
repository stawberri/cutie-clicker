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
          if(element.html() != ruleString) {
            element.html(ruleString);
          }
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

  // Transfer mouse events over to cutie-clicker
  cc.util.transferclicks = function(element) {
    $(element).on('mousedown mouseup touchstart touchend', function(ev) {
      $('#cutie-clicker').trigger(ev.type);
    });
  }

  // Rhanum, but for incrementing numbers
  cc.util.rhainc = function(parent, name, inc) {
    // If inc isn't a string, turn it into one. If it's missing, make it 1.
    if($.type(inc) === 'undefined') {
      inc = '1';
    } else {
      inc = String(inc);
    }

    // Calculate increment
    var value = cc.util.rhanum(parent, name) || '0';
    value = SchemeNumber.fn['+'](value, inc);

    // Save value
    cc.util.rhanum(parent, name, value);
  }

  // Shuffle an array
  // Fisher-Yates (aka Knuth) Shuffle
  cc.util.shuffle = function(array) {
    var m = array.length, t, i;

    // While there remain elements to shuffle…
    while (m) {

      // Pick a remaining element…
      i = Math.floor(Math.random() * m--);

      // And swap it with the current element.
      t = array[m];
      array[m] = array[i];
      array[i] = t;
    }

    return array;
  }

  // Time String generator
  cc.util.timeString = function(time) {
    var ms = time % 1000;
    time = Math.floor(time / 1000);
    var s = time % 60;
    time = Math.floor(time / 60);
    var m = time % 60;
    time = Math.floor(time / 60);
    var h = time;

    // How much do we need to display?
    if(h > 0) {
      // Display hours, minutes (2 digits), and seconds (2 digits)
      return h + ':' + ('0' + m).slice(-2) + ':' + ('0' + s).slice(-2);
    } else if(m > 0) {
      // Display minutes and seconds (two digits)
      return m + ':' + ('0' + s).slice(-2);
    } else if(s > 0) {
      // Display seconds and ms
      return (s + (ms / 1000)).toFixed(2);
    } else {
      // Just display ms
      return ms;
    }
  }
}();
