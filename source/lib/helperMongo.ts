import * as sh_mongo from "mongojs"
import * as sh_async from "async"
import * as sh_Logger from "logger-switch"

import { ICallback } from "../lib.com"

export interface IMongoDoc {
    _id: string;
    utime: Date;
}

export interface IValidationNonExistence {
    query: object;
    errMsg?: string
}

export interface IValidationNonExistenceUpdate {
    name: string;
    query?: object;
    errMsg?: string;
}

export interface IKey {
    name: string;
    type: string;
    min: Date | number;
    max: Date | number;
}

export interface IGetByIdOptions {
    query: object;
    project: object;
}

export interface ISplitTimeThenGrp {
    key: IKey;
    project: string[];
    groupBy?: string;
    groupLogic?: string;
    interval?: number;
    intervalUnits?: string;
}
export interface ISelectNinM {
    groupLogic?: string;
    project: string[];
    numOfPoints: number;
    query: object;
}

export interface IGetList {
    query?: object | string;
    project?: object | string;
    sort?: object | string;
    recordsPerPage?: number | string;
    pageNo?: number | string;
    search?: string;
    searchField?: string;
}
export interface IMaxValue {
    query?: object;
    unwind?: object;
    key: string;
    maxValue?: number;
    minValue?: number;
    errMsg?: string
}
export interface IHelperMongo {
    getDateFormat(groupBy: string): string;
    validateExistence(collName: string, validate: object, cb: Function): void;
    validateNonExistence(collName: string, validate: IValidationNonExistence | IValidationNonExistence[], cb: Function): void;
    validateNonExistenceOnUpdate(collName: string, obj: object | object[], validations: IValidationNonExistenceUpdate[] | IValidationNonExistenceUpdate, cb: Function): void;
    getById(collName: string, id: string, options: IGetByIdOptions, cb: Function): void;
    getNextSeqNo(collName: string, obj: object, cb: Function): void;
    update(collName: string, obj: object, exclude?: string[], cb?: Function): void;
    getList(collName: string, obj: object, options: IGetByIdOptions, cb: Function): void;
    remove(collName: string, id: string, removeDoc: boolean, cb: Function): void;
    removeMulti(collName: string, ids: string[], removeDocs: boolean, verbose: boolean, cb: Function): void;
    splitTimeThenGrp(collName: string, obj: ISplitTimeThenGrp, cb: Function): void;
    selectNinM(collName: string, obj: ISelectNinM, cb: Function): void;
}

export class HelperMongo implements IHelperMongo {
    private logger = new sh_Logger("sh-mongo")
    private db;
    constructor(connStr: string, debug: boolean) {

        this.db = sh_mongo(connStr);

        this.logger[debug ? "activate" : "deactivate"]();
        return this;
    }

    /**
     * @description Returns Groupby which can be used in Mongo functions
     * @param  {string} group_by
     * @returns string
     */
    public getDateFormat(groupBy: string): string {
        let format = "%Y-%m-%d";
        switch (groupBy || "") {
            case "year":
                format = "%Y"
                break;

            case "day":
                format = "%Y-%m-%d"
                break;

            case "month":
                format = "%Y-%m"
                break;

            case "day":
                format = "%Y-%m-%d"
                break;

            case "hour":
                format = "%Y-%m-%dT%H"
                break;

            case "minute":
            case "min":
                format = "%Y-%m-%dT%H:%M"
                break;

            case "second":
            case "sec":
                format = "%Y-%m-%dT%H:%M:%S"
                break;

            case "millisecond":
            case "milli":
                format = "%Y-%m-%dT%H:%M:%S.%L"
                break;

            default:
                format = "%Y-%m-%d"
        }
        return format;
    }

    /**
     * Validates if there is any document matching the given query
     * @param collName collection name
     * @param validate find() query
     * @param cb callback
     */
    public validateExistence(collName: string, validate: any, cb: Function): void {
        this.db.collection(collName).findOne(validate.query || validate, function (err, result) {
            if (!result) {
                cb(validate.errMsg || "Document Does not Exist")
            } else {
                cb(err, result);
            }
        });
    }

