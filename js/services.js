var articleServices = angular.module('articleServices',['ngResource']);

articleServices.factory('getArticles', ['$resource',
  function($resource){
    return $resource('/partials/articles/articleList.json');
  }
]);

articleServices.factory('setFilterFlag',['$rootScope',
  function($rootScope){
    return function(selectedFilterFlag) {
      $rootScope.selectedFilterFlag = selectedFilterFlag;
    }
  }
]);

articleServices.factory('getFilterFlag',['$rootScope',
  function($rootScope){
    return function() {
      return $rootScope.selectedFilterFlag;
    }
  }
]);

articleServices.filter('blogFilter', ['$rootScope',
  function($rootScope){
    return function (articles) {
        if (!angular.isUndefined(articles) && articles.length > 0 && !angular.isUndefined($rootScope.selectedFilterFlag) && $rootScope.selectedFilterFlag.length > 0) {
            var tempArticles = [];
              angular.forEach(articles, function (article) {
                var alreadyIn = false;
                angular.forEach(article.flags, function(flag) {
                  if (flag === $rootScope.selectedFilterFlag && !alreadyIn) {
                    tempArticles.push(article);
                    //break; illegal in angular.foreach
                    alreadyIn = true;
                  }
                });//next flag
              });//next article
            return tempArticles;
        } else {
            return articles;
        }
    };
  }
]);

var windowWatcherServices = angular.module('windowWatcherServices', []);

windowWatcherServices.factory('watchScroll', ['$window',
  function($window){

    return function(scope, rootScope){
      angular.element(window).on('scroll', function(event){
        //console.log(window.pageYOffset);

        //Return as if page is scrolled down if on page without hero else evaluate based on hero height
        //which is based on window width. 200h for phone (400px) else 400h otherwise.
        if (!rootScope.hero) {
          rootScope.isScrolledDown = true;
        } else {
          scope.scrollPostition = $window.pageYOffset;
          if ((scope.scrollPostition < 400 && $window.innerWidth > 400) || scope.scrollPostition < 200) {
            rootScope.isScrolledDown = false;
          } else {
            rootScope.isScrolledDown = true;
          }
        }
        scope.$apply();
      });
    };
  }
]);

var menuHelperServices = angular.module('menuHelperServices', []);

menuHelperServices.factory('menuHelper',['$rootScope', function($rootScope){
  return function() {
    $rootScope.hero = false;
    $rootScope.isScrolledDown = true;
  }
}]);

