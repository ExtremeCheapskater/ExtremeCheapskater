(function(){

  var app = angular.module('CheapskaterApp');  

	app.controller('CommentCtrl',['$scope','$http','$window',function($scope, $http, $window){
		$scope.numComments = 0;

	}]); 

})();