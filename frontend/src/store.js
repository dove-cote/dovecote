import _ from 'lodash';
import Immutable from 'immutable';
const {fromJS, Map, List} = Immutable;
import $ from 'jquery';
import URLS from './urls';

var services = [
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
    ];

var project = {
    _id: 234,
    name: "e-store",
    multicastIP_: '239.1.0.17',
    services: services
};


var initialProjectSummaries = Immutable.fromJS({
    initialized: false,
    data: [],
    inProgress: false,
    latestFetch: null,
    error: false,
    errorMessage: null
});

var initialUserData = fromJS({initialized: false, inProgress: false, data: {}, error: false});
var app = {

    palette: [
        {type: 'req', icon: 'foo.png', name: 'Requester'},
        {type: 'res', icon: 'foo.png', name: 'Responder'},
        {type: 'pub', icon: 'foo.png', name: 'Publisher'},
        {type: 'sub', icon: 'foo.png', name: 'Subscriber'},
        {type: 'sockend', icon: 'foo.png', name: 'Sockend'}
    ],

    projects: [project],

    user: initialUserData,

    projectSummaries: initialProjectSummaries,

    projectCreation: Map({inProgress: false, error: false, errorText: null})

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
    service.meta.position = position;

    triggerChange();
};

const addService = (projectId, name, position = {x: 100, y: 100}) => {
    let project = getProjectById(projectId);

    project.services.push({
        name,
        instance: 1,
        code: "",
        meta: { position },
        components: []
    });

    triggerChange();
};

const addComponent = (projectId, serviceIndex, component) => {
    let project = getProjectById(projectId);
    let service = project.services[serviceIndex];
    service.components.push(component);
    triggerChange();
};

const getProjects = () => app.projects;
const getProjectSummaries = () => app.projectSummaries;
const getProjectCreation = () => app.projectCreation;

const getProjectById = (_id) => _.find(app.projects, {_id});

const updateProject = function (newProject) {

    return app.projects.map(function (project) {
        if (project._id === newProject._id) {
            return newProject;
        } else {
            return project;
        }
    });

};

const createProject = function (newProject) {
    app.projects.push(newProject);
};


const createOrUpdateProject = function (newProject) {

    if (_.find(app.projects, {_id: newProject._id}).length === 0) {
        createProject(newProject);
    } else {
        updateProject(newProject);
    }


    triggerChange();
};



const getPalette = () => app.palette;
const getUser = () => app.user;

const setProjectSummaries = function (data) {
    app.projectSummaries = data;
    triggerChange();
};

const fetchProjectSummaries = function () {

    if (app.projectSummaries.inProgress) {
        return;
    }

    app.projectSummaries = app.projectSummaries.set('inProgress', true);

    triggerChange();

    const successFn = function (data) {
        const newData = Map({inProgress: false,
                             error: false,
                             errorText: null,
                             data: data});

        setProjectSummaries(app.projectSummaries.merge(newData));

    }.bind(this);

    const errorFn = function () {
        app.projectSummaries = app.projectSummaries.merge(Map({error: true, errorText: 'an error occurred'}));

        console.error('an error occurred');

    }.bind(this);

    var mock = true;

    if (mock) {
        setTimeout(function () {
            var mockData = [{id: 234, name: 'my first microservice example', lastUpdated: new Date()}];
            successFn(mockData)
        }, 2000);
    } else {
        $.ajax({
            url: URLS.projectSummaries,
            success: successFn,
            error: errorFn
        });
    }
};

const generateMockProjectData = function (id) {

    return {
        _id: id,
        services: services,
        name: 'my random project name',
        multicast: '1.1.1.1'
    };

};
const fetchProjectById = function (id) {

    console.log('fetching project by id', id);

    const successFn = function () {

    }.bind(this);


    const errorFn = function () {

    }.bind(this);

    var isMock = true;

    if (isMock) {
        var mockData = generateMockProjectData(id);

        successFn(mockData);

    } else {
        $.ajax({
            url: URLS.project,
            success: successFn,
            error: errorFn
        });
    }
}


const setUser = function (userDetails) {
    app.user = Map({initialized: true, inProgress: false}).merge(fromJS(userDetails));
    triggerChange();
};

const fetchUser = function () {

    $.ajax({
        url: URLS.me,
        success: function (data) {
            setUser(data);
        },
        error: function () {
            setUser({});
        }
    });

};


const createNewProject = function (cb) {

    var isMock = true;

    var successFn = function (data) {

        cb(data.id);
    };

   if (isMock) {
        var MOCK_DATA = {id: Math.floor(1000*Math.random())};

        window.setTimeout(function () {
            successFn(MOCK_DATA)
        }, 1000);
    } else {

    $.ajax({
        url: URLS.createNewProject,
        data: {}, // TODO: chosen project template?,
        success: successFn
    });
    }

};


export default {
    getProjectSummaries,
    getProjects,
    getProjectById,
    getPalette,
    getUser,

    addService,
    addComponent,

    getProjectCreation,

    addListener,
    removeListener,

    setServicePosition,

    fetchProjectSummaries,
    fetchUser,
    fetchProjectById,

    createNewProject
};
