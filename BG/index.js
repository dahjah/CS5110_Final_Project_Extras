var sizeArrayToString = function(sizes){
  var mmSizeString = '';
  for (var i=0; i<sizes.length; i++){
    mmSizeString = mmSizeString + sizes[i][0] + 'x' + sizes[i][1];
    if(sizes[i+1]){
      mmSizeString = mmSizeString+'|';
    }
  }
  return mmSizeString;
}

var setupJWplayer = function(divId, sizes, jwPlayerFeed, tagUrl) {
  var el = $('#' + divId);

  var player = jwplayer(divId);

  player.setup({
    playlist: jwPlayerFeed,
    advertising: {
      client: 'googima',
      autoplayadsmuted: true
    },
  });

  player.on('beforePlay', function() {
    var tagUrl = el.attr('tagUrl');
    if (tagUrl) {
      player.playAd(tagUrl);
    }

    setTimeout(function(){
      requestVideoAd(divId, sizes, jwPlayerFeed);
    }, 3000);
  });

  player.on('beforeComplete', function() {
    if (player.getPlaylistIndex() === player.getPlaylist().length - 1) {
      var tagUrl = el.attr('tagUrl');
      if (tagUrl) {
        player.playAd(tagUrl);
      }
    }
  });
}

var loadedPlayers = [];

var requestVideoAd = function(divId, sizes, jwPlayerFeed) {
  pbjs.requestBids({
    timeout: 1800,
    adUnitCodes: [divId],
    bidsBackHandler: function(bids) {
      var adserverTag = 'https://pubads.g.doubleclick.net/gampad/ads?sz=' + sizeArrayToString(sizes) + '&iu=/20842576/' + 'TBN.beinggenevieve' + '&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&url=[referrer_url]' + '&correlator=' + Date.now();

      var options = {
        'adserver': 'dfp',
        'code': divId
      };

      var tagUrl = pbjs.buildMasterVideoTagFromAdserverTag(adserverTag, options);
      var el = $('#' + divId);

      el.attr({'tagUrl': tagUrl});

      if( loadedPlayers.indexOf(divId) == -1){
        console.log('setup jwp');
        loadedPlayers.push(divId);
        setupJWplayer(divId, sizes, jwPlayerFeed, tagUrl);
      } else {
        console.log('already setup');
      }
    }
  });
}

var divId = "mmt-97f31e2c-cfad-4c31-86a6-9ef9794b0722";
var sizes = [[640, 480], [400,300]];
requestVideoAd(divId, sizes, "https://content.jwplatform.com/feeds/Frov9rsm.rss");
