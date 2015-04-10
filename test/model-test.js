// Copyright (c) Visual Data Solutions, Inc. All rights reserved. This source code is distributed under the terms of the MIT license. See LICENSE file in the project root for complete license information.

/*jshint expr: true*/

var chai = require('chai');
var expect = chai.expect;
var Model = require('../lib/model.js');
var DT = require('../lib/datatypes.js');

var TestModel = Model.extend({
    className: 'TestModel',
    define: {
        name: DT.string(),
        age: DT.number({ min: 1, max: 120}),
    }
});

describe('Model', function() {
    this.timeout(500);

    it('should do something', function(done) {

        var model = new TestModel({
           name: 'Gerald',
            age: 2
        });

        done();
    });
});

describe('Model ctor with model object param, assigns the model correctly', function() {
    this.timeout(500);

    it('should do something', function(done) {

        var ModelType = Model.extend({
            define: {
                id: DT.number(),
                child: DT.model({type: TestModel}),
            }
        });

        var model = new ModelType({
            id: 1,
            child: new TestModel({
               name: 'Gerald',
                age: 2
            }),
        });

        expect(model.child.name).to.be.equal('Gerald');
        expect(model.child.age).to.be.equal(2);

        done();
    });
});

describe('Model.set  with model object param, assigns the model correctly', function() {
    this.timeout(500);

    it('should do something', function(done) {

        var ModelType = Model.extend({
            define: {
                id: DT.number(),
                child: DT.model({type: TestModel}),
            }
        });

        var model = new ModelType({
            id: 1,
        });

        model.set('child', new TestModel({
            name: 'Gerald',
            age: 2
        }));


        expect(model.child.name).to.be.equal('Gerald');
        expect(model.child.age).to.be.equal(2);

        done();
    });
});

describe('Model ctor with normal object param, assigns the model correctly', function() {
    this.timeout(500);

    it('should do something', function(done) {

        var ModelType = Model.extend({
            className: 'ModelType',
            define: {
                id: DT.number(),
                child: DT.model({type: TestModel}),
            }
        });

        var model = new ModelType({
            id: 1,
            child: { name: 'Gerald', age: 2 }
        });


        expect(model.child.className).to.be.equal('TestModel');
        expect(model.child.name).to.be.equal('Gerald');
        expect(model.child.age).to.be.equal(2);

        done();
    });
});

describe('Model.set with normal object param, assigns the model correctly', function() {
    this.timeout(500);

    it('should do something', function(done) {

        var ModelType = Model.extend({
            className: 'ModelType',
            define: {
                id: DT.number(),
                child: DT.model({type: TestModel}),
            }
        });

        var model = new ModelType({
            id: 1,
        });

        model.set('child', { name: 'Gerald', age: 2 });


        expect(model.child.className).to.be.equal('TestModel');
        expect(model.child.name).to.be.equal('Gerald');
        expect(model.child.age).to.be.equal(2);

        done();
    });
});


describe('Model ctor with JSON param, assigns the model correctly', function() {
    this.timeout(500);

    it('should do something', function(done) {

        var ModelType = Model.extend({
            className: 'ModelType',
            define: {
                id: DT.number(),
                child: DT.model({type: TestModel}),
            }
        });

        var model = new ModelType({
            id: 1,
            child: '{ "name":"Gerald", "age": "2" }'
        });


        expect(model.child.className).to.be.equal('TestModel');
        expect(model.child.name).to.be.equal('Gerald');
        expect(model.child.age).to.be.equal(2);

        done();
    });
});

describe('Model.set with JSON param, assigns the model correctly', function() {
    this.timeout(500);

    it('should do something', function(done) {

        var ModelType = Model.extend({
            className: 'ModelType',
            define: {
                id: DT.number(),
                child: DT.model({type: TestModel}),
            }
        });

        var model = new ModelType({
            id: 1,
        });
        model.set('child', '{ "name":"Gerald", "age": "2" }');


        expect(model.child.className).to.be.equal('TestModel');
        expect(model.child.name).to.be.equal('Gerald');
        expect(model.child.age).to.be.equal(2);

        done();
    });
});


describe('Model ctor with nested JSON param, assigns the full model correctly', function() {
    this.timeout(500);

    it('should do something', function(done) {

        var ModelType = Model.extend({
            className: 'ModelType',
            define: {
                id: DT.number(),
                child: DT.model({type: TestModel}),
            }
        });

        var json = '{"id":"1", "child":{"name":"Gerald", "age":"2"}}';

        var model = new ModelType({data: json});

        expect(model.id).to.be.equal(1);
        expect(model.child.className).to.be.equal('TestModel');
        expect(model.child.name).to.be.equal('Gerald');
        expect(model.child.age).to.be.equal(2);

        done();
    });
});
