// Copyright (c) Visual Data Solutions, Inc. All rights reserved. This source code is distributed under the terms of the MIT license. See LICENSE file in the project root for complete license information.

var DynObject = require('dynel-core').DynObject;
var ModelRegistry = require('./modelRegistry.js');
var CoreObject = require('dynel-core').CoreObject;
var EventSource = require('dynel-core').EventSource;


module.exports = CoreObject.extend({
    className: 'Collection',

    mixins: [
        EventSource
    ],

    init: function(data) {

        this.items = [];
        this.length = 0;

        if (data)
        {

            if (data.className) {
                this.className = data.className;
            }
            if (data.type) {
                if (typeof data.type === 'string')
                    this.modelType = ModelRegistry.get(data.type);
                else
                    this.modelType = data.type;
            }
            if (data.data) {
                if (typeof data.data === 'string')
                    data.data = JSON.parse(data.data);

                if( Object.prototype.toString.call( data.data ) === '[object Array]' ) {
                    data.data.forEach( function(item) {
                        this.add(item);
                    }, this);
                }
            }
        }

        this.isCollection = true;
    },

    add: function(model) {

        var self = this;
        if (!model.isModel) {
            if (this.modelType) {

                model = new this.modelType(model);

            }
        }

        if (model.isModel) {
            model.on('change', function() {
                self.emit('update', model);
            });
        }
        this.items.push(model);

        this.length++;



        this.emit('add', model);
    },

    at: function(index) {
        if (index >= this.length) {
            throw 'Index out of range.';
        }

        return this.items[index];
    },


    forEach: function(cb, context) {
        this.items.forEach( cb, context );
    }

});


/*
module.exports = DynObject.extend({

    className: 'Collection',
    init: function(data) {

        this.items = [];
        this.length = 0;

        if (data)
        {

            if (data.className) {
                this.className = data.className;
            }
            if (data.type) {
                if (typeof data.type === 'string')
                    this.modelType = ModelRegistry.get(data.type);
                else
                    this.modelType = data.type;
            }
            if (data.data) {
                if (typeof data.data === 'string')
                    data.data = JSON.parse(data.data);

                if( Object.prototype.toString.call( data.data ) === '[object Array]' ) {
                    data.data.forEach( function(item) {
                        this.add(item);
                    }, this);
                }
            }
        }

        this.isCollection = true;
    },

    add: function(model) {

        var self = this;
        if (!model.isModel) {
            if (this.modelType) {

                model = new this.modelType(model);

            }
        }

        if (model.isModel) {
            model.on('change', function() {
                self.emit('update', model);
            });
        }
        this.items.push(model);

        this.length++;



        this.emit('add', model);
    },

    at: function(index) {
        if (index >= this.length) {
            throw 'Index out of range.';
        }

        return this.items[index];
    },


    forEach: function(cb, context) {
        this.items.forEach( cb, context );
    }

});
*/
