var Backbone = require('backbone');

module.exports = function(store){
    return Backbone.Collection.extend({model: store.models.get('Page')});
};