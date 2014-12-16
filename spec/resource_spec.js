'use strict';

var chai      = require('chai').use(require('sinon-chai'))
  , sinon     = require("sinon")
  , resource  = require('../lib/resource')
  , expect    = chai.expect;

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

  it('should create with listener callback', function() {
    var listener = sinon.spy();

    var Resource = new (
      resource.create('Foo', {
      path: '/foo'
    }).on('preFind', listener));

    Resource.emit('preFind', listener);

    expect(listener).to.have.been.called;
  });

  it('should inherite base methods from pagarme_resource', function() {
    var Resource = new (
      resource.create('Foo', {
      path: '/foo'
    }));

    expect(Resource).itself.to.respondTo('create');
    expect(Resource).itself.to.respondTo('update');
    expect(Resource).itself.to.respondTo('findBy');
    expect(Resource).itself.to.respondTo('findById');
  });

  it('should create with classMethods', function() {
    var listener = function(){};

    var Resource = new (resource.create('Foo', {
      path: '/foo',
      classMethods: {
        execute: function() {
        }
      }
    }).on('preFind', listener))

    expect(Resource).itself.to.respondTo('execute');
  });

});
