var screen1 = {

    mainView: 'design',
    palette: [
        {type: 'requester', icon: 'foo.png'},
        {type: 'responder', icon: 'foo.png'},
        {type: 'publisher', icon: 'foo.png'},
        {type: 'subscriber', icon: 'foo.png'},
        {type: 'sockend', icon: 'foo.png'}
    ],

    project: [
        {name: 'Catalog Service',
         meta: {
             position: {
                 x: 10,
                 y: 240
             }
         },

         code: `
module.exports = function (aReq, aRes) { return 3};
         `,
         children: [
             {name: 'A Requester',
             type: 'requester'},
             {name: 'A Responder',
             type: 'responder'}
         ]
        },

        {name: 'Gateway',
         meta: {
             position: {
                 x: 100,
                 y: 240
             }
         },
code: `
module.exports = function (aReq, aRes) { return 3};
         `,
         children: [
             {name: 'Sockend',
             type: 'sockend'}]
        },

        {name: 'Stock service',
code: `
module.exports = function (aReq, aRes) { return 3};
         `,
         meta: {
             position: {
                 x: 100,
                 y: 340
             }
         },
code: `
module.exports = function (aReq, aRes) { return 3};
         `,
         children: [
             {name: 'A Responder',
             type: 'responder'}
         ]
        }


    ]






};


var screen2 = {
    mainView: 'monitor',
    palette: [
        {type: 'requester', icon: 'foo.png'},
        {type: 'responder', icon: 'foo.png'},
        {type: 'publisher', icon: 'foo.png'},
        {type: 'subscriber', icon: 'foo.png'},
        {type: 'sockend', icon: 'foo.png'}
    ],

    project: [
        {name: 'Catalog Service',
         meta: {
             position: {
                 x: 10,
                 y: 240
             }
         },
         children: [
             {name: 'A Requester',
             type: 'requester'},
             {name: 'A Responder',
             type: 'responder'}
         ]
        },

        {name: 'Gateway',
         meta: {
             position: {
                 x: 100,
                 y: 240
             }
         },
         children: [
             {name: 'Sockend',
             type: 'sockend'}]
        },

        {name: 'Stock service',
         meta: {
             position: {
                 x: 100,
                 y: 340
             }
         },
         children: [
             {name: 'A Responder',
             type: 'responder'}
         ]
        }


    ]






};



export {screen1, screen2};
