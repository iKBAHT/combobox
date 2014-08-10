'use strict';
(function (module) {
	module.controller('exampleController', exampleController);

	exampleController.inject = ['$scope', '$q', '$timeout'];
	function exampleController($scope, $q, $timeout) {

		function createSimpleComboboxOptions () {
			var selectList = [{
				value: 'apple',
				id: 1
			}, {
				value: 'orange',
				id: 2
			}, {
				value: '<h1>tree</h1>',
				id: 3
			}, {
				value: 'potato',
				id: 4
			}];
			var combobox = {
				selected: selectList[1],
				list: selectList,
				options: {},
				onSelect: function (newItem) {
					console.log('new item is ' + newItem.value);
				}
			};
			return combobox;
		};

		function createRemoteComboboxOptions () {
			var selectList = [{
				value: 'стол',
				id: 1
			}, {
				value: 'стул',
				id: 2
			}, {
				value: 'тумбочка',
				id: 3
			}];
			var combobox = {
				list: function  () {
					return $timeout(function  () {
						return $q.when(selectList);
					}, 200);
				},
				options: {
					emptyText: "пока не выбранно",
					lazyLoad: true
				},
				onSelect: function (newItem) {
					console.log('new item is ' + newItem.value);
				}
			};
			return combobox;
		};
		
		$scope.simpleCombobox = createSimpleComboboxOptions();
		$scope.remoteCombobox = createRemoteComboboxOptions();
	}
})(angular.module('testApp'));