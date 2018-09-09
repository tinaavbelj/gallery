document.addEventListener("DOMContentLoaded", function (event) {
    new Gallery({
		'container': document.getElementById('container1'),
		'api': 'https://campaigns.celtra.com/developer-tasks/swipey-gallery/',
		'looping': true
    });

    new Gallery({
		'container': document.getElementById('container2'),
		'api': 'https://campaigns.celtra.com/developer-tasks/swipey-gallery/',
		'looping': false
    });
});
