module.exports = {
    desc: "Common data transformation functions",
    initialCode: `
var HelperTransform = require('express-toppings').HelperTransform;
var helperTransform = new HelperTransform();

// These function are typically used for transformation in helper.validateFieldsCb
                `,
    methods: [{
        id: 'toLowerCase',
        name: 'toLowerCase(data: string) => string',
        nav: 'toLowerCase',
        desc: 'Transforms the given string to Lower Case',
        params: [{
            name: 'data',
            type: 'string',
            desc: 'Data to be transformed',
        }],
        example: [`
var str = "asdfASDF";
helperTransform.toLowerCase(str) // asdfasdf
                   `]
    }, {
        id: 'toUpperCase',
        name: 'toUpperCase(data: string) => string',
        nav: 'toUpperCase',
        desc: 'Transforms the given string to Upper Case',
        params: [{
            name: 'data',
            type: 'string',
            desc: 'Data to be transformed',
        }],
        example: [`
var str = "asdfASDF";
helperTransform.toUpperCase(str) // ASDFASDF
                   `]
    }, {
        id: 'toMongoId',
        name: 'toMongoId(id: string) => object',
        nav: 'toMongoId',
        desc: 'Transforms mongo id to Mongo Object id',
        params: [{
            name: 'id',
            type: 'string',
            desc: 'Mongo document id as string',
        }],
        example: [`
var id = "5968d825f7031236fed9ec5f";
helperTransform.toMongoId(id) // ObjectId("5968d825f7031236fed9ec5f")
                   `]
    }, {
        id: 'toDate',
        name: 'toDate(dateStr: string) => Date',
        nav: 'toDate',
        desc: 'Transforms the given string to Date Object',
        params: [{
            name: 'dateStr',
            type: 'string',
            desc: 'Date string',
        }],
        example: [`
var dateStr = "1993-07-12T00:00:00.000Z"
helperTransform.toDate(dateStr) // Date()
                   `]
    }, {
        id: 'toMoment',
        name: 'toMoment(dateStr: string) => object',
        nav: 'toMoment',
        desc: 'Transforms the given string to moment object',
        params: [{
            name: 'dateStr',
            type: 'string',
            desc: 'Date String',
        }],
        example: [`
var dateStr = "1993-07-12"
helperTransform.toMoment(dateStr) // moment()
                   `]
    }, {
        id: 'toInt',
        name: 'toInt(data: string) => number',
        nav: 'toInt',
        desc: 'Parse string to number',
        params: [{
            name: 'data',
            type: 'string',
            desc: 'number in string',
        }],
        example: [`
var data = "2"
helperTransform.toInt(data) // 2
                   `]
    }, {
        id: 'toFloat',
        name: 'toFloat(data: string, decPoints?: number) => number',
        nav: 'toFloat',
        desc: 'Parse string to float',
        params: [{
            name: 'data',
            type: 'string',
            desc: 'number in string',
        }, {
            name: 'decPoints (optional)',
            type: 'number',
            desc: "Decimal points to be included in float",
            default: "5"
        }],
        example: [`
var data = "2.1234"
helperTransform.toFloat(data, 2) // 2.12
                   `]
    }, {
        id: 'toSaltHash',
        name: 'toSaltHash(pwd: string) => string',
        nav: 'toSaltHash',
        desc: 'Adds salt and hashes the given the string',
        params: [{
            name: 'pwd',
            type: 'string',
            desc: 'password',
        }],
        example: [`
var pwd = "asdf";
helperTransform.toSaltHash(pwd) // 5678ab98fe988a98b67c89322efa779
                   `]
    }, {
        id: 'stripXss',
        name: 'stripXss(str: string) => string',
        nav: 'stripXss',
        desc: 'Removes all the html tags and the data inbetween the tags',
        params: [{
            name: 'str',
            type: 'string',
            desc: '',
        }],
        example: [`
var str = "hello <script>World</script>";
helperTransform.stripXss(str) // hello 
                   `]
    }]
}