// This script works with manipulating and accessing cutie data

!function() {
  // Default starter cutie
  var starterCutie = {
    cutie: '77'
  }

  // Cutie creation function
  var loadingCuties = {};
  cc.cuties = function(dataIndex, callback) {
    var cutieData = cc.cuties.list();

    // Check lower bound
    if(dataIndex < 0) {
      return;
    }

    // Need to make a starter cutie?
    if(dataIndex == 0 && cutieData.length == 0) {
      return cc.cuties(cc.cuties.add(starterCutie), callback);
    }

    // Check upper bound
    if(dataIndex >= cutieData.length) {
      return;
    }

    var dataObject = cutieData[dataIndex];
    var cutieType = dataObject.cutie;

    if($.isFunction(callback)) {

      function cutieProcessor() {
        var cutieBase = cc.cuties[cutieType];

        // Create a proto on cutieBase with cc.cuties.proto, or use a previously created one
        cutieBase.proto = cutieBase.proto || $.extend(Object.create(cc.cuties.proto), cutieBase.prototype);
        var cutie = $.extend(Object.create(cutieBase.proto), {constructor: cutieBase});
        cc.cuties.construct.call(cutie, dataObject);
        cutie.constructor.call(cutie, dataObject);

        // These are only really good to be used as private variables. Too risky otherwise.
        cutie.data = dataObject;
        cutie.base = cutieBase;

        callback(cutie);
      }

      if($.type(cc.cuties[cutieType]) !== 'undefined') {
        // Run callback synchroniously if possible
        cutieProcessor();
      } else {
        // Start loading if it hasn't already.
        if(!loadingCuties[cutieType]) {
          // It hasn't, so load it
          loadingCuties[cutieType] = $.Deferred();
          cc.getScript('cuties/' + cutieType + '/cutie.js').done(function() {
            // Resolve deferred.
            loadingCuties[cutieType].resolve();
          });
        }
        // Add this function's cutieProcessor.
        loadingCuties[cutieType].done(cutieProcessor);
      }
    }

    return cutieType;
  };

  // This is a function instead of a variable because we can't access data when this is being run
  function data() {
    return cc.ls.d.cuties || cc.ls.d.write('cuties', {}).cuties;
  }

  // Grab list from data, or create list and return it if it doesn't exist yet.
  cc.cuties.list = function() {
    return data().list || data().write('list', []).list;
  }

  // Keep track of when list was changed.
  // Not contents of list, but list itself.
  cc.cuties.listTime = $.now();

  // Add a cutie to data
  cc.cuties.add = function(cutie, options) {
    // allow passing in only options
    if($.type(cutie) === 'object') {
      options = cutie;
    } else {
      options = options || {};
      options.cutie = String(cutie);
    }

    if(!options.cutie) {
      return false;
    }

    var newIndex = cc.cuties.list().length;

    cc.cuties.list().write(newIndex, options);
    cc.cuties.listTime = $.now();

    // Add to total cuties
    cc.util.rhainc(cc.ls.d, 'totalCuties');

    // Add to cutie count
    // Since this creates the cutie stats object for this cutie, we can assume that it's always defined
    var cutieStats = cc.ls.d.cutieStats || cc.ls.d.write('cutieStats', {}).cutieStats;
    var cutieStat = cutieStats[options.cutie] || cutieStats.write(options.cutie, {})[options.cutie];
    cc.util.rhainc(cutieStat, 'count');

    // Return cutie index
    return newIndex;
  }

  // Fix deleted indices
  function fixDeletedIndex(deletedIndex, indexToFix) {
      if(indexToFix < deletedIndex) {
        // Index to fix comes before deleted index
        return indexToFix;
      } else if (indexToFix > deletedIndex) {
        // Removed a cutie that comes before current cutie
        return indexToFix - 1;
      } else {
        // Removed this cutie.
        return;
      }
  }

  // Remove a cute from data
  cc.cuties.remove = function(index) {
    var numCuties = cc.cuties.list().length;
    // Bounds check
    if(index < 0 || index >= numCuties) {
      return;
    }

    // Don't allow deleting last cutie
    if(numCuties < 2) {
      return false;
    }

    // This is the easy part
    cc.cuties.list().splice(index, 1);
    cc.cuties.listTime = $.now();

    // Check current() list and decrement (or remove) if necessary
    $.each(current(), function(currentIndex, currentValue) {
      current().write(currentIndex, fixDeletedIndex(index, currentValue));
    });

    // Check selections and do the same thing for each selection
    $.each(cc.cuties.selections(), function(selectionKey, selectionArray) {
      var toSplice = [];
      $.each(selectionArray, function(currentIndex, currentValue) {
        var fixedIndex = fixDeletedIndex(index, currentValue);
        if($.type(fixedIndex) === 'undefined') {
          // Cutie was removed
          toSplice.push(currentIndex);
        } else {
          // It's fine.
          selectionArray.write(currentIndex, fixedIndex);
        }
      });

      // Remove removed cuties
      $.each(toSplice, function(spliceIndex, spliceValue) {
        selectionArray.splice(spliceValue, 1);
      });
    });

    // If burst object exists, that needs to be fixed as well, but creating a completely new object, annoyingly
    if(cc.ls.d.burst) {
      var newBurst = {};
      $.each(cc.ls.d.burst, function(key, value) {
        var fixedIndex = fixDeletedIndex(index, Number(key));
        if($.type(fixedIndex) !== 'undefined') {
          // Only bother adding new cutie in if it wasn't removed.
          var newKey = String(fixDeletedIndex(index, Number(key)));
          newBurst[newKey] = value;
        }
      });
      cc.ls.d.write('burst', newBurst);
    }
  }

  // Selections object
  // Contains arrays that are meant for selecting groups of cuties.
  cc.cuties.selections = function() {
    return data().selections || data().write('selections', {}).selections;
  }

    // Get or set a selection.
    cc.cuties.selection = function(name, reset) {
      var selection;

      if(reset) {
        switch($.type(reset)) {
          default:
            cc.cuties.selections().erase(name);
            return;
          break;

          case 'number':
            reset = [reset];
          case 'array':
          break;
        }

        selection = cc.cuties.selections().write(name, reset)[name];
      } else {
        selection = cc.cuties.selections()[name] || cc.cuties.selections().write(name, [])[name];
      }

      return selection;
    }

  // Equip functions

    // Grab current array
    function current() {
      return data().current || data().write('current', []).current;
    }

    // Left and Right cuties are pretty simple
    cc.cuties.l = function(index, callback) {
      if($.type(index) === 'function') {
        // Called with only a callback
        callback = index;
      } else if($.type(index) !== 'undefined') {
        // Setter
        if(index === null) {
          // If index is null, skip other checks.
        } else if(current()[0] === index) {
          // Mid has the same cutie
          return false;
        } else if(current()[2] === index) {
          // Right has same cutie. Remove right cutie.
          cc.cuties.r(null);
        }
        current().write(1, index);
      }
      if($.type(current()[1]) === 'number') return cc.cuties(current()[1], callback);
    }
    cc.cuties.r = function(index, callback) {
      if($.type(index) === 'function') {
        // Called with only a callback
        callback = index;
      } else if($.type(index) !== 'undefined') {
        // Setter
        if(index === null) {
          // If index is null, skip other checks.
        } else if(current()[0] === index) {
          // Mid has the same cutie
          return false;
        } else if(current()[1] === index) {
          // Left has same cutie. Remove left cutie.
          cc.cuties.l(null);
        }
        current().write(2, index);
      }
      if($.type(current()[2]) === 'number') return cc.cuties(current()[2], callback);
    }

    // Middle is a little more complex
    cc.cuties.m = function(index, callback) {
      if($.type(index) === 'function') {
        // Called with only a callback
        callback = index;
      } else if($.type(index) !== 'undefined') {
        // Setter
        if(index === null) {
          // If index is null, skip other checks.
        } else if(current()[1] === index) {
          // Left has same cutie. Remove left cutie.
          cc.cuties.l(null);
        } else if(current()[2] === index) {
          // Right has same cutie. Remove right cutie.
          cc.cuties.r(null);
        }
        current().write(0, index);
      }

      if($.type(current()[0]) === 'number') {
        return cc.cuties(current()[0], callback);
      } else {
        // This can't empty.
        if($.type(current()[2]) === 'number') {
          // Grab right cutie
          var newIndex = current()[2];
          // Empty out right cutie
          cc.cuties.r(null);
          return cc.cuties.m(newIndex, callback);
        } else if($.type(current()[1]) === 'number') {
          // Grab left cutie
          var newIndex = current()[1];
          // Empty out left cutie
          cc.cuties.l(null);
          return cc.cuties.m(newIndex, callback);
        } else {
          // Grab first cutie
          return cc.cuties.m(0, callback);
        }
      }
    }

  // Display Functions

    // Get classes to apply to cutie
    function cutieClasses(cutie) {
      var classesString = ' cutie-' + cutie.cutie;
      classesString += ' rarity-' + cutie.rarity;
      return classesString;
    }

    // Get cutie card html
    // Doesn't update classes automatically though.
    function cutieCard(element, defaultClass, cutie) {
      element = $(element);
      defaultClass = defaultClass || '';

      if(element.length < 1) {
        return;
      }

      // Create .cutie-card if it doesn't already exist.
      var cutieCardElement = element.find('.cutie-card');
      if(cutieCardElement.length < 1) {
        cutieCardElement = $('<div class="cutie-card">').appendTo(element);
      }

      // Create background, glyph, and foreground using the same methodology
      var backgroundElement = cutieCardElement.find('.background');
      if(backgroundElement.length < 1) {
        backgroundElement = $('<div class="background">').appendTo(cutieCardElement);
      }
      var glyphElement = cutieCardElement.find('.glyph');
      if(glyphElement.length < 1) {
        glyphElement = $('<div class="glyph">').appendTo(cutieCardElement);
      }
      var foregroundElement = cutieCardElement.find('.foreground');
      if(foregroundElement.length < 1) {
        foregroundElement = $('<div class="foreground">').appendTo(cutieCardElement);
      }

      if(cutie) {
        element.removeClass().addClass(defaultClass + cutieClasses(cutie));

        glyphElement.attr('data-css-before', cutie.glyph);
      } else {
        element.removeClass().addClass(defaultClass);
        glyphElement.attr('data-css-before', '');
      }
    }

    // Clear a cutie card
    cc.cuties.clearCutieCard = function(element, defaultClass) {
      return cutieCard(element, defaultClass);
    }

  // Cutie object constructor
  cc.cuties.construct = function(data) {
    this.cutie = data.cutie;
    this.glyph = String.fromCharCode(parseInt('0x' + data.cutie)) + '\ufe0e';
  }

  // Cutie object prototype
  cc.cuties.proto = {
    // Stuff that probably will be overridden

    // Rarity
    rarity: 0,

    // Target bp for lv up?
    targetbp: function() {
      return '0';
    },
    // How long do we have to wait before bursting?
    preBurstPause: function() {
      return 300;
    },
    // xpdrain calculation function, run if cutie is equipped in the middle
    xpDrain: function() {
      if(!cc.ls.d.burst) {
        // Normal mode

        // Drain 10% of current xp per second
        var xpDrain = String(SchemeNumber.fn.floor(SchemeNumber.fn['*'](cc.stats.excitement(), '1/10')));

        return xpDrain;
      } else {
        // Burst mode

        // Drain entire targetxp in one second
        var xpDrain = String(SchemeNumber.fn.ceiling(SchemeNumber.fn['/'](this.targetxp(), '1')));

        return xpDrain;
      }
    },


    // These handler functions are run if this cutie is equipped at all

    // on tick function.
    tick: function(now) {
    },


    // Stuff that might be overwritten, but probably won't be

    // How much excitement does this cutie require for love up?
    targetxp: function() {
      // This ranges from 3 for rarity 0 to 9 for rarity 6
      var target = 3 + this.rarity;

      return String(SchemeNumber.fn['*'](target, SchemeNumber.fn['+'](this.love(), '1')));
    },

    // What happens when bursting is successful?
    burstSuccess: function() {
      this.loveup();
      cc.menu('loveup');

      // How long should we wait?
      return 1000;
    },

    // What happens when bursting fails?
    burstFailure: function() {
      return 300;
    },


    // Stuff that probably won't be overidden


    // Get / set love - low level, doesn't trigger events
    lv: function(value) {
      if($.type(value) === 'undefined') {
        // Get - default to 0
        return cc.util.rhanum(this.data, 'lv') || cc.util.rhanum(this.data, 'lv', '0');
      } else {
        // Set
        return cc.util.rhanum(this.data, 'lv', String(value));
      }
    },
    // Incremenets love
    love: function(value) {
      if(value) {
        value = SchemeNumber.fn.round(String(value));
        this.lv(SchemeNumber.fn['+'](this.lv(), value));

        // Ensure that this can't be less than 0
        if(SchemeNumber.fn['negative?'](this.lv())) {
          this.lv('0');
        }
      }
      return this.lv();
    },
    // Are we excited enough?
    targetXpMet: function(value) {
      value = value || cc.stats.excitement();
      return SchemeNumber.fn['>='](value, this.targetxp());
    },
    // Love Up processing!
    loveup: function() {
      this.love('1');

      cc.util.rhanum(cc.ls.d, 'totalLv', SchemeNumber.fn['+']('1', cc.util.rhanum(cc.ls.d, 'totalLv') || '0'));
      cc.util.rhainc(cc.ls.d.cutieStats[this.cutie], 'lv');
    },
    // Get / Set burst points
    bp: function(value) {
      // This has no meaning outside of bursting
      if(cc.ls.d.burst) {
        if($.type(value) === 'undefined') {
          // Get - default to 0
          return cc.util.rhanum(cc.ls.d.burst, String(this.index())) || cc.util.rhanum(cc.ls.d.burst, String(this.index()), '0');
        } else {
          // Set
          return cc.util.rhanum(cc.ls.d.burst, String(this.index()), String(value));
        }
      }
    },
    // Mod burst points
    burstPoints: function(value) {
      // This has no meaning outside of bursting
      if(cc.ls.d.burst) {
        if(value) {
          value = SchemeNumber.fn.round(String(value));
          this.bp(SchemeNumber.fn['+'](this.bp(), value));

          // Ensure that this can't be less than 0
          if(SchemeNumber.fn['negative?'](this.bp())) {
            this.bp('0');
          }
        }
        return this.bp();
      }
    },
    // Did we burst enough?
    targetBpMet: function(value) {
      value = value || this.burstPoints();
      return SchemeNumber.fn['>='](value, this.targetbp());
    },
    // Render cutie card. Uses function above.
    renderCutieCard: function(element, defaultClass) {
      return cutieCard(element, defaultClass, this);
    },
    // Same for classes
    renderCutieClasses: function() {
      return cutieClasses(this);
    },
    // Index of cutie in cutie list. DO NOT SAVE without accounting for deletion.
    index: function() {
      return $.inArray(this.data, cc.cuties.list());
    },
    // Current slot. Even more so than above.
    slot: function() {
      return $.inArray(this.index(), current());
    },
    // Is this cutie selected? Returns index (not boolean).
    selected: function(name) {
      return $.inArray(this.index(), cc.cuties.selection(name));
    },
    // Select this cutie
    // If mode is not a boolean, toggles. Otherwise, sets.
    select: function(name, mode) {
      var index = this.selected(name);
      var selected = index > -1;

      if($.type(mode) === 'boolean' && selected === mode) {
        // Don't hafta do anything.
        return;
      }

      // At this point, we'll always hafta toggle.
      var selection = cc.cuties.selection(name);

      if(selected) {
        selection.splice(index, 1);
      } else {
        selection.push(this.index());
      }
    }
  };
}();
