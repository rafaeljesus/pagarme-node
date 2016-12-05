/* jshint -W030 */

'use strict'

const chai = require('chai').use(require('sinon-chai'))
const resource = require('../lib/resource')
const expect = chai.expect

describe('Resource', () => {
  describe('create', () => {
    it('should not create if name is not a string', () => {
      const names = [{}, undefined, false]
      names.forEach((name) => {
        expect(() => {
          return new resource.create(name, {path: '/foo'})()
        }).to.throw(/You need to provide a resource name/)
      }, this)
    })

    it('should not create if path is undefined', () => {
      const paths = [undefined, false]
      paths.forEach((path) => {
        expect(() => {
          return new resource.create('Foo', {path: path})()
        }).to.throw(/You need to provide a resource path/)
      }, this)
    })

    it('should not create without name', () => {
      expect(() => {
        return resource.create({ path:'/foo'})
      }).to.throw(/provide a resource name/)
    })

    it('should create with attributes and callback listeners', () => {
      const beforeFind = function(){}
      const beforeCreate = function(){}
      const Resource = new resource.create('Foo', {
        path: '/foo',
        beforeCreate: beforeCreate,
        beforeFind: beforeFind,
      })()
      expect(Resource).to.have.property('_name', 'Foo')
      expect(Resource.beforeCreate).to.be.a('function')
      expect(Resource.beforeFind).to.be.a('function')
      expect(Resource._options.path).to.be.equal('/foo')
    })
  })

  it('should extend base methods from pagarme_resource', () => {
    const Resource = new resource.create('Foo', {
      path: '/foo'
    })()
    const methods = ['create', 'update', 'findBy', 'findById']
    methods.forEach((method) => {
      expect(Resource).itself.to.respondTo(method)
    })
  })
})
