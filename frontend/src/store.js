import _ from 'lodash';

var project = {
    _id: 234,
    name: "e-store",
    multicastIP_: '239.1.0.17',
    services: [
        {
            name: "Stock Service",
            instance: 1,
            code: "",
            meta: {
                position: {
                    x: 320,
                    y: 250
                }
            },
            components: [
                {
                    type: "res",
                    name: "Stock Responder",
                    createdAt: 'Sat Feb 20 2016 11:33:42 GMT+0200 (EET)',
                    updatedAt: 'Sat Feb 20 2016 11:33:42 GMT+0200 (EET)'                    
                }
            ]
        },
        {
            name: "Catalog Service",
            instance: 1,
            code: "",
            meta: {
                position: {
                    x: 500,
                    y: 100
                }
            },
            components: [
                {
                    type: "req",
                    name: "Catalog Requester",
                    createdAt: 'Sat Feb 20 2016 11:33:42 GMT+0200 (EET)',
                    updatedAt: 'Sat Feb 20 2016 11:33:42 GMT+0200 (EET)'                      
                },
                {
                    type: "pub",
                    name: "Catalog Publisher",
                    createdAt: 'Sat Feb 20 2016 11:33:42 GMT+0200 (EET)',
                    updatedAt: 'Sat Feb 20 2016 11:33:42 GMT+0200 (EET)'                      
                }
            ],
            createdAt: 'Sat Feb 20 2016 11:33:42 GMT+0200 (EET)',
            updatedAt: 'Sat Feb 20 2016 11:33:42 GMT+0200 (EET)'              
        },
        {
            name: "Sockend",
            instance: 2,
            code: "",
            meta: {
                position: {
                    x: 150,
                    y: 100
                }
            },
            components: [
                {
                    type: "sockend",
                    name: "Sockend",
                    createdAt: 'Sat Feb 20 2016 11:33:42 GMT+0200 (EET)',
                    updatedAt: 'Sat Feb 20 2016 11:33:42 GMT+0200 (EET)'                      
                }
            ],
            createdAt: 'Sat Feb 20 2016 11:33:42 GMT+0200 (EET)',
            updatedAt: 'Sat Feb 20 2016 11:33:42 GMT+0200 (EET)'  
        }
    ]
};

var app = {

    palette: [
        {type: 'req', icon: 'foo.png', name: 'Requester'},
        {type: 'res', icon: 'foo.png', name: 'Responder'},
        {type: 'pub', icon: 'foo.png', name: 'Publisher'},
        {type: 'sub', icon: 'foo.png', name: 'Subscriber'},
        {type: 'sockend', icon: 'foo.png', name: 'Sockend'}
    ],
    projects: [project]
};

let listeners = [];

const addListener = (callback) => {
    listeners.push(callback);
};

const removeListener = (callback) => {
    listeners.splice(listeners.indexOf(callback), 1);
};


const triggerChange = () => {
    listeners.forEach(listener => listener(app));
};

const setServicePosition = (projectId, serviceIndex, position) => {
    let project = getProjectById(projectId);
    let service = project.services[serviceIndex];
    console.log(position, serviceIndex, projectId, project, service)
    service.meta.position = position;

    triggerChange();
};

const getProjects = () => app.projects;
const getProjectById = (_id) => _.find(app.projects, {_id});
const getPalette = () => app.palette;

export default {
    getProjects,
    getProjectById,
    getPalette,

    addListener,
    removeListener,

    setServicePosition
};