'use strict';

var chai      = require('chai').use(require('sinon-chai'))
  , sinon     = require('sinon')
  , resource  = require('../lib/resource')
  , expect    = chai.expect;

describe('Resource', function() {

  describe('create', function() {
    it('should not create if name is not a string', function() {
      var names = [{}, undefined, false];
      names.forEach(function(name) {
        expect(function() {
          return new (resource.create(name, { path: '/foo' }));
        }).to.throw(/You need to provide a resource name/);
      }, this);
    });

    it('should not create if path is undefined', function() {
      var paths = [undefined, false];
      paths.forEach(function(path) {
        expect(function() {
          return new (resource.create('Foo', { path: path }));
        }).to.throw(/You need to provide a resource path/);
      }, this);
    });

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
      var assertPageCount = sinon.spy();

      var Resource = new (
        resource.create('Foo', {
        path: '/foo'
      }).on('preFind', assertPageCount));

      Resource.emit('preFind', assertPageCount);

      expect(assertPageCount).to.have.been.called;
    });
  });

  it('should extend base methods from pagarme_resource', function() {
    var Resource = new (
      resource.create('Foo', {
      path: '/foo'
    }));

    var methods = ['create', 'update', 'findBy', 'findById'];
    methods.forEach(function(method) {
      expect(Resource).itself.to.respondTo(method);
    });
  });

  it('should extend with classMethods', function() {
    var assertPageCount = function(){};

    var Resource = new (resource.create('Foo', {
      path: '/foo',
      classMethods: {
        execute: function() {
        }
      }
    }).on('preFind', assertPageCount));

    expect(Resource).itself.to.respondTo('execute');
  });

});
