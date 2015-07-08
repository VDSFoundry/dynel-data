var CoreObject = require('dynel-core').CoreObject;

module.exports = CoreObject.extend({
    validate: function(value) {
        return { valid: true };
    }
});
