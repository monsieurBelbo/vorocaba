'use strict';

describe('Directive: cabaMap', function () {

  // load the directive's module
  beforeEach(module('vonocabaApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<caba-map></caba-map>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the cabaMap directive');
  }));
});
