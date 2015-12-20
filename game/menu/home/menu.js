!function() {
  var script = 'home', dir = 'menu/' + script + '/',
  menu = cc.menu[script] = function(element, state) {
    cc.util.getcss(dir + 'menu.css');
    element.load(cc.util.l(dir + 'menu.html'), function() {
      if(location.protocol == 'https:') {
        $('#menu-home-https-message').remove();
      }

      function shareMessage(tag) {
        var message = 'I have given ' + cc.stats.clicks() + ' pets to my ';
        message += cc.util.rhanum(cc.ls.d, 'totalCuties') + ' ' + (tag ? '#CutieClicker' : 'Cutie Clicker') + ' cuties.';

        var messageFragments = [
          'Beat me.',
          'Try and catch up.',
          'You?',
          'And you?',
          'Join me.',
          'It\'s fun.',
          'Let\'s play.',
          'You can too.',
          'Click click.',
          'Pet them.',
          'Your turn.',
          'Your move.',
          'Fite me.'
        ];

        var randomMessage = messageFragments[Math.floor(Math.random() * messageFragments.length)];

        return encodeURIComponent(message + ' ' + randomMessage);
      }

      $('#menu-home-clicks-tweet').click(function() {
        var twitterURL = 'https://twitter.com/intent/tweet?text=';

        window.open(twitterURL + shareMessage(true) + '%20cc.aideen.pw', '_blank');
      });

      $('#menu-home-clicks-tumblr').click(function() {
        var tumblrUrl = 'https://www.tumblr.com/widgets/share/tool?posttype=link&tags=Cutie%20Clicker,CutieClicker&';
        tumblrUrl += 'canonicalUrl=https%3A%2F%2Fcc.aideen.pw&content=https%3A%2F%2Fcc.aideen.pw&title=';

        window.open(tumblrUrl + shareMessage(), '_blank');
      });

      $('#menu-home-clicks-copypaste').click(function() {
        prompt('Please copy this manually.', decodeURIComponent(shareMessage()) + ' http://cc.aideen.pw');
      });
    });
  };
}();
