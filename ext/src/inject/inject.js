MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
window.addEventListener ("load", myMain, false);

var localCache = {};
var timeout = 0;
var interval = 125;

function calculateSentimentForStreamItem(streamItem) {
	var content = streamItem.querySelectorAll('p.tweet-text');
	if (content.length !== 0) {
		var reveal = true;
		var count = 0;

		for (var j = 0; j < content.length; j++) {
			var tweetText = content[j].innerText;

			// remove all urls from tweet
			tweetText = tweetText.replace(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig, '');

			fetch('https://dockerhost/', {
				method: 'post',
				headers: {
			    'Accept': 'application/json',
			    'Content-Type': 'application/json'
			  },
				credentials: 'include',
				body: JSON.stringify({
					tweet: tweetText,
				})
			}).then(function(response) {
				return response.text();
			}).then(function(body) {
				if (body === 'Negative') {
					reveal = false;
				}

				if (count !== content.length - 1) {
					count++;
				} else {
					timeout -= interval;
					localCache[streamItem.dataset.itemId] = reveal;
					if (reveal) {
						streamItem.className = streamItem.className + " stoked";
					}
				}
			})
		}
	}
}

function processStreamItem(streamItem) {
	if (typeof localCache[streamItem.dataset.itemId] !== 'undefined') {
		if (localCache[streamItem.dataset.itemId]) {
			streamItem.className = streamItem.className + " stoked";
		}
	} else {
		timeout += interval;
		window.setTimeout(function() {
			calculateSentimentForStreamItem(streamItem);
		}, timeout);
	}
};

function processStreamItems(streamItems) {
	for (var i = 0; i < streamItems.length; i++) {
		var currentStreamItem = streamItems[i];
		processStreamItem(currentStreamItem);
	}
}

function handleMutation(mutations, observer) {
	for (var i = 0; i < mutations.length; i++) {
		var mutation = mutations[i];
		if (mutation.addedNodes.length !== 0) {
			for (var j = 0; j < mutation.addedNodes.length; j++) {
				var node = mutation.addedNodes[j];
				if ((node.tagName === 'DIV' || node.tagName === 'LI') && node.className) {
					if (node.className.indexOf('content-main') !== -1) {
						processStreamItems(node.getElementsByClassName('stream-item'));
					} else if (node.className.indexOf('stream-item') !== -1) {
						processStreamItem(node);
					}
				}
			}
		}
	}
}

function myMain(evt) {
	var observer = new MutationObserver(handleMutation);

	processStreamItems(document.getElementsByClassName('stream-item'));

	observer.observe(document.getElementById('page-container'), {
		subtree: true,
		childList: true,
	});
}