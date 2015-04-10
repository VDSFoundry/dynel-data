var DataType = require('./datatype.js');
var Collection = require('./collection.js');

module.exports = {

    string: DataType.extend({
        init: function(options) {

        },

        default: function() {
            return '';
        },

        map: function(value) {
            return '' + value;
        }
    }),

    number: DataType.extend({

        init: function(options) {
            "use strict";

            if (options) {
                if (options.min !== undefined) {
                    this.min = options.min;
                    if (!options.default)
                        this.defaultValue = this.min;
                }

                if (options.max !== undefined) {
                    this.max = options.max;
                }

                if (options.default !== undefined) {
                    this.defaultValue = options.default;
                }

                if (this.defaultValue === undefined)
                    this.defaultValue = 0;

                if (options.key)
                    this.isKey = true;
            }
        },

        map: function(value) {
            return Number(value);
        },

        validate: function(value) {
            if (this.min !== undefined) {
                if (value < this.min)
                {
                    return {
                        valid: false,
                        message: 'value cannot be less than ' + this.min
                    };
                }
            }
            if (this.max !== undefined) {
                if (value > this.max)
                    return {
                        valid: false,
                        message: 'value cannot be greater than ' + this.max
                    };
            }

            return { valid: true };
        },

        default: function() {
            return this.defaultValue;
        },
    }),


    boolean: DataType.extend({
        init: function(options) {

        },

        default: function() {
            return false;
        },

        map: function(value) {
            return (value === true || value == 'true');
        },
    }),

    datetime: DataType.extend({
        init: function(options) {

        },

        default: function() {
            return new Date();
        },

        map: function(value) {
            return new Date(value);
        }
    }),


    property: function(name, options) {

    },

    object: DataType.extend({
        init: function(options) {
        },

        default: function() {
            return {};
        },
        map: function(value) {
            return JSON.parse(value);
        }
    }),


    model: DataType.extend({

        init: function(options) {
            if (options.type) {
                this.modelType = options.type;
            }
        },

        map: function(value) {
            if (typeof value === 'string') {
                return new this.modelType(JSON.parse(value));
            }
            return new this.modelType(value);
        },

        default: function() {
            return new this.modelType();
        }
    }),

    collection: DataType.extend({

        init: function (options) {
            if (options.type) {
                this.modelType = options.type;
            }
        },

        map: function (value) {
            return new Collection({type: this.modelType, data: value});
        },

        default: function() {
            return new Collection({type: this.modelType});
        }

    }),

};
