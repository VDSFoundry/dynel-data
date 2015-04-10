// Copyright (c) Visual Data Solutions, Inc. All rights reserved. This source code is distributed under the terms of the MIT license. See LICENSE file in the project root for complete license information.

/*jshint expr: true*/

var chai = require('chai');
var expect = chai.expect;
var Model = require('../lib/model.js');
var DT = require('../lib/datatypes.js');
var Collection = require('../lib/collection.js');
var ModelRegistry = require('../lib/modelRegistry.js');



var TestModel = Model.extend({
    className: 'TestModel',
    define: {
        name: DT.string(),
        age: DT.number({ min: 1, max: 120}),
    }
});

describe('Collection', function() {
    this.timeout(500);

    it('add should fire add event with model', function(done) {

        var coll = new Collection();

        coll.on('add', function(model) {

            expect(model.className).to.be.equal('TestModel');

            done();

        }, this);


        var model = new TestModel({
            name: 'Gerald',
            age: 2
        });

        coll.add(model);
    });
});

describe('Collection', function() {
    this.timeout(500);

    it('ctor with array should create collection of model objects', function(done) {

        var coll = new Collection({
            type: TestModel,
            data: [
                {
                    name: 'Gerald',
                    age: 1
                },
                {
                    name: 'Will',
                    age: 2
                }
            ]
        });

        expect(coll.length).to.be.equal(2);
        expect(coll.at(0).className).to.be.equal('TestModel');
        expect(coll.at(1).className).to.be.equal('TestModel');

        done();

    });
});

describe('Collection', function() {
    this.timeout(500);

    it('add with normal object creates model object', function(done) {

        var coll = new Collection({
            type: TestModel,
        });

        coll.add({ name: 'Gerald', age: 1});
        coll.add({ name: 'Will', age: 2});


        expect(coll.length).to.be.equal(2);
        expect(coll.at(0).className).to.be.equal('TestModel');
        expect(coll.at(1).className).to.be.equal('TestModel');

        done();

    });
});

describe('Collection', function() {
    this.timeout(500);

    it('add with JSON string creates model object', function(done) {

        var coll = new Collection({
            type: TestModel,
        });

        coll.add('{"name":"Gerald", "age":"1"}');
        coll.add('{"name":"Will", "age":"2"}');


        expect(coll.length).to.be.equal(2);
        expect(coll.at(0).className).to.be.equal('TestModel');
        expect(coll.at(1).className).to.be.equal('TestModel');

        done();

    });
});

describe('Collection', function() {
    this.timeout(500);

    it('ctor with JSON string creates model object', function(done) {

        var coll = new Collection({
            type: TestModel,
            data: '[{"name":"Gerald", "age":"1"},{"name":"Will", "age":"2"}]'
        });


        expect(coll.length).to.be.equal(2);
        expect(coll.at(0).className).to.be.equal('TestModel');
        expect(coll.at(1).className).to.be.equal('TestModel');

        done();

    });
});


describe('Collection', function() {
    this.timeout(500);

    it('changing model property fires update event', function(done) {

        var model = new TestModel({
            name: 'Gerald',
            age: 1
        });

        var coll = new Collection({
            type: TestModel,
            data: [ model ]
        });

        coll.on('update', function(item) {
            expect(item.name).to.be.equal('Will');
            done();
        });

        model.set('name', 'Will');
    });
});

describe('Collection', function() {
    this.timeout(500);

    it('forEach iterates through each item in collection', function(done) {

        var sut = new Collection({
            type: TestModel,
            data: [
                {name: 'Gerald', age: 1},
                {name: 'Will', age: 2},
                {name: 'Aaron', age: 3}
            ]
        });

        var index = 0;
        sut.forEach(function(item) {
            if (item.isModel)
                index++;

            if (index == 3)
                done();

        }, this);
    });
});
