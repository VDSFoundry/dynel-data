// Copyright (c) Visual Data Solutions, Inc. All rights reserved. This source code is distributed under the terms of the MIT license. See LICENSE file in the project root for complete license information.

/*jshint expr: true*/

var chai = require('chai');
var expect = chai.expect;
var Model = require('../lib/model.js');
var Collection = require('../lib/collection.js');

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


describe('Model.set  with model object param that has collection property, assigns the model correctly', function() {
    this.timeout(500);

    it('should do something', function(done) {

        var ChildItemType = Model.extend({
            define: {
                name: DT.string()
            }
        });

        var ChildType = Model.extend({
            define: {
                name: DT.string(),
                children: DT.collection({type: ChildItemType})
            }
        });

        var ModelType = Model.extend({
            define: {
                id: DT.number(),
                child: DT.model({type: ChildType}),
            }
        });

        var model = new ModelType({
            id: 1,
        });

        var child = new ChildType({name: 'child name', children: new Collection({type: ChildItemType})});
        child.children.add(new ChildItemType({name: 'child item 1'}));
        child.children.add(new ChildItemType({name: 'child item 2'}));
        child.children.add(new ChildItemType({name: 'child item 3'}));

        model.set('child', child);


        expect(model.child.name).to.be.equal('child name');
        expect(model.child.children.length).to.be.equal(3);

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


describe('Model ctor with nested hierarchical children assigns the full model correctly', function() {
    this.timeout(500);

    it('should do something', function(done) {

        var ModelType = Model.extend({
            className: 'ModelType',
            define: {
                name: DT.string(),
                children: DT.collection({type: 'self'})
            }
        });

        var json = '{' +
            '"name":"level1", ' +
            '"children": [' +
            '   {"name":"Gerald"},' +
            '   {"name":"Hudson"},' +
            '   {"name":"Jamie"}' +
            ' ]' +
            '}';



        var model = new ModelType({data: json});

        expect(model.name).to.be.equal('level1');
        expect(model.children.length).to.be.equal(3);
        expect(model.children.at(0).className).to.be.equal('ModelType');
        expect(model.children.at(0).name).to.be.equal('Gerald');

        done();
    });
});

