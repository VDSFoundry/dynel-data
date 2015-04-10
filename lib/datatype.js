var DynObject = require('dynel-core').DynObject;

module.exports = DynObject.extend({
    validate: function(value) {
        return { valid: true };
    }
});