    /**
     * Validate non existence for all the given validations
     * @param collName collection name
     * @param validations 
     * @param cb 
     */
    public validateNonExistence(collName: string, validations: IValidationNonExistence | IValidationNonExistence[], cb: ICallback): void {

        if (!Array.isArray(validations)) {
            validations = [validations]
        }

        sh_async.everySeries(
            validations,
            (condition: IValidationNonExistence, cb1) => {
                this.db.collection(collName).findOne(condition.query || condition, (err, result) => {
                    if (result) {
                        cb1(condition.errMsg || "Duplicate Document")
                    } else {
                        cb1(err, !result);
                    }
                })
            },
            (err, done) => {
                cb(err, done);
            }
        )
    }

    /**
     * Validates that the updated document does not collide with unique fields in the collection
     * @param collName collection name
     * @param obj Updated document
     * @param validations 
     * @param cb Callback
     */
    public validateNonExistenceOnUpdate(collName: string, obj: IMongoDoc, validations: IValidationNonExistenceUpdate | IValidationNonExistenceUpdate[], cb: Function): void {
        let id;
        try {
            id = this.db.ObjectId(obj._id);
        } catch (err) {
            return cb("Invalid Id")
        }

        if (!Array.isArray(validations)) {
            validations = [validations];
        }

        let dbOperations = 0;

        sh_async.autoInject({
            getExistingObj: (cb1) => {
                this.db.collection(collName).findOne({
                    _id: id
                }, cb1);
            },
            compareWithNewObj: (getExistingObj, cb1) => {
                if (getExistingObj) {
                    sh_async.each(
                        validations,
                        (field: IValidationNonExistenceUpdate, cb2) => {
                            if (getExistingObj[field.name] != obj[field.name]) {
                                dbOperations += 1;

                                let mongoQuery = {};
                                mongoQuery[field.name] = obj[field.name]; // default mongoQuery
                                if (field.query) { // use the specified query if available
                                    mongoQuery = field.query;
                                }

                                this.db.collection(collName).findOne(mongoQuery, {
                                    _id: 1
                                }, function (err, result) {
                                    if (result) {
                                        cb2(field.errMsg ? field.errMsg : "Duplicate " + field.name)
                                    } else {
                                        cb2(err, !result);
                                    }
                                })
                            } else {
                                cb2(null, true);
                            }
                        }, cb1);
                } else {
                    cb1("Non Existing _id")
                }
            }
        }, function (err, results) {
            cb(err, dbOperations);
        })
    }

    /**
     * Get the document that matches the given id
     * @param collName collection name
     * @param id mongoDB document id
     * @param cb 
     */
    public getById(collName: string, id: string, options: IGetByIdOptions, cb: ICallback): void {
        if (!cb && typeof options === "function") {
            cb = options;
            options = null;
        }

        try {
            id = this.db.ObjectId(id);
        } catch (err) {
            return cb("Invalid Id")
        }

        const query = { _id: id }
        const project = {}

        if (options) {
            if (options.query) {
                Object.assign(query, options.query)
            }
            if (options.project) {
                Object.assign(project, options.project)
            }
        }

        this.db.collection(collName).findOne(query, project, cb)
    }

    /**
     * Get the next sequence number of a numerical field in a collection
     * @param collName collection name
     * @param obj options
     * @param cb Callback
     */
    public getNextSeqNo(collName: string, obj: IMaxValue, cb: Function): void {
        this.getMaxValue(collName, obj, (err, result) => {
            if (!err) {
                let sno = result + 1;
                if (obj.maxValue && sno > obj.maxValue) {
                    let i = (obj.hasOwnProperty("minValue") ? obj.minValue : 1);
                    let found = false;
                    const find = Object.assign({}, obj.query);
                    sh_async.whilst(
                        () => {
                            if (i > obj.maxValue) {
                                return false;
                            }
                            return !found;
                        },
                        (cb1) => {
                            find[obj.key] = i;
                            this.db.collection(collName).findOne(find, function (err1, result1) {
                                if (!result1) {
                                    found = true;
                                } else {
                                    i++;
                                }
                                cb1(err1, result1);
                            })
                        },
                        function (err1, n) {
                            if (found) {
                                cb(err1, i);
                            } else {
                                cb(obj.errMsg || "Could not Get Next Sequence Number", null);
                            }
                        })
                } else {
                    if (obj.minValue && sno < obj.minValue) {
                        sno = obj.minValue;
                    }
                    cb(err, sno);
                }
            } else {
                cb(err, null);
            }
        })
    }

