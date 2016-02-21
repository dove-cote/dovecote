require('dovecote/app');
const Project = require('dovecote/components/project/model');
const ProjectService = require('dovecote/components/project/service');
const ProjectGenerator = require('dovecote/components/project/generator');

Project
    .find({})
    .select('_id owner')
    .exec()
    .then((projects) => {
        console.log(`Deploying ${projects.length} project(s)...`);

        const jobs = projects.map(project => ProjectService.deploy(project._id, project.owner));
        return Promise.all(jobs);
    })
    .then(() => {
        console.log('Done!');
        process.exit();
    })
    .catch((err) => {
        console.log(err);
        process.exit();
    });

