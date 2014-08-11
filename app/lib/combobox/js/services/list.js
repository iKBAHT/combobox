'use strict';
(function (module) {
  module.factory('ComboboxList', comboboxList);

  comboboxList.inject = [];
  function comboboxList() {

    // найти в массиве list элементы содержащие text
    function findItemsByText (list, text) {
      var findedItems = [];
      if (!text) {
        return list;
      }
      text = text.toLowerCase();
      for(var i=0, length=list.length;i<length;++i){
        if (list[i].value.toLowerCase().indexOf(text) !== -1){
          findedItems[findedItems.length] = list[i];
        }
      }
      return findedItems;
    }

    function List(lazyLoad) {
      this.list = []; // полный список вариантов
      this.filtredList = []; // список вариантов, удовлетворяющих текущему поиску
      this.source = null; // источник данных. массив либо promise
      this.listInited = false; // загруженны ли данные в list
      this.listLoadStarted = false; // началась ли загрузка если источник это promise
      this.lazyLoad = lazyLoad; // ленивая загрузка
    }

    List.prototype.setDataSource = function (source) {
      this.source = source;
      if (angular.isArray(source)){
        // в качестве источника массив
        this.setItems(source);
      } else if (angular.isFunction(source)) {
        // в качестве источника promise
        if (!this.lazyLoad){
          this.loadItemsFromPromise();
        }
      } else {
        throw new TypeError('combobox source must be array or promise function');
      }
    };

    List.prototype.setItems = function (items) {
      this.filtredList = this.list = items;
      this.listInited = true;
      if (this.sourceInitCallback) {
        this.sourceInitCallback();
      }
    };

    List.prototype.whenSourceSet = function (callback) {
      this.sourceInitCallback = callback;
    };

    // если источником данных был promise
    List.prototype.loadItemsFromPromise = function () {
      var that = this;
      that.listLoadStarted = true;
      that.source().then(function (items) {
        if (!angular.isArray(items)){
          throw new TypeError('combobox source promise function must return array');
        }
        that.setItems(items);
        that.listLoadStarted = false;
      });
    };

    // загрузить данные если из еще нет из за lazyLoad
    List.prototype.prepare = function () {
      if (this.isListNeedToLoad()){
        this.loadItemsFromPromise();
      }
    };

    List.prototype.isListNeedToLoad = function () {
      return !(this.listInited || this.listLoadStarted);
    };

    List.prototype.isListReady = function () {
      return this.listInited;
    };

    List.prototype.isLoadProcess = function () {
      return this.listLoadStarted;
    };

    List.prototype.getTotalLength = function () {
      return this.list.length;
    };

    List.prototype.getFiltredListLength = function () {
      return this.filtredList.length;
    };

    List.prototype.search = function (text) {
      this.filtredList = findItemsByText(this.list, text);
    };

    List.prototype.clearSearch = function () {
      this.search('');
    };

    List.prototype.getFiltredList = function () {
      return this.filtredList;
    };

    return List;
  }
})(angular.module('combobox'));