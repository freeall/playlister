var request = require('browser-request');

$(function() {
	var $index = $('#index');
	var $searchList = $('#index .search');

	request.get({
		url: 'https://gdata.youtube.com/feeds/api/videos?alt=json&q=football+'+Math.round(Math.random()*10),
		json: true
	}, function(err, response) {
		if (err) {
			alert(err);
			return;
		}

		var entries = response.body.feed.entry;

		for (var i=0; i<entries.length; i++) {
			var entry = entries[i];
			var thumbnail = entry.media$group.media$thumbnail[0].url;

			thumbnail = thumbnail.substr(0, thumbnail.lastIndexOf('/')) + '/default.jpg';

			var html = $(''+
				'<div class="yt-item">'+
					'<div class="left">'+
						'<div class="image" style="background-image:url('+thumbnail+')">'+
							'<div class="time">05:15</div>'+
						'</div>'+
					'</div>'+
					'<div class="left">'+
						'<div class="title" title="'+entry.title.$t+'">'+entry.title.$t+'</div>'+
						'<div class="by">by '+entry.author[0].name.$t+'</div>'+
						'<div class="views">'+entry.yt$statistics.viewCount+' views</div>'+
					'</div>'+
					'<div class="clear"></div>'+
				'</div>');

			$('.items', $searchList).append(html);
			
			console.log(entry)
		}
	});
});
