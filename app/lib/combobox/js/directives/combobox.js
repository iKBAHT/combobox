'use strict';
(function (module, $) {
	module.directive('combobox', comboboxDirective);

	comboboxDirective.inject = ['ComboboxList'];
	function comboboxDirective(ComboboxList) {
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
			link: function ($scope, element) {
				var options = angular.extend({
					lazyLoad: false,
					emptyText: 'Нет', // показывается когда не задан текущий выбранный элемент
					noResultText: 'Не найдено', // показывается когда поиск не дал результата
					listEmptyText: 'Список пуст', // показывается когда нет списка вариантов
					loadProcessText: 'Загрузка', // текст для отображения во время загрузки
					defaultSearchText: 'Поиск',
					needSearch: true,  // показывать ли окно поиска. если false, то не показывать никогда, если true, то в зависимости от countToShowSearch
					countToShowSearch: 4, // после какого количества элементов надо показывать поиск
					itemsToShow: 6 // сколько элементов влезает до появления скролла
				}, $scope.options || {});

				var	listContainer = element.children('div'),
						itemHeight = 29,
						comboboxList = new ComboboxList(options.lazyLoad);				

				function init () {
					$scope.isShowPopup = false;
					$scope.isShowSearch = false;
					$scope.noResultText = options.noResultText;
					$scope.loadProcessText = options.loadProcessText;
					$scope.listEmptyText = options.listEmptyText;
					$scope.placeholderText = options.defaultSearchText;

					setMaxVisibleItems(options.itemsToShow);

					comboboxList.whenSourceSet(function () {
						if (options.needSearch && (comboboxList.getTotalLength() > options.countToShowSearch)){
			        $scope.isShowSearch = true;
			      }
					});				
					comboboxList.setDataSource($scope.source);	

					popupCloseListener.set(function () {
						changeIsShowPopup(false);
					});

					itemSelectListener.set(selectItem);

					$scope.$on('$destroy', function () {
						popupCloseListener.remove();
						itemSelectListener.remove();
						upAndDownListener.remove();
					});
				}

				function selectItem (selectedItem) {
					changeIsShowPopup(false);
					$scope.model = selectedItem;
					upAndDownListener.clearSelected();
					$scope.searchText = '';
					comboboxList.clearSearch();
					if (angular.isFunction($scope.onItemSelected)){
						$scope.onItemSelected(selectedItem);
					}
				}

				function changeIsShowPopup (newValue) {
					$scope.isShowPopup = newValue;
					if ($scope.isShowPopup){
						configurePopup();
	          upAndDownListener.set(selectItem);
					} else {
						upAndDownListener.remove();
					}					
				}

				// расчитать в какое место отобразить попап
				function configurePopup() {
					var deltaHeight =  $(window).height() - element.offset().top - element.height(),
						innerHeight = listContainer.outerHeight(),
          	infoCssSettings = {},
          	getOffset = function () {
          		return element.outerHeight() + 5;
          	};

          if (deltaHeight < innerHeight){
              listContainer.addClass('top');
              infoCssSettings = {
                bottom: getOffset(),
                top: 'auto',
              };
          } else {
          	listContainer.removeClass('top');
              infoCssSettings = {
                top: getOffset(),
                bottom: 'auto',
              };
          }

          listContainer.css(infoCssSettings);
				}

				function setMaxVisibleItems (count) {
					listContainer.find('ul').css({
						'max-height': count*itemHeight + 'px'
					});
				}

				$scope.openPopup = function () {
					comboboxList.prepare();
					changeIsShowPopup(!$scope.isShowPopup);
				};

				$scope.search = function () {
					comboboxList.search($scope.searchText);
		    };

		    $scope.getSource = function () {
		      return comboboxList.getFiltredList();
		    };
		    
				$scope.getCurrentItem = function () {
					return $scope.model && $scope.model.value || options.emptyText;
				};

		    $scope.isNeedShowNoResultText = function () {
		      return $scope.searchText && comboboxList.getFiltredListLength() === 0;
		    };

		    $scope.isNeedShowListEmptyText = function () {
		      return comboboxList.isListReady() && comboboxList.getTotalLength() === 0;
		    };

		    $scope.isNeedShowLoadProcessText = function () {
		      return comboboxList.isLoadProcess();
		    };	    



				// закрытие попапа при клике вне попапа
				var popupCloseListener = {
					listenersUniqId: getRandomString(),
					set: function (callback) {
						$('html').on('click.' + this.listenersUniqId, function (event) {
							var parentsMenuDown = $(event.target).parents('.menu_down');
							if (parentsMenuDown[0] !== element[0]){
								callback();
								$scope.$apply();
							}
						});
					},
					remove: function () {
						$('html').off('click.' + this.listenersUniqId);
					}
				};

				// выбор элемента. реализованно через события jQuery чтобы снизить нагрузку по памяти
				// так как ангуляровский ng-click создаст listener на каждый вариант, а здесь только 1
				var itemSelectListener = {
					set: function (onSelect) {
						$(element).on('click', 'li>a', function () {
							var selectedItem = $(this).data('item');
							onSelect(selectedItem);
							$scope.$apply();
						});
					},
					remove: function () {
						$(element).off('click');
					}
				};

				var upAndDownListener = {
					UP_KEY_CODE: 38,
					DOWN_KEY_CODE: 40,
					ENTER_KEY_CODE: 13,
					selectedClass: 'selected',
					listenersUniqId: getRandomString(),
					$ul: listContainer.find('ul'),

					clearSelected: function () {
						listContainer.find('li.' + upAndDownListener.selectedClass).removeClass(upAndDownListener.selectedClass);
						upAndDownListener.$ul.scrollTop(0);
					},

					set: function (onSelect) {
						$('html').on('keydown.' + this.listenersUniqId, function (event) {
							var up = event.keyCode === upAndDownListener.UP_KEY_CODE,
								down = event.keyCode === upAndDownListener.DOWN_KEY_CODE,
								enter = event.keyCode === upAndDownListener.ENTER_KEY_CODE,
								selectedElement, // текущий выбранный
								oldSelectedElement,
								items,
								selectedItemIndex;

							if (!(up || down || enter)){
								return;
							}
							selectedElement = listContainer.find('li.' + upAndDownListener.selectedClass); 

							if (enter) { // если нажали на ентер, производим выбор элемента
							    if (selectedElement.length > 0) {
										var selectedItem = selectedElement.children().data('item');
										onSelect(selectedItem);
										$scope.$apply();
							    }
							    return;
							}
							items = $('li', listContainer);
							oldSelectedElement = selectedElement;

							if (up) {
						    if (selectedElement.length === 0){
						      selectedElement = items.filter(':visible:last');
						    }
						    else {
					        selectedElement = selectedElement.prevAll(':visible').eq(0);
					        if (selectedElement.length === 0){
					          selectedElement = items.filter(':visible:last');
					        }
						    }
							} else if (down) {
						    if (selectedElement.length === 0){
					        selectedElement = items.filter(':visible').eq(0);
						    }
						    else {
					        selectedElement = selectedElement.nextAll(':visible').eq(0);
					        if (selectedElement.length === 0){
									  selectedElement = items.filter(':visible').eq(0);
					        }
						    }
							}

							selectedElement.addClass(upAndDownListener.selectedClass);
							oldSelectedElement.removeClass(upAndDownListener.selectedClass);
							selectedItemIndex = selectedElement.index(); // номер по счету
							upAndDownListener.$ul.scrollTop(itemHeight*selectedItemIndex);
						});
					},
					remove: function () {
						$('html').off('keydown.' + this.listenersUniqId);
					}
				};				

				init();
			}
		};
	}

	function getRandomString () {
		return Math.floor(Math.random()*1000000).toString();
	}
})(angular.module('combobox'), jQuery);