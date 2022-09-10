/*const threshold = 0.5;
const options = {
	root: null,//document.querySelector('main'),
	rootMargin: '0px 100% 0px 100%',
	threshold
};*/

/*const handleAnimationIntersect = function (entries, observer) {
	entries.forEach(function (entry) {
		//console.log(entry.intersectionRatio);
		if (entry.isIntersecting) {
			if (entry.intersectionRatio > threshold) {
				entry.target.classList.add('reveal');
				observer.unobserve(entry.target);
			}
		}
	});
};

const svgHandleAnimationIntersect = function (entries, observer) {
	entries.forEach(function (entry) {
		//console.log(entry.intersectionRatio);
		if (entry.isIntersecting) {
			if (entry.intersectionRatio > threshold) {
				entry.target.classList.add('animated');
				observer.unobserve(entry.target);
			}
		}
	});
};*/

document.addEventListener('DOMContentLoaded', function () {
	window.setTimeout(() => { document.querySelector('#freepik_stories-static-website').classList.add('animated') }, 1500);

/*	const observer = new IntersectionObserver(handleAnimationIntersect, options);
	const targets = document.querySelectorAll('[class*="reveal--"]');

	targets.forEach(function (target) {
		observer.observe(target);
	});

	const svgObserver = new IntersectionObserver(svgHandleAnimationIntersect, options);
	const svgTargets = document.querySelectorAll('[class="reveal"]');

	svgTargets.forEach(function (target) {
		svgObserver.observe(target);
	});*/
})
