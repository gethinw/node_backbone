var Backbone = require('backbone'),
    express = require('express'),
    domino = require('domino'),
    zepto = require('zepto-node'),
    mongoose = require('mongoose');

//Backbone needs jquery-esque zepto, and zepto needs a dom...
Backbone.$ = zepto(domino.createWindow());

mongoose.connect("mongodb://gethinw@googlemail.com:Cassette1@alex.mongohq.com:10049/app13891559");

var app = express(),
    store = app.locals.store = new (require('./app/Store'))('models,collections,views'.split(',')),
    pageSchema = new mongoose.Schema({
        _id: String,
        title: String,
        content: String,
        footer: String
    }),
    Pages = mongoose.model('Page', pageSchema),
    site = new (store.collections.get('Site'))(),
    loadPages = function(err, docs){
        if (!docs.length) {
            Pages.create([
                {
                    _id: 'home',
                    title: 'Homepage',
                    content: 'The main content',
                    footer: 'Footer content'
                },
                {
                    _id: 'about',
                    title: 'About me',
                    content: 'This is some information about me',
                    footer: 'Footer content'
                },
                {
                    _id: '404',
                    title: 'An error has occured',
                    content: 'An error has occured',
                    footer: 'Footer content'
                }
            ]);
        } else {
            site.set(docs);
        }
    };

Pages.find({}, loadPages);

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