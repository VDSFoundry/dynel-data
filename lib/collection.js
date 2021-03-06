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
                else if (data.data.isCollection) {
                    data.data.forEach(function(item) {
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
    },

    find: function(cb, context) {

        var found = [];
        this.forEach(function(item) {
            if (cb.call(context, item)) {
                found.push(item);
            }
        }, this);

        return found;
    },

    findFirst: function(cb, context) {

        var found = null;
        this.items.some(function(item) {
            if (cb.call(context, item))
            {
                found = item;
                return true;
            }
        });
        return found;
    },

    map: function(cb, context) {

        return this.items.map(function(item) {
            return cb.call(context, item);
        });
    },

    remove: function(pred) {
        for (var i = 0; i < this.items.length; i++) {
            if (pred(this.items[i])) {
                return this.items.splice(i, 1);
            }
        }
    },

    serialize: function() {

        var data = [];
        this.forEach(function (value) {
            if (value) {
                if (value.isModel || value.isCollection)
                    value = value.serialize();
            }
            data.push(value);
        }, this);
        return data;
    },



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
