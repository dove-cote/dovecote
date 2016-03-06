import _ from 'lodash';


function convertComponentName(oldName) {
    return _.camelCase(oldName);
}

function exportsLine(service) {
// debugger
    var componentNames = service.get('components').map(function (component) {
        return component.get('name');
    });

    var convertedComponentNames = componentNames.map(convertComponentName);
    return 'module.exports = function(' + convertedComponentNames.join(', ') + ') {\n';

};


export {exportsLine};
