var DataType = require('./datatype.js');
var Collection = require('./collection.js');

module.exports = {

    string: DataType.extend({

        override: {
            init: function (_super, options) {
                "use strict";

                if (options) {
                    if (options.required !== undefined) {
                        this.required = options.required;
                    }
                    if (options.default) {
                        this.defaultValue = options.default;
                    }
                }
            },
        },

        default: function() {
            if (this.defaultValue !== undefined)
                return this.defaultValue;

            return '';
        },

        map: function(value) {
            if (value === null)
                return null;

            if (value === undefined)
                return undefined;

            return '' + value;
        },

        validate: function(value) {
            if (this.required) {
                if (value === undefined || value == null || value === '')
                {
                    return {
                        valid: false,
                        message: '{name} is required'
                    };
                }
            }
            return { valid: true };
        },
    }),

    number: DataType.extend({

        override: {
            init: function (_super, options) {
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

                    if (options.nullable) {
                        this.nullable = true;
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
        },

        map: function(value) {
            if (value === null || value === undefined)
                return null;

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

        override: {

            init: function(_super, options) {
                "use strict";

                if (options) {
                    if (options.nullable) {
                        this.nullable = true;
                    }
                }
            }
        },

        default: function() {
            if (this.nullable)
                return null;

            return false;
        },

        map: function(value) {
            if (value === true || value == 'true')
                return true;

            if (this.nullable)
                return null;

            return false;
        },
    }),

    datetime: DataType.extend({

        override: {

            init: function(_super, options) {
                "use strict";

                if (options) {
                    if (options.nullable) {
                        this.nullable = true;
                    }
                }
            }
        },

        default: function() {
            if (this.nullable)
                return null;

            return new Date();
        },

        map: function(value) {
            return new Date(value);
        }
    }),

    object: DataType.extend({
        default: function() {
            return {};
        },
        map: function(value) {
            if (typeof value === 'string') {
                return JSON.parse(value);
            }
            return value;
        }
    }),


    model: DataType.extend({

        override: {
            init: function (_super, options) {
                if (options) {
                    if (options.type) {
                        this.modelType = options.type;
                    }
                }
            }
        },

        map: function(value) {
            if (typeof value === 'string') {
                return new this.modelType(JSON.parse(value));
            }
            if (value.isModel && value.classType == this.modelType)
                return value;

            return new this.modelType(value);
        },

        default: function() {
            return new this.modelType();
        },

        set: function(obj, value) {
            obj.update(value);
        }
    }),

    array: DataType.extend({

        map: function (value) {
            if (typeof value === 'string') {
                return JSON.parse(value);
            }
            return value;
        },

        default: function() {
            return [];
        }
    }),

    collection: DataType.extend({

        override: {
            init: function (_super, options) {
                if (options) {
                    if (options.type) {
                        this.modelType = options.type;
                    }
                }
            },
        },

        map: function (value) {
            if (value.isCollection && value.modelType == this.modelType)
                return value;

            return new Collection({type: this.modelType, data: value});
        },

        default: function() {
            return new Collection({type: this.modelType});
        },

        adjust: function(model) {
            if (this.modelType == 'self')
                this.modelType = model.classType;
        },

        set: function(obj, value) {
            obj.update(value);
        }

    }),

};
