var express = require('express');
var db = require('../models');
var async = require('async');
var bodyParser = require('body-parser');
var router = express.Router();


// POST /projects - create a new project
router.post('/', function(req, res) {
  var categories = [];
  if(req.body.categories){
    categories = req.body.categories.split(",");
  }
  db.project.create({
    name: req.body.name,
    githubLink: req.body.githubLink,
    deployedLink: req.body.deployedLink,
    description: req.body.description
  })
  .then(function(project) {
    if(categories.length > 0){
      async.forEach(categories, function(category, callback){
        db.category.findOrCreate({
          where: {name: category.trim()}
        }).spread(function(newCategory, wasCreated){
          callback();
        })
      })
    }, function(){
      res.redirect('/projects/'+project.id);
    } else {
      res.redirect('/projects/'+project.id);
    }
  })
  .catch(function(error) {
    console.log(error)
    res.status(400).render('main/404');
  });
});

// GET /projects/new - display form for creating a new project
router.get('/new', function(req, res) {
  res.render('projects/new');
});

// GET /projects/:id - display a specific project
router.get('/:id', function(req, res) {
  db.project.find({
    where: { id: req.params.id },
    include: [db.category]
  })
  .then(function(project) {
    if (!project) throw Error();
    res.render('projects/show', { project: project });
  })
  .catch(function(error) {
    console.log(error)
    res.status(400).render('main/404');
  });
});

module.exports = router;