    /**
     * Updates the document excluding the specified fields from the object 
     * @param collName collection name
     * @param obj Mongo Document 
     * @param exclude fields to be excluded
     * @param cb Callback
     */
    public update(collName: string, obj: IMongoDoc, exclude?: string[], cb?: Function): void {
        if (!exclude) {
            throw Error("Callback not specified");
        }
        if (!cb && typeof exclude == "function") {
            cb = exclude;
            exclude = [];
        }

        let id;
        try {
            id = this.db.ObjectId(obj._id);
        } catch (err) {
            return cb("Invalid Id");
        }
        const updateObj = Object.assign({}, obj);
        delete updateObj._id;
        updateObj.utime = new Date();

        exclude.forEach((key) => delete updateObj[key]);

        this.db.collection(collName).update({
            _id: id
        }, {
                $set: updateObj
            }, {
                upsert: false,
                multi: false,
            }, cb);
    }

    /**
     * Get a list of documents in a collection - can be used for CRUD - list apis
     * @param collName collection name
     * @param obj options
     * @param cb Callback
     */
    public getList(collName: string, obj: IGetList, options: IGetByIdOptions, cb: Function): void {
        if (!cb && typeof options === "function") {
            cb = options;
            options = null;
        }


        obj = obj || {};
        obj.query = this.getObj(obj.query);
        obj.project = this.getObj(obj.project);
        obj.sort = this.getObj(obj.sort, true);

        if (obj.search) {
            const regex = new RegExp(".*" + obj.search + ".*", "i");
            (obj.query)[obj.searchField || "name"] = {
                $regex: regex
            }
        }

        if (options) {
            if (options.query) {
                Object.assign(obj.query, options.query)
            }

            if (options.project) {
                Object.assign(obj.project, options.project)
            }
        }

        sh_async.autoInject({
            getCount: (cb1) => {
                this.db.collection(collName).find(obj.query).count(cb1);
            },
            getList: (cb1) => {
                if (obj.recordsPerPage) {
                    const limit = parseInt(obj.recordsPerPage.toString());
                    const skip = (parseInt(obj.pageNo ? obj.pageNo.toString() : "1") - 1) * limit;

                    this.db.collection(collName).find(obj.query, obj.project)
                        .sort(obj.sort)
                        .skip(skip)
                        .limit(limit, cb1);
                } else {
                    this.db.collection(collName).find(obj.query, obj.project)
                        .sort(obj.sort, cb1);
                }
            }
        }, function (err, results) {
            cb(err, {
                count: results.getCount,
                list: results.getList
            })
        })
    }

    /**
     * Removes a document/sets isDeleted flag on the document
     * @param collName collection name
     * @param id mongoDb document id
     * @param removeDoc document will be removed if true, else will set isDeleted flag on the document
     * @param cb Callback
     */
    public remove(collName: string, id: string, removeDoc: boolean | Function, cb?: Function): void {

        try {
            id = this.db.ObjectId(id);
        } catch (err) {
            return cb("Invalid Id");
        }

        if (!cb && typeof removeDoc == "function") {
            cb = removeDoc;
            removeDoc = true;
        }

        if (removeDoc) {
            this.db.collection(collName).remove({
                _id: id
            }, cb);
        } else {
            this.db.collection(collName).update({
                _id: id
            }, {
                    $set: {
                        isDeleted: true,
                        deltime: new Date()
                    }
                }, {
                    multi: false,
                    upsert: false
                }, cb);
        }
    }

