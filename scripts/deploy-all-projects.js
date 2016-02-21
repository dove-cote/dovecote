require('dovecote/app');
const Project = require('dovecote/components/project/model');
const ProjectService = require('dovecote/components/project/service');

Project
    .find({})
    .select('_id owner')
    .exec((err, projects) => {
        if (err)
            return console.log('Cannot get projects', err);

        const jobs = projects.map(project => ProjectService.deploy(project._id, project.owner));
        return Promise.all(jobs);
    })
    .then(() => {
        console.log('Done!');
        setTimeout(process.exit.bind(process), 1000);
    })
    .catch((err) => {
        console.log(err);
    });

