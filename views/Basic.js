/**
 * An abstract View object, which is extended in other views
 */
var Backbone = require('backbone'),
    _ = require('underscore'),
    fs = require('fs');

module.exports = Backbone.View.extend({
    initialize: function(){
        if (!this.template && this.templateFile) {
            this.template = _.template(fs.readFileSync(this.templateFile, "utf-8"));
        }
    },
    render: function() {
        this.$el.html(this.template({t: this.model.attributes}));
        return this.$el;
    }
});