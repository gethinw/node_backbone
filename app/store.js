var requireAll = require('require-all'),
    _ = require('underscore'),
    StoreScope = require('./StoreScope');

module.exports = function(app, refresh){
    
    if (!('store' in app.locals) || refresh) {
        var store = app.locals.store = {};
        
        ['models','collections','views'].forEach(function(el){
            store[el] = new StoreScope(store, requireAll({
                dirname     :  __dirname + '/../' + el,
                filter      :  /(.+)\.js$/
            }));
        });
    }
    
    return app.locals.store;
};