module.exports = {
    desc: "Includes common validation functions",
    initialCode: `
var HelperValidate = require('express-toppings').HelperValidate;
var helperValidate = new HelperValidate()

// These Helper Function are commonly used in form validation along with helper.validateFieldsCb
                `,
    methods: [{
        id: 'range',
        name: 'range(data: number, min: number, max: number) => boolean',
        nav: 'range',
        desc: "Validates if the given number if within the specified range",
        params: [{
            name: 'data',
            type: 'number',
            desc: 'Data to be validated'
        }, {
            name: 'min',
            type: 'number',
            desc: 'Lower Limit'
        }, {
            name: 'max',
            type: 'number',
            desc: 'Upper Limit'
        }],
        example: [`
var data = 10;
helperValidate.range(10, 5, 15) // true                
                    `]
    }, {
        id: 'length',
        name: 'length(data: string, min: number, max?: number) => boolean',
        nav: 'length',
        desc: "Validates if the length of the array|string is within the limits",
        params: [{
            name: 'data',
            type: 'string|array',
            desc: 'Data to be validated'

        }, {
            name: 'min',
            type: 'number',
            desc: 'Lower Limit'
        }, {
            name: 'max (optional)',
            type: 'number',
            desc: 'Upper Limit. If this param is not provided then only lower limit validation is performed'
        }],
        example: [`
var data = "test";
helperValidate.length(data, 2, 6) // true
var arr = [1, 2]
helperValidate.length(data, 3, 5) // false                    
                    `]
    }, {
        id: 'isMongoId',
        name: 'isMongoId(id: string) => boolean',
        nav: 'isMongoId',
        desc: "Validates if the given string is a valid MongoId",
        params: [{
            name: 'id',
            type: 'string',
            desc: 'Id to be validated'
        }],
        example: [`
var id = "5968d825f7031236fed9ec5f"
helperValidate.isMongoId(id) // true                    
                    `]
    }, {
        id: 'in',
        name: 'in(data: any, arr: any[]) => boolean',
        nav: 'in',
        desc: 'Checks if the data is present in the given array',
        params: [{
            name: 'data',
            type: 'string|number|object|array',
            desc: 'Data to be checked'
        }, {
            name: 'arr',
            type: 'array',
            desc: 'Array to be searched for Data'
        }],
        example: [`
var data = 'a',
    arr = ['a', 'b']

helperValidate.in(data, arr) // true                    
                    `, `
var data = { name: 1, age: 3 }
var data2 = [1, 2]
var arr = [{ name: 2 }, { name: 1, age: 3 }, [1, 2]]
helperValidate.in(data, arr) // true
helperValidate.in(data2, arr) // true
                    `]
    }, {
        id: 'isName',
        name: 'isName(name: string) => boolean',
        nav: 'isName',
        desc: 'validate if the given string matches the Name format',
        params: [{
            name: 'name',
            type: 'string',
            desc: 'Data to be checked'
        }],
        example: [`
var name = 'isName_123';
helperValidate.isName(name) // true                    
                    `]
    }, {
        id: 'isEmail',
        name: 'isEmail(email: string) => boolean',
        nav: 'isEmail',
        desc: 'Validate if the given string matches the Eamil format',
        params: [{
            name: 'email',
            type: 'string',
            desc: 'Data to be checked'
        }],
        example: [`
var email = '123_asdf.jkl@co.com';
helperValidate.isEmail(email) // true                    
                    `]
    }, {
        id: 'isAlpha',
        name: 'isAlpha(data: string) => boolean',
        nav: 'isAlpha',
        desc: 'validate if the given string contains only Alphabets',
        params: [{
            name: 'data',
            type: 'string',
            desc: 'Data to be checked'
        }],
        example: [`
var str = 'asdfAASDF';
helperValidate.isAlpha(str) // true                    
                    `]
    }, {
        id: 'isNumeric',
        name: 'isNumeric(data: string): boolean',
        nav: 'isNumeric',
        desc: 'validate if the given string contains only numbers',
        params: [{
            name: 'data',
            type: 'string',
            desc: 'Data to be checked'
        }],
        example: [`
var str = '2345678';
helperValidate.isNumeric(str) // true                    
                    `]
    }, {
        id: 'isAlphaNumeric',
        name: 'isAlphaNumeric(data: string) => boolean',
        nav: 'isAlphaNumeric',
        desc: 'validate if the given string is Alphabets and numbers',
        params: [{
            name: 'data',
            type: 'string',
            desc: 'Data to be checked'
        }],
        example: [`
var str = 'isName123';
helperValidate.isAlphaNumeric(str) // true                    
                    `]
    }, {
        id: 'isDate',
        name: 'isDate(dateStr: string, format?: string) => boolean',
        nav: 'isDate',
        desc: 'Validate if the given string is in Data format',
        params: [{
            name: 'dateStr',
            type: 'string',
            desc: 'Data to be checked'
        }, {
            name: 'format (optional)',
            type: 'string',
            desc: 'Moment Date format'
        }],
        example: [`
var dateStr = '12-07-1993';
helperValidate.isDate(dateStr, 'DD-MM-YYYY') // true                    
                    `]
    }, {
        id: 'isRegex',
        name: 'isRegex(data: string, regexStr: string) => boolean',
        nav: 'isRegex',
        desc: 'Check if the data matches the regexStr pattern',
        params: [{
            name: 'data',
            type: 'string',
            desc: 'Data to be checked'
        }, {
            name: 'regexStr',
            type: 'string',
            desc: 'regex pattern to be used for validation'
        }],
        example: [`
var name = 'asdfASD_09';
helperValidate.isRegex(name, '^[a-fA-F09]+$') // true                    
                    `]
    }]
}