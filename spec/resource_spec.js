'use strict';

var expect    = require('chai').expect
  , resource  = require('../lib/resource');

describe('Resource', function() {

  it('should create with name and url path', function() {
    var Resource = new (resource.create('Foo', { path: '/foo' }));
    expect(Resource).to.have.property('_name', 'Foo');
    expect(Resource._options.path).to.be.equal('/foo');
  });

  it('should create with name and url path', function() {
    expect(function() {
      return resource.create({ path: '/foo' })
    }).to.throw(/provide a resource name/);
  });

});
