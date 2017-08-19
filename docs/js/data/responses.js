module.exports = {
    desc: 'HTTP Response helper implementation',
    initialCode: `
var HelperResp = require("express-toppings").HelperResp;
var helperResp = new HelperResp();

// Please note the response format followed in this library is in the form
{
    error: true|false,
    data: {}
}
                `,
    methods: [{
        id: 'success',
        name: 'success(res: express.Response, data?: any)',
        nav: 'success',
        desc: 'HTTP 200 Success handler',
        params: [{
            name: 'res',
            desc: 'Express Response object'
        }, {
            name: 'data',
            desc: '[any] Response data'
        }],
        example: [
            `
// if the request was a success then
helperResp.success(res);
                        `
        ]
    }, {
        id: 'failed',
        name: 'failed(res: express.Response, msg?: string)',
        nav: 'failed',
        desc: 'HTTP 400 Success handler',
        params: [{
            name: 'res',
            desc: 'Express Response object'
        }, {
            name: 'msg',
            default: 'Failed',
            desc: '[string] Error Message'
        }],
        example: [
            `
// if the request was a failure
helperResp.failed(res, 'Name missing')
                        `
        ]
    }, {
        id: 'post',
        name: 'post(res: express.Response, data?: any)',
        nav: 'post',
        desc: 'CRUD - Create handler',
        params: [{
            name: 'res',
            desc: 'Express Response object'
        }, {
            name: 'data',
            desc: '[any] Response data',
            default: "CREATED"
        }],
        example: [`
// If the data was successfully inserted into DB then
db.collection('test').insert(data, (err, result) => {
    if(result) {
        helperResp.post(res, result)
    } else {
        if(err) {
            helperResp.serverError(res, err)
        } else {
            helperResp.failed(res, "Creation Failed")
        }
    }
})
                    `]
    }, {
        id: 'put',
        name: 'put(res: express.Response, data?: any)',
        nav: 'put',
        desc: 'CRUD - Update handler',
        params: [{
            name: 'res',
            desc: 'Express Response object'
        }, {
            name: 'data',
            desc: '[any] Response data',
            default: "UPDATED"
        }],
        example: [`
// If the data was successfully updated in DB then
db.collection('test').update({}, {$set: data}, (err, result) => {
    if(result && result.nModified) {
        helperResp.put(res, result)
    } else {
        if(err) {
            helperResp.serverError(res, err)
        } else {
            helperResp.failed(res, "Update Failed")
        }
    }
})
                    `]
    }, {
        id: 'delete',
        name: 'delete(res: express.Response, data?: any)',
        nav: 'delete',
        desc: 'CRUD - Delete Handler',
        params: [{
            name: 'res',
            desc: 'Express Response object'
        }, {
            name: 'data',
            desc: '[any] Response data',
            default: "DELETED"
        }],
        example: [`
// If the data was successfully removed from DB then
db.collection('test').remove(data, (err, result) => {
    if(result) {
        helperResp.delete(res, result)
    } else {
        if(err) {
            helperResp.serverError(res, err)
        } else {
            helperResp.failed(res, "Delete Failed")
        }
    }
})
                    `]
    }, {
        id: 'get',
        name: 'get(res: express.Response, data?: any, list?: boolean)',
        nav: 'get',
        desc: 'CRUD - get n list Handler',
        params: [{
            name: 'res',
            desc: 'Express Response object'
        }, {
            name: 'data',
            desc: '[any] Response data',
            default: "[] | {} depending on .list"
        }, {
            name: 'list',
            type: 'boolean',
            default: 'true',
            desc: '[boolean] if true then data defaults to [] else {}'
        }],
        example: [`
// If the data was successfully obtained from DB then
db.collection('test').find({}, (err, result) => {
    if(result) {
        helperResp.get(res, result, true);
    } else {
        if(err) {
            helperResp.serverError(res, err)
        } else {
            helperResp.failed(res, "Failed to get data from DB")
        }
    }
})
                    `]
    }, {
        id: 'unauth',
        name: 'unauth(res: express.Response, msg?: string)',
        nav: 'unatuh',
        desc: 'HTTP 401 handler',
        params: [{
            name: 'res',
            desc: 'Express Response object'
        }, {
            name: 'msg',
            desc: '[string] Response data',
            default: "UNAUTHORIZED ACCESS"
        }],
        example: [`
// If the user is unauthorized
helperResp.unauth(res);
                    `]
    }, {
        id: 'serverError',
        name: 'serverError(res: express.Response, msg?: string)',
        nav: 'serverError',
        desc: 'HTTP 500 Handler',
        params: [{
            name: 'res',
            desc: 'Express Response object'
        }, {
            name: 'msg',
            desc: '[string] Response data',
            default: "INTERNAL SERVER ERROR"
        }],
        example: [`
// On Internal Server Error                     
helperResp.serverError(res);
                    `]
    }, {
        id: 'handleResult',
        name: 'handleResult(res: express.Response) => (err: any, result: any, type: string)',
        nav: 'handleResult',
        desc: 'Generic Callback Result handler',
        params: [
            {
                name: 'res',
                desc: 'Express Response Object'
            }
        ]
    }],
    example: [`
// If data is obtained from a callback(err, result), then replace it with handleResult
db.collection('test').find({}, helperResp.handleResult(res));                
                `]
}