require('dovecote/app');
const async = require('async-q');
const Project = require('dovecote/components/project/model');
const ProjectService = require('dovecote/components/project/service');
const ProjectGenerator = require('dovecote/components/project/generator');

Project
    .find({})
    .select('_id owner')
    .exec()
    .then((projects) => {
        console.log(`Deploying ${projects.length} project(s)...`);
        return async.eachSeries(projects, project => ProjectService.deploy(project._id, project.owner));
    })
    .then(() => {
        console.log('Done!');
        process.exit();
    })
    .catch((err) => {
        console.log(err.stack);
        process.exit();
    });

