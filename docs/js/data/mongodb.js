module.exports = {
    desc: "Common MongoDb operation for CRUD",
    initialCode: `
var HelperMongo = require('express-toppigs').HelperMongo;
var helperMongo = new HelperMongo(connStr);
                `,
    methods: [{
        id: 'validateExistence',
        name: 'validateExistence(collName: string, validate: any, cb: Function)',
        nav: 'validateExistence',
        desc: 'Validates if there is any document matching the given query',
        params: [{
            name: 'collName',
            type: 'string',
            desc: 'Collection Name',
        }, {
            name: 'validate',
            type: 'object',
            desc: 'Mongo find() query object',
        }, {
            name: 'cb',
            type: '(err, result) => void',
            desc: 'Callback',
        }],
        example: [`
var data = {
    name: "test"
}
db.collection("validateExistenceColl").insert(data, (err, result) => {
    if (result) {
        helperMongo.validateExistence("validateExistenceColli { name: "test" }, (err, result) => {
            console.log(result)
        })
    } else {
        console.warn("Unable to insert data to test validateExistence")
    }
})
                   `]
    }, {
        id: 'validateNonExistence',
        name: 'validateNonExistence(collName: string, validations: object | object[], cb: ICallback)',
        nav: 'validateNonExistence',
        desc: 'Validate no document matches for all the given validations(queries)',
        params: [{
            name: 'collName',
            type: 'string',
            desc: 'Collection Name',
        }, {
            name: 'validations',
            type: 'object | object[]',
            desc: 'Validations for document',
        }, {
            name: '-> validation.query',
            type: 'object',
            desc: 'Mongo find() query object',
        }, {
            name: '-> validation.errMsg',
            type: 'object | object[]',
            desc: 'Validations for document',
        }],
        example: [`
var data1 = {
    name: 'test1',
    checking: 'validations',
    type: "multi"
}
var data2 = {
    name: 'test2',
    checking: 'validations',
    type: "multi"
}

db.collection('validateNonExistence').insert([data1, data2], (err, result) => {
    if (!err) {
        let validations = [
            {
                query: {
                    name: 'test3'
                },
                errMsg: "Duplicate Name"
            }, {
                query: {
                    checking: 'validations',
                    type: 'multi'
                },
                errMsg: 'Duplicate Methods'
            }
        ]
        helperMongo.validateNonExistence('validateNonExistence', validatins, (err, result) => {
            should.exist(err);
            should.not.exist(result);
            err.should.be.eql("Duplicate Methods")

            done()
        })
    }
})
                   `]
    }, {
        id: 'validateNonExistenceOnUpdate',
        name: 'validateNonExistenceOnUpdate(collName: string, obj: IMongoDoc, validations: object | object[], cb: Function)',
        nav: 'validateNonExistenceOnUpdate',
        desc: 'Validates that the updated document does not collide with unique fields in the collection',
        params: [{
            name: 'collName',
            type: 'string',
            desc: 'Collection Name',
        }, {
            name: 'obj',
            type: 'object',
            desc: 'Updated object that has to updated in mongoDB',
        }, {
            name: 'validations',
            type: 'object',
            desc: 'Set of validations to avoid collision of unique field on update'
        }, {
            name: '-> validation.name',
            type: 'string',
            desc: 'Document field name'
        }, {
            name: '-> validation.query',
            type: 'object',
            desc: 'Mongo find() query object'
        }, {
            name: '-> validation.errMsg',
            type: 'string',
            desc: 'Error message to return on validation failure'
        }, {
            name: 'cb',
            type: '(err, result) => void',
            desc: 'Callback`'
        }],
        example: [`
var data1 = {
    name: "test1",
    checking: 'validateNonExistenceOnUpdate'
}
var data2 = {
    name: "test2",
    checking: 'validateNonExistenceOnUpdate'
}
db.collection("validateNonExistenceOnUpdate2").insert([data1, data2], (err, result) => {
    if (!err) {
        var validations = [
            {
                name: "name"
            }
        ]
        result[0].name = 'test2'
        helperMongo.validateNonExistenceOnUpdate('validateNonExistenceOnUpdate2', reilt[0], validations, (err, result) => {
            should.exist(err);
            err.should.be.eql("Duplicate name");
            result.should.be.eql(1)

            done()
        })

    }
})
                   `]
    }, {
        id: 'getById',
        name: 'getById(collName: string, id: string, options: IGetByIdOptions, cb: ICallback)',
        nav: 'getById',
        desc: 'Get a document that matches the given id',
        params: [{
            name: 'collName',
            type: 'string',
            desc: 'Collection Name',
        }, {
            name: 'id',
            type: 'string',
            desc: 'Mongo Document id',
        }, {
            name: 'options (optional)',
            type: 'IGetByIdOptions',
            desc: "MongoDB Query n Project filters to be applied"
        }, {
            name: "-> options.query",
            type: "object",
            desc: "Mongodb Query filter"
        }, {
            name: '-> options.project',
            type: "object",
            desc: "Mongodb Project Filter"
        }, {
            name: 'cb',
            type: "(err, document) => void",
            desc: 'Callback'
        }],
        example: [`
 var data = {
    name: 'test'
}
db.collection("getById2").insert(data, (err, result) => {
    if (!err) {
        helperMongo.getById("getById2", reilt._id, (err, result1) => {
            should.not.exist(err);
            result1._id.should.be.eql(result._id);
            result1.name.should.be.eql(result.name);

            done();
        })
    }
})
                   `, `
var data = {
    name: 'test',
    get: true
}
db.collection("getById2").insert(data, (err, result) => {
    if (!err) {
        var options = {
            query: { get: true },
            project: { name: 1 }
        }
        helperMongo.getById("getById2", result._id, options, (err, result1) => {
            should.not.exist(err);
            result1._id.should.be.eql(result._id);
            result1.name.should.be.eql(result.name);
            should.not.exist(result1.get)

            done();
        })
    } else {
        console.error('Failed to insert into getById2');
        done(err);
    }
})
                   `]
    }, {
        id: 'getNextSeqNo',
        name: 'getNextSeqNo(collName: string, obj: IMaxValue, cb: Function)',
        nav: 'getNextSeqNo',
        desc: 'Get the next sequence number of a numerical field in a collection',
        params: [{
            name: 'collName',
            type: 'string',
            desc: 'Collection Name',
        }, {
            name: 'obj',
            type: 'object',
            desc: 'Options',
        }, {
            name: '-> obj.key',
            type: 'string',
            desc: 'Key for which max value has to be found. Make sure that this field is of type number else erroneous output would be expected'
        }, {
            name: "-> obj.query",
            type: 'object',
            desc: 'MongoDB $match query object'
        }, {
            name: '-> obj.unwind',
            type: 'object',
            desc: 'if the max value has to be found within an array in a document, then specify the key',
            default: 'null'
        }, {
            name: '-> obj.maxValue (optional)',
            default: 'infinite',
            type: 'number',
            desc: 'Maximum allowed sequence number'
        }, {
            name: '-> obj.minValue (optional)',
            default: '0',
            type: 'number',
            desc: 'Minimum allowed sequence number'
        }, {
            name: '-> obj.errMsg (optional)',
            default: 'Could not Get Next Sequence Number',
            type: 'string',
            desc: "Error Message to return when a sequence number could not be found"
        }],
        example: [`
var data = [
    {
        num: 1
    }, {
        num: 2
    }, {
        num: 10
    },
]
db.collection("getNextSeqNo1").insert(data, (err) => {
    if (!err) {
        var nextSeqQuery = {
            // query: {},
            key: 'num'
        }
        helperMongo.getNextSeqNo('getNextSeqNo1', nextSeqQiry, (err, result) => {
            should.not.exist(err);
            result.should.be.eql(11);

            done()
        })
    }
})
                   `]
    }, {
        id: 'update',
        name: 'update(collName: string, obj: object, exclude?: string[], cb?: Function)',
        nav: 'update',
        desc: 'Updates the document excluding the specified fields from the object ',
        params: [{
            name: 'collName',
            type: 'string',
            desc: 'Collection Name',
        }, {
            name: 'obj',
            type: 'object',
            desc: 'Mongo document',
        }, {
            name: 'exclude (optional)',
            default: '[]',
            type: 'string[]',
            desc: 'fields to excluded while updating the document'
        }, {
            name: 'cb',
            type: '(err, result) => void',
            desc: "Callback"
        }],
        example: [`
var data = {
    name: 'test',
    field2: 'should Not Be Updated'
}
db.collection('update4').insert(data, (err, result) => {
    if (!err) {
        result.field2 = "updated data";
        result.name = "updated name";

        helperMongo.update('update4', reilt, ["field2"], (err, result1) => {
            should.not.exist(err);
            result1.should.be.an("object");
            result1.n.should.be.eql(1);

            db.collection("update4").findOne({ _id: result._id }, (err, result2) => {
                should.not.exist(err);
                result2.should.be.an("object");
                result2.field2.should.be.eql("should Not Be Updated")
                result2.name.should.be.eql("updated name")

                done()
            })
        })
    }
})
                   `]
    }, {
        id: 'getList',
        name: 'getList(collName: string, obj: object, options: IGetByIdOptions, cb: Function)',
        nav: 'getList',
        desc: 'Get a list of documents in a collection - can be used for CRUD - list apis',
        params: [{
            name: 'collName',
            type: 'string',
            desc: 'Collection Name',
        }, {
            name: 'obj',
            type: 'object',
            desc: 'options',
        }, {
            name: '-> obj.pageNo (optional)',
            default: '1',
            type: 'number',
            desc: 'Page number for pagination'
        }, {
            name: '-> obj.recordsPerPage (optional)',
            default: 'all',
            type: 'number',
            desc: 'Number of records per page'
        }, {
            name: '-> obj.query (optional)',
            default: '{}',
            type: 'object',
            desc: 'Mongo query filter for the list'
        }, {
            name: '-> obj.project (optional)',
            default: '{}',
            type: 'object',
            desc: 'Mongo find() project object'
        }, {
            name: '-> obj.search (optional)',
            type: 'string',
            desc: 'Search Text'
        }, {
            name: "-> obj.searchField (optional)",
            sdefault: 'name',
            type: 'string',
            desc: 'Field on which search text must be filtered'
        }, {
            name: '-> obj.sort (optional)',
            default: '{}',
            type: 'object',
            desc: 'Order in which the documents must be sorted ex: -name| name'
        }, {
            name: 'options (optional)',
            type: 'IGetByIdOptions',
            desc: "MongoDB Query n Project filters to be applied"
        }, {
            name: "-> options.query",
            type: "object",
            desc: "Mongodb Query filter"
        }, {
            name: '-> options.project',
            type: "object",
            desc: "Mongodb Project Filter"
        }, {
            name: 'cb',
            type: 'function',
            desc: "Callback function of type (err, result)"
        }],
        example: [`
 var data = [
    {
        name: 'test1'
    }, {
        name: 'test2'
    }, {
        name: 'test3'
    }
]
db.collection('getList8').insert(data, (err, result) => {
    if (!err) {
        helperMongo.getList("getList8i {
            project: { name: 1, _id: 0 },
            sort: '-name'
        }, (err, result1) => {
            should.not.exist(err);
            result1.should.be.an("object");
            result1.count.should.be.eql(3);
            result1.list.length.should.be.eql(3);
            result1.list[0].name.should.be.eql("test3")
            result1.list[1].name.should.be.eql("test2")
            result1.list[2].name.should.be.eql("test1")

            done();
        })
    }
})
                   `, `
var data = [
    {
        name: 'test1',
        age: 23
    }, {
        name: 'test2',
        age: 25
    }, {
        name: 'test3',
        age: 24
    }
]
db.collection('getList8').insert(data, (err, result) => {
    if (!err) {
        helperMongo.getList("getList8", {
            query: { name: "test2" },
        }, {
                query: { name: 'test1' },
            }, (err, res1) => {
                should.not.exist(err);
                res1.should.be.an("object");
                res1.count.should.be.eql(1)
                res1.list.length.should.be.eql(1)
                res1.list[0].age.should.be.eql(23)

                done();
            })
    } else {
        console.error('Failed to insert into getList8');
        done(err);
    }
})
                   `]
    }, {
        id: 'remove',
        name: 'remove(collName: string, id: string, removeDoc?: boolean, cb: Function)',
        nav: 'remove',
        desc: 'Remove a document',
        params: [{
            name: 'collName',
            type: 'string',
            desc: 'Collection Name',
        }, {
            name: 'id',
            type: 'string',
            desc: 'Mongo Document Id',
        }, {
            name: 'removeDoc (optional)',
            default: 'true',
            type: 'boolean',
            desc: 'if true would remove the document else would set isDeleted flag and delTime(Deleted time) on the document. Please note that if isDeleted flag is set, then the corresponding query should be maintained while fetching the documents that are not deleted. This can be used only when a history is crucial'
        }, {
            name: 'cb',
            type: 'function',
            desc: "Callback Function of type (err, result)"
        }],
        example: [`
var data = {
    name: 'test'
}
db.collection('remove3').insert(data, (err, result) => {
    if (!err) {
        helperMongo.remove("remove3", reilt._id, false, (err, result1) => {
            should.not.exist(err);

            db.collection('remove3').findOne({ _id: result._id }, (err, result2) => {
                should.not.exist(err);
                result2.should.be.an("object");
                result2.isDeleted.should.be.ok;
                should.exist(result2.deltime)

                done();
            })
        })
    }
})
                   `]
    }, {
        id: "removeMulti",
        name: "removeMulti(collName: string, ids: string[], removeDoc?: boolean, verbose?: boolean, cb: Function)",
        nav: "removeMulti",
        desc: "Removes Multiple documents",
        params: [{
            name: 'collName',
            type: 'string',
            desc: 'Collection Name',
        }, {
            name: 'id',
            type: 'string',
            desc: 'Mongo Document Id',
        }, {
            name: 'removeDoc (optional)',
            default: 'true',
            type: 'boolean',
            desc: 'if true would remove the document else would set isDeleted flag and delTime(Deleted time) on the document. Please note that if isDeleted flag is set, then the corresponding query should be maintained while fetching the documents that are not deleted. This can be used only when a history is crucial'
        }, {
            name: 'verbose (optional)',
            default: "false",
            type: 'boolean',
            desc: "if true, then each 'id' would be used to remove individual documents (Takes more time), but if any operation fails, then the corresponding error message would be accompanied with the 'id'. if false then all the valid ids would be removed in just one Mongo Operation"
        }, {
            name: 'cb',
            type: 'function',
            desc: 'Callback function of type (err, results)'
        }],
        example: [`
var docs = [{
    name: 'doc1'
}, {
    name: 'doc2'
}, {
    name: 'doc3'
}, {
    name: 'doc4'
}]

var ids = []
db.collection("removeMulti").insert(docs, (err, results) => {
    if (!err) {
        ids = results.map(res => res._id)
    }
    
    helperMongo.removeMulti("removeMulti", ids, true, (err, results) => {
        should.not.exist(err)
        results.should.be.an("object")
        results.n.should.be.eql(4)

        done();
    })
})
                    `]
    }, {
        id: 'splitTimeThenGrp',
        name: 'splitTimeThenGrp(collName: string, obj: object, cb: Function)',
        nav: 'splitTimeThenGrp',
        desc: 'Splits the selected range of documents by time and then groups them based on grouping logic',
        params: [{
            name: 'collName',
            type: 'string',
            desc: 'Collection Name',
        }, {
            name: 'obj',
            type: 'object',
            desc: 'options',
        }, {
            name: '-> obj.key',
            type: 'object',
            desc: 'Timestamp key Options'
        }, {
            name: '---> obj.key.name',
            type: 'string',
            desc: 'Timestamp field name in the document'
        }, {
            name: '---> obj.key.min',
            type: 'Date',
            desc: 'Lower limit of query selection for timestamp field'
        }, {
            name: '---> obj.key.max',
            type: 'Date',
            desc: 'Upper limit of query selection for timestamp field'
        }, {
            name: '-> obj.project',
            type: 'string[]',
            desc: 'Fields to included in the final result'
        }, {
            name: '-> obj.groupBy',
            type: 'string',
            desc: 'Grouping interval. Possible values are : year, month, day, hour, minute, second, millisecond'
        }, {
            name: '-> obj.groupLogic',
            type: 'string',
            desc: 'Mongo Aggregation Group logic ex: $first, $last, $avg, $sum etc'
        }],
        example: [`
var data = []
var currTs = moment()
var count = 1000;
var interval = 10;
for (var i = 0; i < count; i++) {
    data.push({
        ts: moment().add(i * interval, "seconds")._d,
        // ts: currTs + i * 10,
        x: i
    })
}
var totalSeconds = count * interval
db.collection("splitTimeThenGroup1").insert(data, (err, result) => {
    if (!err) {
        var option = {
            key: {
                name: "ts",
                min: moment()._d,
                max: moment().add(totalSeconds, "seconds")._d,
            },
            project: ['x'],
            groupBy: 'hour',
            groupLogic: '$first'
        }
        var expectedCount = Math.ceil(totalSeconds / 60 / 60);

        helperMongo.splitTimeThenGrp("splitTimeThenGroup1", opion, (err, result1) => {
            result1.should.be.an("array");
            console.log("Result:", result)

            done();
        })
    } else {
        console.error("Failed to insert into splitTimeThenGroup1", err)
    }
})
                   `]
    }, {
        id: 'selectNinM',
        name: 'selectNinM(collName: string, obj: object, cb: Function)',
        nav: 'selectNinM',
        desc: 'Selects n number of documents from m range of selected documents based on grouping logic',
        params: [{
            name: 'collName',
            type: 'string',
            desc: 'Collection Name',
        }, {
            name: 'obj',
            type: 'object',
            desc: 'Options',
        }, {
            name: '-> obj.numOfPoints',
            type: 'number',
            desc: 'Number of points expected in result (M)'
        }, {
            name: '-> obj.query',
            type: 'object',
            desc: 'Mongo find() query object'
        }, {
            name: '-> obj.project',
            type: 'object',
            desc: 'Fields to be projected in final result'
        }, {
            name: '-> obj.groupLogic',
            type: 'string',
            desc: 'Mongo Aggregation Group logic ex: $first, $last, $avg, $sum etc'
        }],
        example: [`
var data = [];
for (var i = 0; i < 100; i++) {
    data.push({
        name: 'test' + i,
        num: i
    })
}

db.collection("selectNinM1").insert(data, (err, result) => {
    if (!err) {
        var obj = {
            numOfPoints: 10,
            groupLogic: '$first',
            project: ['name', 'num'],
            query: {}
        }
        helperMongo.selectNinM('selectNinM1',ibj, (err, result1) => {
            should.not.exist(err);
            result1.should.be.an('array');
            result1.length.should.be.eql(10);

            done()
        })
    }
})
                   `]
    }]
}