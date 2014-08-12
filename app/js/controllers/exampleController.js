'use strict';
(function (module) {
	module.controller('exampleController', exampleController);

	exampleController.inject = ['$scope', '$q', '$timeout'];
	function exampleController($scope, $q, $timeout) {

		function createSityComboboxOptions(isNeedSearch, disable) {
			var i = 0,
				sitys;

			sitys = [{
				value: 'Москва',
				id: i++
			}, {
				value: 'Самара',
				id: i++
			}, {
				value: 'Ростов',
				id: i++
			}, {
				value: 'Пенза',
				id: i++
			}, {
				value: 'Омск',
				id: i++
			}];

			return {
				list: sitys,
				disable: disable,
				options: {
					needSearch: isNeedSearch,
					
				}
			};
		}

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
					alert(newItem.value);
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

		function createRemoteComboboxOptions (delay) {
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
			}, {
				value: 'диван',
				id: 6
			},{
				value: 'окно',
				id: 7
			}];
			var combobox = {
				list: function  () {
					// эмуляция запроса на сервер
					return $timeout(function  () {
						return $q.when(selectList);
					}, delay);
				},
				options: {
					emptyText: 'выбрать',
					lazyLoad: true
				},
				onSelect: function (newItem) {
					console.log('new item is ' + newItem.value);
				}
			};
			return combobox;
		}
		
		function createOneElementComboboxOptions() {
			return {
				list: [{
					value: 'Путин',
					id: 1
				}],
				options: {
					countToShowSearch: 0
				}
			};
		}

		function createBigComboboxOptions (size) {
			var selectList = [],
				wordLength = 6;

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
				options: {
					itemsToShow: 8
				}
			};
			return combobox;
		}

		$scope.sityCombobox = createSityComboboxOptions(true, false);
		$scope.remoteCombobox = createRemoteComboboxOptions(1000); // задержка, эмуляция ожидания сервера
		$scope.simpleCombobox = createSimpleComboboxOptions();
		$scope.withoutSearchCombobox = createSityComboboxOptions(false, false);
		$scope.withSearchCombobox = createOneElementComboboxOptions();
		$scope.emptyCombobox = createEmptyComboboxOptions();
		$scope.disableCombobox = createSityComboboxOptions(true, true);
		$scope.bigCombobox = createBigComboboxOptions(1000); // количество элементов в списке
	}
})(angular.module('testApp'));