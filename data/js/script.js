(function(){var t,a,o,n,e,r,c,l,i,s,u,d,v,f,p,k;t="start",o=$("html"),n=$("#save-data"),e=$("#load-data"),r=$("#load-cancel"),c=$("#load-go"),location.protocol+location.host!=="https:cc.aideen.pw"&&o.addClass("http"),s=function(n){return null!=a&&clearInterval(a),o.removeClass(t).addClass(n),t=n},u=function(){var t;return t=n,t.focus(),t.select(),t},d=function(){var t,a,o,e;return t=LZString.compressToBase64(JSON.stringify(localStorage)),a=new Date,o="Cutie Clicker Game Data\nSaved: "+a+"\n[0|"+t+"]",e=n,e.val(o),i=t},v=function(t){return/\[0\|([a-zA-Z0-9+\/=]+)\]/.exec(t)},$("#button-save").on("click",function(){return"save"===t?s("start"):(d(),s("save"),u())}),f=n,f.on("click",u),f.on("input",function(){var t;return(t=v(n.val()))&&t[1]===i?void 0:(d(),u())}),p=function(){var t;return t=e,t.val(""),t.removeClass("ok"),t.focus(),l=void 0},$("#button-load").on("click",function(){return"load"===t?s("start"):(s("load"),p())}),k=function(){return e.hasClass("ok")},e.on("input",function(){var t,a,o,n;if(t=v(e.val()))try{a=JSON.parse(LZString.decompressFromBase64(t[1]))}catch(r){}return null!=a?(o=e,o.addClass("ok"),l=a):(n=e,n.removeClass("ok"),l=void 0)}),r.on("click",function(){return k?p():void 0}),c.on("click",function(){var t,a,n,e,r;if(k){o.addClass("processing");try{localStorage.clear();for(t in a=l)n=a[t],localStorage.setItem(t,n);return window.location="/"}catch(c){return e=c,r=$("#processing"),r.css("font-size","1.2rem"),r.text(e),r}}}),$("#button-back").on("click",function(){return window.location="/"}),$("#button-https").on("click",function(){return window.location="https://cc.aideen.pw/data/"}),$("#delete-local-storage").on("click",function(t){return t.preventDefault(),confirm("If you haven't saved your game data yet, you will lose it! Are you sure you want to delete your http data?")?(localStorage.clear(),window.location="https://cc.aideen.pw/"):void 0})}).call(this);