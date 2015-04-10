// Copyright (c) Visual Data Solutions, Inc. All rights reserved. This source code is distributed under the terms of the MIT license. See LICENSE file in the project root for complete license information.

var CoreObject = require('dynel-core').CoreObject;

var ModelRegistry = CoreObject.extend({

    init: function() {
        "use strict";

        this.registeredModelClasses = {};
    },

    register: function(name, modelClass) {
        "use strict";

        this.registeredModelClasses[name] = modelClass;
    },

    get: function(name) {
        "use strict";

        return this.registeredModelClasses[name];
    },

    create: function(name,data) {
        "use strict";

        var modelClass = this.get(name);
        if (modelClass)
        {
            return new modelClass(data);
        }
    }
});


module.exports = new ModelRegistry();