    /**
     * Removes multiple documents at once
     * @param collName Collection Name
     * @param ids List of Mongo id
     * @param removeDoc document will be removed if true, else will set isDeleted flag on the document
     * @param verbose When true, each document is removed individually and if any failure is seen then individual messages is associated with each failed Id
     * @param cb Callback
     */
    public removeMulti(collName: string, ids: string[], removeDoc: boolean, verbose: boolean, cb: Function): void {
        if (!cb) {
            if (!verbose) {
                if (typeof removeDoc === "function") {
                    cb = removeDoc;
                    removeDoc = true;
                    verbose = false;
                }
            } else {
                if (typeof verbose === "function") {
                    cb = verbose;
                    verbose = false;
                }
            }
        }

        if (verbose) {
            const results = {
                removed: 0,
                failed: {}
            };

            const removeIterator = (id, selfCb) => {
                this.remove(collName, id, removeDoc, (err, result) => {
                    if (err) {
                        results.failed[id] = typeof err === "string" ? err : err.reason
                    } else if (result && result.n == 1) {
                        results.removed++;
                    } else {
                        results.failed[id] = "Document matching the given id does not exist"
                    }

                    selfCb();
                })
            }

            sh_async.each(
                ids,
                removeIterator,
                (err, done) => {
                    if (err) {
                        this.logger.error("Error while removing multiple documents:", err)
                    }

                    cb(err, results);
                }
            )

        } else {

            // validate Each id
            const validIds = ids.map((id) => {
                try {
                    id = this.db.ObjectId(id);
                    return id;
                } catch (err) {
                    return null;
                }
            }).filter((id) => {
                return !!id;
            })

            // Remove document from Mongodb
            if (removeDoc) {
                this.db.collection(collName).remove({
                    _id: {
                        $in: validIds
                    }
                }, cb)

                // Persist the document with isDeleted: true flag
            } else {
                this.db.collection(collName).update({
                    _id: {
                        $in: validIds
                    }
                }, {
                        $set: {
                            isDeleted: true,
                            deltime: new Date()
                        }
                    }, {
                        multi: true,
                        upsert: false
                    }, cb)
            }
        }
    }


    /**
     * Splits the selected range of documents by time and then groups them based on grouping logic
     * @param collName collection name
     * @param obj options
     * @param cb Callback
     */
    public splitTimeThenGrp(collName: string, obj: ISplitTimeThenGrp, cb: Function): void {
        /**
         * LOGIC
         * find match -> required docs
         * then project -> generate n attach date with each item based on "groupBy"/"interval"
         * then group -> with date as id and project required fields
         * 
         * 0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15
         * match -> 3 4 5 6 7 8 9 10 11 12
         * project -> 3.date = a, 4.date = a, 5.date = b, 6.date = b,
         * group($first) -> 3, 5
         */

        const self = this;
        const match = {};
        match[obj.key.name] = {
            $gte: obj.key.min,
            $lt: obj.key.max
        }

        let dateField: string | object = "$" + obj.key.name;
        if (obj.key.type && obj.key.type.toLowerCase() == "unix") {
            dateField = {
                $add: [new Date(0), "$" + obj.key.name]
            }
        }

        const project1 = {
            date: {
                $dateToString: {
                    format: self.getDateFormat(obj.groupBy),
                    date: dateField
                }
            }
        }
        obj.project.forEach((reqField: string) => {
            project1[reqField] = 1
        })

        const group = {
            _id: "$date"
        };
        obj.project.forEach((reqField) => {
            group[reqField] = {}
            group[reqField][obj.groupLogic || "$first"] = "$" + reqField;
        })

        const project2 = {}
        if (obj.key.type && obj.key.type.toLowerCase() == "unix") {
            project2[obj.key.name] = {
                $subtract: ["$_id", new Date(0)]
            }
            obj.project.forEach((reqField: string) => {
                project2[reqField] = 1
            })

        } else {
            project2[obj.key.name] = "$_id";
            obj.project.forEach((reqField: string) => {
                project2[reqField] = 1
            })
        }

        const aggregate: object[] = [
            { $match: match },
            { $project: project1 },
            { $group: group },
            { $project: project2 }
        ]
        // aggregate.push({ $project: project2 });

        this.db.collection(collName).aggregate(aggregate, cb);
    }

