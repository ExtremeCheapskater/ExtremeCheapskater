(function(){

	var app = angular.module('CheapskaterApp', ['ngRoute','ngResource','articleServices']);

	app.config(['$routeProvider','$locationProvider', function($routeProvider, $locationProvider){
		$routeProvider.when('/', {
			templateUrl: 'partials/index.html'
		}).when('/Index', {
			templateUrl: 'partials/index.html'
		}).when('/Blog', {
			templateUrl: 'partials/blog.html'
		}).when('/Blog:articleid', {
			templateUrl: 'partials/blog.html'
		}).when('/Contactus', {
			templateUrl: 'partials/contactus.html',
			controller: 'ContactusCtrl'
		}).when('/Gallery', {
			templateUrl: 'partials/gallery.html'
		});

		$locationProvider.html5Mode(true);
		$locationProvider.hashPrefix('!');
	}]);

	app.controller('NavCtrl', ['$scope', '$location',function($scope, $location) {

		$scope.isActive = function(viewLocation){
			var active = ($location.absUrl().indexOf(viewLocation)>0);
			return active;
		};

		$scope.viewLoaded = function() {
			$('.carousel ').carousel()
		}
		
	}]);

	app.controller('FooterCtrl', ['$scope', function($scope){
		$scope.text = "2015 Extreme Cheapskater";
	}]);	

	app.directive('diyNavBar', function() {
  	return {
    		restrict: 'E',
    		templateUrl: 'nav-bar.html'
  	};
	}); 

})();

(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.0";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

(function(d,s,id){
	var js,fjs=d.getElementsByTagName(s)[0]
	var p=/^http:/.test(d.location)?'http':'https';
	if(!d.getElementById(id)){
		js=d.createElement(s);
		js.id=id;
		js.src=p+'://platform.twitter.com/widgets.js';
		fjs.parentNode.insertBefore(js,fjs);
		}
	}(document, 'script', 'twitter-wjs')); 

