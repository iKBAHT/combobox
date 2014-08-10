'use strict';
(function (module) {
	module.directive('combobox', exampleController);

	exampleController.inject = [];
	function exampleController() {
		return {
			restrict: 'EA',
			templateUrl: '/lib/combobox/js/views/combobox.html',
			scope: {

			},
			link: function ($scope, element, attrs) {
				$scope.text = 'combobox';
			}
		};
	}
})(angular.module('combobox'));