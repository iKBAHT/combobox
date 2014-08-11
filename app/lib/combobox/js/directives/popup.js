'use strict';
(function (module, $) {
  module.directive('popup', popupDirective);

  popupDirective.inject = [];
  function popupDirective() {
    return {
      restrict: 'EA',
      replace: true,
      templateUrl: '/lib/combobox/js/views/popup.html',
      
      link: function ($scope, element) {
        debugger;
      }
    };
  }
})(angular.module('combobox'), jQuery);