'use strict';

describe('Filter: courseFilter', function () {

  // load the filter's module
  beforeEach(module('modulePlannerApp'));

  // initialize a new instance of the filter before each test
  var courseFilter;
  beforeEach(inject(function ($filter) {
    courseFilter = $filter('courseFilter');
  }));

  it('should return the input prefixed with "courseFilter filter:"', function () {
    var text = 'angularjs';
    expect(courseFilter(text)).toBe('courseFilter filter: ' + text);
  });

});
