'use strict';

angular.module('modulePlannerApp')
  .directive('fullHeight', function ($window) {
    return {
      restrict: 'A',
      scope: {
        offset: '@fullHeight'
      },
      link: function postLink(scope, element, attrs) {
        var offset = scope.offset || 0;
        scope.resize = function(){
          var height = $window.innerHeight - offset;
          element.css('height', height);
        };

        scope.resize();

        angular.element($window).bind('resize', function(){
          scope.resize();
        });
      }
    };
  });
