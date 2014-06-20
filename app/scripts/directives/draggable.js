'use strict';

angular.module('modulePlannerApp')
  .directive('draggable', function () {
    return {
      restrict: 'A',
      scope: {
        dragData: '=draggable'
      },
      link: function postLink(scope, element, attrs) {
        element.attr('draggable', true);

        element.bind('dragstart', function(e){
          var event = e.originalEvent;
          event.dataTransfer.setData('obj', angular.toJson(scope.dragData));
        });
      }
    };
  });
