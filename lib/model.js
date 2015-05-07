// Copyright (c) Visual Data Solutions, Inc. All rights reserved. This source code is distributed under the terms of the MIT license. See LICENSE file in the project root for complete license information.

var DynObject = require('dynel-core').DynObject;

module.exports = DynObject.extend({

    className: 'Model',

    override: {
        set: function(_super, name, value) {

            if (this.define) {
                if (this.define.hasOwnProperty(name)) {
                    var valid = this.define[name].validate(value);
                    if (!valid.valid) {
                        throw name + ': '+ valid.message;
                    }
                    value = this.define[name].map(value);
                }
            }

            _super(name, value);
        }
    },

    init: function(data) {

        if (data && data.className) {
            this.className = data.className;
        }
        this.initDefinition();
        this.initData(data);
        this.isModel = true;
    },

    initData: function(data) {
        if (!data)
            return;

        var values = data;
        if (typeof data.data === 'string') {
            values = JSON.parse(data.data);
        }
        for(var p in values) {
            if (values.hasOwnProperty(p)) {
                if (this.define) {
                    if (this.define.hasOwnProperty(p)) {
                        var dt = this.define[p];

                        var value = dt.map(values[p]);
                        var valid = dt.validate(value);
                        if (!valid.valid) {
                            throw p + ': '+ valid.message;
                        } else {
                          this[p] = value;
                        }

                        if (dt.isKey) {
                            this.keyName = p;
                        }
                    }
                }
            }
        }
    },

    key: function() {
        if (this.keyName) {
            return this.get(this.keyName);
        }
    },

    initDefinition: function() {

        if (!this.define)
            return;

        for(var p in this.define) {
            if (this.define.hasOwnProperty(p)) {
                this.set(p, this.define[p].default());
            }
        }
    },

    forEachProperty: function(callback) {
        if (!this.define)
            return;

        for(var p in this.define) {
            if (this.define.hasOwnProperty(p)) {
                callback.call(this, p, this.define[p]);
            }
        }
    },

    isValid: function() {

        var validResult = true;

        this.forEachProperty( function(name, datatype) {
            var result = datatype.validate(this.get(name));
            if (!result.valid) {
                validResult = false;
            }
        });

        return validResult;
    },


    update: function(model) {
        if (this.define) {
            for(var p in this.define) {
                if (this.define.hasOwnProperty(p)) {
                    var dt = this.define[p];

                    if (model.hasOwnProperty(p)) {
                        var value = dt.map(model[p]);
                        this.set(p, value);
                    }
                }
            }
        }
    }
});
