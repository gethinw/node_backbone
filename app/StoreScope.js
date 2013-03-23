var _ = require('underscore');

/*we allow modules to be defined in two ways:
standard:   module.exports = Backbone.Model.extend(...)
extended:   module.exports = function(store){
                return Backbone.Model.extend(...something referencing store object...)
            }
*/
var StoreScope = function(store, contents){
    this.get = function(key){
        if (key in contents && !('__super__' in contents[key]) && _.isFunction(contents[key])) {
            return contents[key].call(this, store);
        }
        return contents[key];
    };
};

module.exports = StoreScope;