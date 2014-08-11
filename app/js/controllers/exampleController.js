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
				value: 'cherry',
				id: 3
			}, {
				value: 'strawberry',
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
		}

		function createEmptyComboboxOptions () {
			var selectList = [];
			var combobox = {
				selected: {
					id: '123',
					value: 'Иванов Иван'
				},
				list: selectList
			};
			return combobox;
		}

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
			}, {
				value: 'шкаф',
				id: 4
			}, {
				value: 'дверь',
				id: 5
			}];
			var combobox = {
				list: function  () {
					return $timeout(function  () {
						return $q.when(selectList);
					}, 200);
				},
				options: {
					emptyText: 'пока не выбранно',
					lazyLoad: true
				},
				onSelect: function (newItem) {
					console.log('new item is ' + newItem.value);
				}
			};
			return combobox;
		}

		function createDisableComboboxOptions () {
			
			var combobox = {
				selected: {
					id: '123',
					value: 'disabled element'
				},
				list: [],
				disable: true
			};
			$timeout(function() {
				//combobox.disable = false;
			}, 2000);
			return combobox;
		}

		function createBigComboboxOptions (size) {
			var selectList = [],
				wordLength = 8;

			for (var i=0;i<size;++i){
				selectList.push(generateItem());
			}

			function generateItem() {
				generateItem.count = generateItem.count || 0;
				return {
					value: generateWord(),
					id: generateItem.count++
				};
			}

			function generateWord() {
				var charSet = 'abcdefghigklmnopqrstuvwxyz',
					word = '';

				for (var j=0;j<wordLength;++j){
					word += charSet.charAt(Math.floor(Math.random()*26));
				}
				  return word;
			}
			var combobox = {
				selected: selectList[0],
				list: selectList,
				onSelect: function (newItem) {
					console.log('new item is ' + newItem.id);
				}
			};
			return combobox;
		}
		
		$scope.simpleCombobox = createSimpleComboboxOptions();
		$scope.emptyCombobox = createEmptyComboboxOptions();
		$scope.remoteCombobox = createRemoteComboboxOptions();
		$scope.disableCombobox = createDisableComboboxOptions();
		$scope.bigCombobox = createBigComboboxOptions(100);
	}
})(angular.module('testApp'));