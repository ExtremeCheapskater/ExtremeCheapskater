(function(){

  var app = angular.module('CheapskaterApp');

	app.controller('ContactusCtrl',['$scope', '$http','$window', function($scope, $http, $window){
		$scope.emailValid = "edit";
		$scope.subjectValid = "edit";
		$scope.messageValid = "edit";

		$scope.onButtonClick = function() {

			var data = {
				emailaddr: $scope.emailaddress,
				subject: $scope.subject,
				message: '<p>Email from: ' + $scope.emailaddress + 
					'</p><p>subject: ' + $scope.subject + '</p><p>' 
					+ $scope.message + '</p>',
				date: Date.now()
			}
			
			$scope.emailValid = true;
			$scope.subjectValid = data.subject.length < 30;
			$scope.messageValid = data.message.length < 500;

			$http({method: 'POST', data: data, url: '/api/email'}).
				success(function(data, status, headers, config) {
					if (!data.success) {
						$scope.messagePosted = false;
					} else {
						$scope.messagePosted = true;
					}
		  });	

		}

	}]);  

})();