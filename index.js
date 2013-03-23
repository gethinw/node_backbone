var Backbone = require('backbone'),
    express = require('express'),
    domino = require('domino'),
    zepto = require('zepto-node');

//Backbone needs jquery-esque zepto, and zepto needs a dom...
Backbone.$ = zepto(domino.createWindow());

var app = express(),
    store = require('./app/store')(app);

var site = new (store.collections.get('Site'))([
        {
            id: 'home',
            title: 'Homepage',
            content: 'The main content',
            footer: 'Footer content'
        },
        {
            id: 'about',
            title: 'About me',
            content: 'This is some information about me',
            footer: 'Footer content'
        },
        {
            id: '404',
            title: 'An error has occured',
            content: 'An error has occured',
            footer: 'Footer content'
        }
    ]);

app.use(express.static(__dirname))
    
    .get('/:page?', function(req, res, next){
        var page = site.get(req.params.page || 'home'),
            view = new (store.views.get('ViewPage'))({model: page});
        
        if (!page) {
            next(new Error('Page \'' + req.params.page + '\' not found.'));
        }
        
        res.setHeader('Content-Type', 'text/html');
        res.send(view.render().html());
    })
    .use(function(err, req, res, next){
        var page = site.get('404').set('content', err),
            view = new (store.views.get('ViewPage'))({model: page});
        
        res.setHeader('Content-Type', 'text/html');
        res.send(404, view.render().html());
    })
    
    .listen(process.env.PORT || 8080);