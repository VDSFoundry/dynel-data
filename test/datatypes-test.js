// Copyright (c) Visual Data Solutions, Inc. All rights reserved. This source code is distributed under the terms of the MIT license. See LICENSE file in the project root for complete license information.

/*jshint expr: true*/

var chai = require('chai');
var expect = chai.expect;
var Model = require('../lib/model.js');
var DT = require('../lib/datatypes.js');
var ModelRegistry = require('../lib/modelRegistry.js');

describe('DT.boolean', function() {
    this.timeout(500);

    it('should accept true or false only', function(done) {

        var prop = DT.boolean();

        expect(prop.map('true')).to.be.true;
        expect(prop.map('false')).to.be.false;
        expect(prop.map(true)).to.be.true;
        expect(prop.map(false)).to.be.false;
        expect(prop.map('what')).to.be.false;
        expect(prop.map(0)).to.be.false;
        expect(prop.map(1)).to.be.false;

        done();
    });
});

describe('DT.model.map with object', function() {
    this.timeout(500);

    it('should return a valid Model object', function(done) {

        var ModelType = Model.extend({
            define: {
                id: DT.number(),
                name: DT.string()
            }
        });

        var prop = DT.model({type: ModelType});

        var model = prop.map({
            id: 1,
            name: 'whatever'
        });

        expect(model.id).to.equal(1);
        expect(model.name).to.equal('whatever');

        done();
    });
});

describe('DT.model.map with JSON', function() {
    this.timeout(500);

    it('should return a valid Model object', function (done) {

        var json = '{ "id":"1", "name": "whatever"}';

        var ModelType = Model.extend({
            define: {
                id: DT.number(),
                name: DT.string()
            }
        });

        var prop = DT.model({type: ModelType});

        var model = prop.map(json);

        expect(model.id).to.equal(1);
        expect(model.name).to.equal('whatever');

        done();
    });
});



describe('DT.collection.map with array of objects', function() {
    this.timeout(500);

    it('should return a valid collection of Model obejcts', function (done) {

        var data = [
            {
                id: 1,
                name: 'Gerald'
            },
            {
                id: 2,
                name: 'Will'
            }
        ];


        var ModelType = Model.extend({
            className: 'ModelType',
            define: {
                id: DT.number(),
                name: DT.string()
            }
        });

        var prop = DT.collection({type: ModelType});

        var coll = prop.map(data);

        expect(coll.isCollection).to.be.true;
        expect(coll.length).to.be.equal(2);
        expect(coll.at(0).className).to.be.equal('ModelType');
        done();
    });
});

describe('DT.collection.map with JSON', function() {
    this.timeout(500);

    it('should return a valid collection of Model obejcts', function (done) {

        var data = [
            {
                id: 1,
                name: 'Gerald'
            },
            {
                id: 2,
                name: 'Will'
            }
        ];

        var json = JSON.stringify(data);



        var ModelType = Model.extend({
            className: 'ModelType',
            define: {
                id: DT.number(),
                name: DT.string()
            }
        });

        var prop = DT.collection({type: ModelType});

        var coll = prop.map(json);

        expect(coll.isCollection).to.be.true;
        expect(coll.length).to.be.equal(2);
        expect(coll.at(0).className).to.be.equal('ModelType');
        done();
    });
});




describe('DT.collection.map with named type', function() {
    this.timeout(500);

    it('should return a valid collection of Model obejcts', function (done) {

        var data = [
            {
                id: 1,
                name: 'Gerald'
            },
            {
                id: 2,
                name: 'Will'
            }
        ];

        var json = JSON.stringify(data);



        var ModelType = Model.extend({
            className: 'ModelType',
            define: {
                id: DT.number(),
                name: DT.string()
            }
        });

        ModelRegistry.register('ModelType', ModelType);

        var prop = DT.collection({type: 'ModelType'});

        var coll = prop.map(json);

        expect(coll.isCollection).to.be.true;
        expect(coll.length).to.be.equal(2);
        expect(coll.at(0).className).to.be.equal('ModelType');
        done();
    });
});
