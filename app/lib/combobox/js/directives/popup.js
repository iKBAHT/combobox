'use strict';
(function (module, $) {
  module.directive('popup', popupDirective);

  popupDirective.inject = [];
  function popupDirective() {
    return {
      restrict: 'EA',
      replace: true,
      scope: true,
      templateUrl: '/lib/combobox/js/views/popup.html',
      //template: '<div><span>ass</span></div>',
      link: function ($scope, element) {
        debugger;
      }
    };
  }
})(angular.module('combobox'), jQuery);