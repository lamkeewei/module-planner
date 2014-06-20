'use strict';

angular.module('modulePlannerApp')
  .directive('droppable', function () {
    return {
      restrict: 'A',
      scope: {
        droppable: '&',
        hoverClass: '@'
      },
      link: function postLink(scope, element, attrs) {
        element.bind('dragover', function(e){
          e.stopPropagation();
          e.preventDefault();

          element.addClass(scope.hoverClass);
        });

        element.bind('dragleave', function(e){
          element.removeClass(scope.hoverClass);
        });

        element.bind('drop', function(e){
          var fn = scope.droppable || angular.noop;

          var data = e.originalEvent.dataTransfer.getData('obj');
          data = angular.fromJson(data);
          element.removeClass(scope.hoverClass);
          
          scope.$apply(function(){
            fn({data: data});
          });
        });
      }
    };
  });