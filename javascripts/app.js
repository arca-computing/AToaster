var app = angular.module('demoApp', ['AToaster']);

app.controller('demoController', ['$scope', 'service.toaster', '$timeout', function($scope, toaster, $timeout){

	$scope.popWelcome = function(){
		toaster.pop('success', 'Welcome', 'You made it to the demo page !', null);
	};

	$scope.popSuccess = function(){
		toaster.pop('success', 'Done', 'Image upload done', null);
	};

	$scope.popError = function(){
		toaster.pop('error', 'Server error', 'an error occurred on the server', null);
	};

	$scope.popWarning = function(){
		toaster.pop('warning', 'Server info', 'server maintenance from 1PM to 3PM', null);
	};

	$scope.popWait = function(){
		toaster.pop('wait', 'File uploading', 'upload in progress', 0);
		$timeout(function(){
			toaster.clearAndPop('success', 'File Uploading', 'file uploaded', null);
		}, 3000);
	};

	$timeout(function(){
		$scope.popWelcome();
	});

}]);