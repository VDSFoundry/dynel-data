var CoreObject = require('dynel-core').CoreObject;

module.exports = CoreObject.extend({

    init: function() {
    },

    validate: function(value) {
        return { valid: true };
    },
});
