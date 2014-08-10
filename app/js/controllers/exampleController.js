'use strict';
(function (module) {
	module.controller('exampleController', exampleController);

	exampleController.inject = ['$scope'];
	function exampleController($scope) {
	}
})(angular.module('testApp'));