    /**
     * Selects n number of documents from m range of selected documents based on grouping logic
     * @param collName collection name
     * @param obj options
     * @param cb Callback
     */
    public selectNinM(collName: string, obj: ISelectNinM, cb: Function): void {
        /**
         * LOGIC
         * match -> the required docs
         * then group -> to form an array of matched docs
         * then unwind -> to assign index to each doc
         * then project -> generate and attach "n" which is computed using "numOfPoints" to return
         * then group -> with n as _id to return "numOfPoints" documents
         * 
         * 0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15
         * match -> 3 4 5 6 7 8 9 10 11 12 13
         * group -> {id: null, data: [3 4 5 6 7 8 9 10 11 12 13]}
         * unwind -> 3.index = 1, 4.index = 2 ...
         * project -> 3.nth = 1, 4.nth = 1, 5.nth = 2, 6.nth = 2 ...
         * group -> 3, 5, 7
         */

        const match = obj.query;

        const push = {};
        obj.project.forEach((key) => {
            push[key] = "$" + key;
        })

        const group1 = {
            _id: null,
            data: {
                $push: push
            },
            count: {
                $sum: 1
            }
        }

        const unwind = {
            path: "$data",
            includeArrayIndex: "index"
        }

        const project = {
            nth: {
                $floor: {
                    $divide: ["$index", {
                        $divide: ["$count", obj.numOfPoints]
                    }]
                }
            },
            data: 1
        }

        const group2: any = {
            _id: "$nth",
        }
        group2.data = {}
        group2.data[obj.groupLogic] = "$data";

        const aggregate = [{
            $match: match
        }, {
            $group: group1
        }, {
            $unwind: unwind
        }, {
            $project: project
        }, {
            $group: group2
        }]

        this.db.collection(collName).aggregate(aggregate, cb);
    }


    /**
     * Get the max value of a numerical field in a collection
     * @param collName collection name
     * @param obj options
     * @param cb Callback
     */
    private getMaxValue(collName: string, obj: IMaxValue, cb: Function): void {
        /**
         * Flow 
         * match -> unwind(optional) -> group (To find max)
         */

        const group = {
            _id: null,
            sno: {
                $max: "$" + obj.key
            }
        }

        const aggregate: Array<object> = [
            { $match: obj.query || {} }
        ]
        if (obj.unwind) { // Use aggregate only when unwind is specified
            aggregate.push({
                "$unwind": obj.unwind[0] == "$" ? obj.unwind : "$" + obj.unwind
            })
        }
        aggregate.push({
            "$group": group
        })
        this.db.collection(collName).aggregate(aggregate, (err, result) => {
            if (!err) {
                if (result && result[0]) {
                    cb(null, result[0].sno);
                } else {
                    cb(null, 0);
                }
            } else {
                cb(err);
            }
        });
    }

    private isValidationOnUpdate(data: IValidationNonExistenceUpdate | IValidationNonExistenceUpdate[]): data is IValidationNonExistenceUpdate {
        return (<IValidationNonExistenceUpdate[]>data).length !== undefined;
    }

    private isValidateObject(data: IValidationNonExistence | IValidationNonExistence[]): data is IValidationNonExistence {
        return (<IValidationNonExistence[]>data).length !== undefined;
    }

    /**
     * Convert object/string to object, it also converts -name --> {name: -1} [Useful for sort]
     * Used in getList API
     * @param data 
     * @param sort 
     * 
     * @returns {object}
     */
    private getObj(data: string | object, sort?: boolean): object {
        if (data) {
            if (typeof data == "string") { // if string then parse
                try {
                    data = JSON.parse(data);
                    return <object>data;
                } catch (err) {
                    // if parsing fails, then check if its sort
                    if (sort == true) {
                        data = data.replace(/ /g, "");
                        if (data[0] == "-") {
                            const val = data.slice(1);
                            data = {};
                            data[val] = -1;
                        } else {
                            const val = data
                            data = {};
                            data[val] = 1;
                        }
                        return data;
                    } else {
                        return {};
                    }
                }
            }
            return data;
        }
        return {}
    }
}