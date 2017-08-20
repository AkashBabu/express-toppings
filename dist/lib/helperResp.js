"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sh_Logger = require("logger-switch");
class HelperResp {
    constructor(debug) {
        this.logger = new sh_Logger("sh-resp");
        this.logger[debug ? "activate" : "deactivate"]();
        return this;
    }
    /**
     * 401 handler
     * @param res - Express Response object
     * @param comment=UNAUTHORIZED ACCESS Response data
     */
    unauth(res, comment) {
        res.status(401).send({
            error: true,
            data: comment || "UNAUTHORIZED ACCESS"
        });
    }
    /**
     * 500 handler
     * @param res Express Response object
     * @param comment=INTERNAL SERVER ERROR Response data
     */
    serverError(res, comment) {
        res.status(500).send({
            error: true,
            data: comment || "INTERNAL SERVER ERROR"
        });
    }
    /**
     * Callback Handler
     * @param res Express Response object
     * @param defaultResult Default data, if no result was passed to callback
     */
    handleResult(res, defaultResult) {
        return (err, result) => {
            defaultResult = defaultResult || [];
            if (!err) {
                res.status(200).send({
                    error: false,
                    data: this.isUndefined(result) ? defaultResult : result
                });
            }
            else {
                this.logger.error("HELPER_RESP HandleResult Err:", err);
                res.status(500).send({
                    error: true,
                    data: defaultResult
                });
            }
        };
    }
    /**
     * 200 handler
     * @param res Express Response object
     * @param data={} Response data
     */
    success(res, data) {
        res.status(200).send({
            error: false,
            data: data || {}
        });
    }
    /**
     * 400 handler
     * @param res Express Response object
     * @param data=Failed Response data
     */
    failed(res, data) {
        res.status(400).send({
            error: true,
            data: data || "Failed"
        });
    }
    /**
     * Create handler
     * @param res Express Response Object
     * @param data=CREATED Response data
     */
    post(res, data) {
        res.status(201).send({
            error: false,
            data: data || "CREATED"
        });
    }
    /**
     * Update handler
     * @param res Express Response object
     * @param data=UPDATED Response data
     */
    put(res, data) {
        res.status(202).send({
            error: false,
            data: data || "UPDATED"
        });
    }
    /**
     * Delete Handler
     * @param res Express Response object
     * @param data=DELETED Response data
     */
    delete(res, data) {
        res.status(202).send({
            error: false,
            data: data || "DELETED"
        });
    }
    /**
     * Get and List Handler
     * @param res Express Response object
     * @param data Response data
     * @param list=true if true then data Defaults to [] else {}
     */
    get(res, data, list = true) {
        res.status(200).send({
            error: false,
            data: this.isUndefined(data) ? (list ? { count: 0, list: [] } : {}) : data
        });
    }
    isUndefined(data) {
        return data == undefined || data == null;
    }
}
exports.HelperResp = HelperResp;
