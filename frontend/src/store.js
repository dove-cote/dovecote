import _ from 'lodash';
import Immutable from 'Immutable';
const {fromJS, Map, List} = Immutable;
import $ from 'jquery';

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
    projects: [project],

    user: fromJS({initialized: false, inProgress: false, data: {}, error: false}),

    projectSummaries:  Immutable.fromJS({
        initialized: false,
        data: [],
        inProgress: false,
        latestFetch: null,
        error: false,
        errorMessage: null
    })


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

const getProjects = () => app.projects;
const getProjectSummaries = () => app.projectSummaries;
const getProjectById = (_id) => _.find(app.projects, {_id});
const getPalette = () => app.palette;
const getUser = () => app.user;

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

        app.projectSummaries = app.projectSummaries.merge(newData);;

        triggerChange();

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
            url: '/api/projects/',
            success: successFn,
            error: errorFn
        });
    }
};

const fetchProjectById = function (_id) {

    console.log('fetching project by id', id);

    const successFn = function () {

    }.bind(this);


    const errorFn = function () {

    }.bind(this);

    $.ajax({
        url: '/api/projects/',
        success: successFn,
        error: errorFn
    });
}


const setUser = function (userDetails) {
    app.user = Map({initialized: true, inProgress: false}).merge(fromJS(userDetails));
    triggerChange();
};

const fetchUser = function () {

    $.ajax({
        url: '/api/users/me',
        success: function (data) {
            setUser(data);
        },
        error: function () {
            setUser({});
        }
    });

};




export default {
    getProjectSummaries,
    getProjects,
    getProjectById,
    getPalette,
    getUser,

    addListener,
    removeListener,

    setServicePosition,

    fetchProjectSummaries,
    fetchUser,
};
