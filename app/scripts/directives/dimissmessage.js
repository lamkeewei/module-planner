'use strict';

angular.module('modulePlannerApp')
  .directive('dimissMessage', function ($timeout) {
    return {
      template: '<p class="help-block">{{message}}</p>',
      restrict: 'E',
      scope: {
        message: '=message'
      },
      link: function postLink(scope, element, attrs) {
        scope.$watch('message', function(newVal, oldVal){
          if (newVal) {
            $timeout(function(){
              scope.message = '';
            }, 2000);
          }
        });
      }
    };
  });
