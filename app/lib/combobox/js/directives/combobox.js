'use strict';
(function (module) {
	module.directive('combobox', exampleController);

	exampleController.inject = [];
	function exampleController() {
		return {
			restrict: 'EA',
			replace: true,
			templateUrl: '/lib/combobox/js/views/combobox.html',
			scope: {
				model: '=',
				source: '=',
				options: '=',
				onItemSelected: '=',
				disable: '='
			},
			link: function ($scope, element, attrs) {
				var options = angular.extend({
					lazyLoad: false,
					emptyText: "Нет",
					noResultText: "Не найдено",
					listEmptyText: "Список пуст",
					countToShowSearch: 4 // после какого количества элементов надо показывать поиск
				}, $scope.options);

				$scope.isShow = false;

				var list,
					listStartLoad = false;

				if (angular.isArray($scope.source)){
					// в качестве источника массив
					list = $scope.source;
				} else if (angular.isFunction($scope.source)) {
					// в качестве источника promise
					if (!options.lazyLoad){
						loadItemsFromPromise();
					}
				} else {
					throw new TypeError('combobox source must be array or promise function');
				}

				function loadItemsFromPromise() {
					listStartLoad = true;
					$scope.source().then(function (items) {
						if (!angular.isArray(items)){
							throw new TypeError('combobox source promise function must return array');
						}
						list = items;
						listStartLoad = false;
					});
				};

				function isListNeedToLoad() {
					return !(list || listStartLoad);
				}
				
				$scope.getCurrentItem = function () {
					return $scope.model && $scope.model.value || options.emptyText;
				};

				$scope.getSource = function () {
					return list || [];
				};

				$scope.openPopup = function () {
					$scope.isShow = !$scope.isShow;
					if (isListNeedToLoad()){
						loadItemsFromPromise();
					}
				}

				// закрытие попапа при клике вне попапа
				var popupCloseListener = {
					listenersUniqId: Math.floor(Math.random()*1000000).toString(),
					add: function  (callback) {
						$('html').on('click.' + this.listenersUniqId, function (event) {
							var parentsMenuDown = $(event.target).parents(".menu_down");
							if (parentsMenuDown[0] !== element[0]){
								callback();
								$scope.$apply();
							}
						})
					},
					remove: function () {
						$('html').off('click.' + this.listenersUniqId);
					}
				};

				// выбор элемента. реализованно через события jQuery чтобы снизить нагрузку по памяти
				// так как ангуляровский ng-click создаст listener на каждый вариант, а здесь только 1
				var itemSelectListener = {
					add: function  (callback) {
						$(element).on('click', 'li>a', function (event) {
							var selectedItem = $(this).data('item');
							callback(selectedItem);
							$scope.$apply();
						})
					},
					remove: function () {
						$(element).off('click');
					}
				};				

				popupCloseListener.add(function  () {
					$scope.isShow = false;
				});

				itemSelectListener.add(function (selectedItem) {
					$scope.isShow = false;
					$scope.model = selectedItem;
					if (angular.isFunction($scope.onItemSelected)){
						$scope.onItemSelected(selectedItem);
					}
				});

				$scope.$on('$destroy', function  () {
					popupCloseListener.remove();
					itemSelectListener.remove();
				});
			}
		};
	}
})(angular.module('combobox'));