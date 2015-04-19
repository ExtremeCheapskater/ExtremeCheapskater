(function(){

	var app = angular.module('CheapskaterApp');

	app.controller('BlogCtrl',['$scope','$http','$window','$filter','getArticles','setFilterFlag', 'getFilterFlag', '$location','$anchorScroll',"$route",'$routeParams',
		function($scope, $http, $window, $filter, getArticles, setFilterFlag, getFilterFlag, $location, $anchorScroll, $route, $routeParams){
		$scope.filterFlags = [];
		$scope.selectedFilterFlag = getFilterFlag();
		$scope.articles = [];
		$scope.author = "Amy Vandeventer";

		var dateOrderfilter = $filter('orderBy');

		getArticles.get(function(result){
			$scope.articles = dateOrderfilter(result.articles, "date", 'reverse');

			//IDs so DISQUS will know what to hook up to
			$scope.articles.forEach(function(article){
				article.file = '/partials/articles/' + article.file + '.html';
				article.url = '/Blog?article=' + article.id;
			});

			//If Blog page and showing all articles, then show only partial article
			//If query params exist, it is the article ID 
			$scope.partial = false;
			if (angular.isDefined($routeParams.article)) { //Blog page, one article
				$scope.setCurrentArticleById($routeParams.article);
			} else if ($location.$$path.indexOf("Blog") > 0){ //Blog page, all articles
				$scope.setCurrentArticleById(result.defaultArticle);
				$scope.partial = true;
			} else { //Isn't the Blog page
				$scope.setCurrentArticleById(result.defaultArticle);				
			}

			$scope.filterFlags = result.filterFlags;
			$scope.selectedFilterFlag = result.filterFlags[0].value;

		});

		$scope.setSelectedFilterFlag = function(flag) {
			$scope.selectedFilterFlag = flag;
			setFilterFlag(flag);
		}

		$scope.setCurrentArticleById = function(id) {

			if ($scope.articles.length > 0) {
				$scope.articles.forEach(function(article){
					if (article.id == id) {
						$scope.currentarticle = article;
					}
				});
			}
			$anchorScroll();
			return $scope.currentarticle;
		}

		$scope.nextArticle = function(direction){
			if ($scope.articles.length == 0) {
				return;
			}

			var blogFilter = $filter('blogFilter');
			var articles = blogFilter($scope.articles);

			articles.forEach(function(article, index){
				if (article.id == $scope.currentarticle.id) {
					if (direction > 0 && index + direction >= articles.length) {
						nextCurrent = articles[0];
					} else if (direction < 0 && index + direction < 0) {
						nextCurrent = articles[articles.length - 1];
					} else {
						nextCurrent = articles[index + direction];
					}
				}
			});

			$scope.currentarticle = nextCurrent;
			$anchorScroll();

		}

		var resetDisqus = function (newIdentifier, newUrl, newTitle) {
			DISQUS.reset({
				reload: true,
				config: function () {
          this.page.identifier = newIdentifier;
          this.page.url = $location.absUrl();
				}
			});
		};

		$scope.setupDisqus = function (newIdentifier) {
			var article = $scope.setCurrentArticleById(newIdentifier);
			var newUrl = article.url;
			var newTitle = article.title;

			if (angular.isDefined(window.DISQUS)) { 
				console.log("resetting disqus to " + newIdentifier + ", " + newUrl + ", " +  newTitle);
				resetDisqus(newIdentifier, newUrl, newTitle);
			} else {
				$window.disqus_identifier = newIdentifier;
				$window.disqus_url = newUrl;
				$window.disqus_shortname  = 'diyfeedback';	
				$window.disqus_title = newTitle;

				console.log("Initial setup disqus to " + newIdentifier + ", " + newUrl + ", " +  newTitle);

				var dsq = document.createElement('script');
				dsq.type = 'text/javascript';
				dsq.async = true;

				dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
				(document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
			}
			
		};

	}]); 

	app.directive('commentForm', function() {
		return {
			restrict: 'E',   		
			templateUrl: '/partials/commentForm.html'
		};
	}); 

	app.directive('disqus', [function() {

	  return {
	    restrict : 'AC',
	    replace  : true,
	    scope    : {
	      id : '=disqus',
	    },
	    template : '<div id="disqus_thread"></div>',
	    link: function link(scope) {
	      scope.$watch('id', function(id) {
	        if (angular.isDefined(id)) {
	          scope.$parent.setupDisqus(id);
	        }
	      });
	    }
	  };
	}]);

})();



