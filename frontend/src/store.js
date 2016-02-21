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

var _app = Map({

    palette: fromJS([
        {type: 'req', icon: 'foo.png', name: 'Requester'},
        {type: 'res', icon: 'foo.png', name: 'Responder'},
        {type: 'pub', icon: 'foo.png', name: 'Publisher'},
        {type: 'sub', icon: 'foo.png', name: 'Subscriber'},
        {type: 'sockend', icon: 'foo.png', name: 'Sockend'}
    ]),

    projects: Immutable.fromJS([project]),

    user: initialUserData,

    projectSummaries: initialProjectSummaries,

    projectCreation: Map({inProgress: false, error: false, errorText: null})

});

var _history = List();

var _historyPointer = 0;

var diff = require('immutablediff');

var atom = {

    getApp: function () {
        return _app;
    },

    swap: function (newApp, pushToHistory=true, resetHistory=false) {
        if (pushToHistory) {
            if (Immutable.is(_history.last(), newApp)) {
                console.log('prevent history')
            } else {
                window.MODIFICATIONS = window.MODIFICATIONS || [];
                var modifications = diff(_history.last(), newApp).toJS();
                console.log(JSON.stringify(modifications, null, 4));

                window.MODIFICATIONS.push(diff(_history.last(), newApp).toJS());
                _history = _history.push(newApp);
                _historyPointer = _history.count() - 1;
            }
        } else {

        }

        if (resetHistory) {
            _history = List();
            _historyPointer = 0;
        }
        _app = newApp;
        triggerChange();
    },

    getHistory: function () {
        return _history;
    },

    undo: function (cb) {
        if (!this.canUndo()) {
            return;
        }
        _historyPointer = Math.max(0, _historyPointer - 1);

        console.log("history at", _historyPointer);

        this.swap(_history.get(_historyPointer), false);

        cb && cb();

    },

    redo: function (cb) {
        if (!this.canRedo()) {
            return;
        }

        _historyPointer = Math.min(_historyPointer + 1, _history.count());
        this.swap(_history.get(_historyPointer), false);

        cb && cb();
    },

    canUndo() {
        return _historyPointer > 0;
    },

    canRedo() {
        return _historyPointer < _history.count() - 1;
    }

};

let listeners = [];

const addListener = (callback) => {
    listeners.push(callback);
};

const removeListener = (callback) => {
    listeners.splice(listeners.indexOf(callback), 1);
};


const triggerChange = () => {
    listeners.forEach(listener => listener(atom.getApp()));
};

const setServicePosition = (projectId, serviceIndex, position) => {
    let project = getProjectById(projectId);
    project = project.setIn(['services', serviceIndex, 'meta', 'position'], position);

    updateProject(project, false);

    // triggerChange();
};

const snapshotState = function () {

    console.log("snapshotting");

    atom.swap(atom.getApp());
};

const addCode = function (projectId, serviceId, code, pushToHistory=true) {
    var project = getProjectById(projectId);


    updateProject(project.setIn(['services', serviceId, 'code'], code), pushToHistory);

};

const addService = (projectId, name, position = {x: 100, y: 100}) => {
    let project = getProjectById(projectId);
    var services = project.get('services');

// debugger
    project = project.set('services',
                services.push(fromJS({
                    name,
                    instance: 1,
                    code: '',
                    meta: { position },
                    components: []})));

    updateProject(project);

    // triggerChange();
};

const addComponent = (projectId, serviceIndex, component) => {
    let project = getProjectById(projectId).updateIn(['services', serviceIndex, 'components'], function (oldComponents) {
        return oldComponents.push(fromJS(component));
    });

    updateProject(project);
    triggerChange();
};


var getApp = function () {
    return atom.getApp();
};

const getProjects = () => getApp().get('projects');
const getProjectSummaries = () => getApp().get('projectSummaries');
const getProjectCreation = () => getApp().get('projectCreation');

const getProjectById = function (_id) {
    return atom.getApp().get('projects').find(function (project) {
        return project.get('_id') === _id;
    });
};

