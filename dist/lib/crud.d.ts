import * as express from "express";
export interface IRestHandler {
    (req: express.Request, res: express.Response, next?: express.NextFunction): void;
}
export interface ICRUD {
    create: IRestHandler;
    update: IRestHandler;
    remove: IRestHandler;
    removeMulti: IRestHandler;
    get: IRestHandler;
    list: IRestHandler;
}
export declare class CRUD {
    router: any;
    constructor(crud: ICRUD);
    private next(req, res, next);
    private methodNotAllowed();
}
