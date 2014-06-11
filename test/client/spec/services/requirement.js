'use strict';

describe('Service: Requirement', function () {

  // load the service's module
  beforeEach(module('modulePlannerApp'));

  // instantiate service
  var Requirement;
  beforeEach(inject(function (_Requirement_) {
    Requirement = _Requirement_;
  }));

  it('should do something', function () {
    expect(!!Requirement).toBe(true);
  });

});