const updateProject = function (newProject, pushToHistory=true) {

    atom.swap(
        atom.getApp().update('projects', function (projects) {
            return projects.map(function (project) {
                if (project.get('_id') === newProject.get('_id')) {
                    return newProject;
                } else {
                    return project;
                }
            })
        }),
        pushToHistory
    );


};

const createProject = function (newProject) {
    var app = atom.getApp();
    atom.swap(app.update('projects',
                         function (x) {
                             return x.push(newProject);
                         }));
};


const containsProject = function (aProject) {
    return atom.getApp().get('projects').find(function (project) {
        return project.get('_id') == aProject.get('_id')
    });
}

const createOrUpdateProject = function (newProject) {

    if (containsProject(newProject)) {
        createProject(newProject);
    } else {
        updateProject(newProject);
    }

    triggerChange();
};



const getPalette = () => atom.getApp().get('palette');
const getUser = () => atom.getApp().get('user');

const setProjectSummaries = function (data) {
    var newApp = atom.getApp().set('projectSummaries', data);
    atom.swap(newApp);
};

const fetchProjectSummaries = function () {
    var app = atom.getApp();
    if (app.getIn(['projectSummaries', 'inProgress'])) {
        return;
    }

    atom.swap(app.setIn(['projectSummaries', 'inProgress'], true));

    const successFn = function (data) {
        const newData = Map({inProgress: false,
                             error: false,
                             errorText: null,
                             data: fromJS(data)});
        var app = atom.getApp();
        setProjectSummaries(app.get('projectSummaries').merge(newData));

    }.bind(this);

    const errorFn = function () {
        var app = atom.getApp();

        app.projectSummaries = app.projectSummaries.merge(Map({error: true, errorText: 'an error occurred'}));

        console.error('an error occurred');

    }.bind(this);

    var mock = false;

    if (mock) {
        setTimeout(function () {
            var mockData = [{id: 234, name: 'my first microservice example', lastUpdated: new Date()}];
            successFn(mockData)
        }, 2000);
    } else {
        $.ajax({
            url: URLS.projects,
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

    const successFn = function (response) {

        var app = atom.getApp();
        var projects = app.get('projects');

        if (getProjectById(id)) {
            // remove if it's already loaded
            projects = projects.filter(function (project) {
                return project.get('id') !== id;
            });
        }

        projects = projects.push(fromJS(response));

        var newApp = app.set('projects', projects);

        atom.swap(newApp, false, true);

    }.bind(this);


    const errorFn = function () {

    }.bind(this);

    var isMock = false;

    if (isMock) {
        var mockData = generateMockProjectData(id);

        successFn(mockData);

    } else {
        $.ajax({
            url: URLS.projects + id,
            success: successFn,
            error: errorFn
        });
    }
}


const setUser = function (userDetails) {
    var app = atom.getApp();
    app = app.set('user', Map({initialized: true, inProgress: false}).merge(fromJS(userDetails)));
    atom.swap(app);

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


const createNewProject = function (name, callback) {
    $.ajax({
        method: 'POST',
        url: URLS.projects,
        contentType: "application/json",
        dataType: 'json',
        data: JSON.stringify({
            project: {
                name
            }
        }),
        success: ({_id}) => callback(_id)
    });
};

const saveProject = function (project, callback) {
    $.ajax({
        method: 'PUT',
        url: URLS.projects + project.get('_id'),
        contentType: "application/json",
        dataType: 'json',
        data: JSON.stringify({
            project: project.delete('_id').toJS()
        }),
        success: callback
    });
};


var store = {
    getProjectSummaries,
    getProjects,
    getProjectById,
    getPalette,
    getUser,

    addCode,
    addService,
    addComponent,

    getProjectCreation,

    addListener,
    removeListener,

    setServicePosition,
    updateProject,

    fetchProjectSummaries,
    fetchUser,
    fetchProjectById,

    createNewProject,
    saveProject,

    // undo-redo stuff TODO clean up
    undo: atom.undo.bind(atom),
    redo: atom.redo.bind(atom),
    canUndo: atom.canUndo.bind(atom),
    canRedo: atom.canRedo.bind(atom),
    snapshotState,
    // atom

    atom
};


export default store;
