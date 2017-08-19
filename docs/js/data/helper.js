module.exports = {
    desc: "Commonly used functions for input validations, salthash etc",
    initialCode: `
var Helper = require("express-toppings").Helper;
var helper = new Helper();                    
                    `,
    methods: [
        {
            id: 'filterKeysInObj',
            name: 'filterKeysInObj(obj: string, filter: string[], sameObj?: boolean) => object',
            nav: 'filterKeysInObj',
            returns: {
                type: 'object',
                desc: 'An object that would not include the keys specified in the filter'
            },
            params: [
                {
                    name: 'obj',
                    desc: '[object] Input object'
                }, {
                    name: 'filter',
                    desc: '[string[]] Array of keys to be removed'
                }, {
                    name: 'sameObj (optional)',
                    desc: '[boolean] If the filter operation has to be applied on the same obj or a copy of it.',
                    default: "false"
                }
            ],
            desc: "Filters out/removes the keys for the given object",
            example: `
var obj = {a: 1, b: 1, c: 1},
    filter = ["a", "b"];

console.log(helper.filterKeysInObj(obj, filter, false)) // {c: 1}
// obj = {a: 1, b: 1, c: 1}


console.log(helper.filterKeysInObj(obj, filter, true)) // {c: 1}
console.log(obj) // {c: 1}
                    `
        },
        {
            id: 'retainKeysInObj',
            name: 'retainKeysInObj(obj: string, retain: string[], sameObj?: boolean) => object',
            nav: 'retainKeysInObj',
            return: {
                type: 'object',
                desc: 'An Object whose keys would include only the ones specified'
            },
            params: [
                {
                    name: 'obj',
                    desc: '[object] Input object'
                }, {
                    name: 'retain',
                    desc: '[string[]] Array of keys to be retained'
                }, {
                    name: 'sameObj (optional)',
                    desc: '[boolean] If the filter operation has to be applied on the same obj or a copy of it.',
                    default: "false"
                }
            ],
            desc: "Retains only the given keys in the object",
            example: `
var obj = {a: 1, b: 1, c: 1},
    retain = ["a", "b"];

console.log(helper.retainKeysInObj(obj, filter, false)) // {a: 1, b: 1}
// obj = {a: 1, b: 1, c: 1}


console.log(helper.retainKeysInObj(obj, filter, true)) // {a: 1, b: 1}
console.log(obj) // {a: 1, b: 1}
                    `
        },
        {
            id: 'weakPwd',
            name: 'weakPwd(password: string, config: object) => string',
            nav: 'weakPassword',
            return: {
                type: 'string',
                desc: 'Error, if the given string does not satisfy the conditions specified in the config object'
            },
            params: [
                {
                    name: 'password',
                    desc: '[string] String to check for weak password'
                }, {
                    name: 'config',
                    desc: '[object] Weak password Options'
                }, {
                    name: '-> config.minLen (optional)',
                    desc: '[boolean] Minimum length of password expected'
                }, {
                    name: '-> config.maxLen (optional)',
                    desc: '[boolean] Maximum length of password expected'
                }, {
                    name: '-> config.upperCase (optional)',
                    desc: '[boolean] If password should contain atleast one UpperCase letter'
                }, {
                    name: '-> config.lowerCase (optional)',
                    desc: '[boolean] If password should contain atleast one LowerCase letter'
                }, {
                    name: '-> config.numbers (optional)',
                    desc: '[boolean] If password should contain atleast one numbers'
                }, {
                    name: '-> config.specialChars (optional)',
                    desc: '[string[]] If password must contain atleast one special character from the given list'
                }
            ],
            desc: `Checks if the given string is a weak password`,
            example: [`
var password = "Test123"
console.log(helper.weakPwd(password, {minLen: 3, maxLen: 5}))
// Please choose a password length of atmost 5 characters
                    `
            ]
        },
        {
            id: 'prefixToQueryObject',
            name: 'prefixToQueryObject(prefix: string, obj: object) => object',
            nav: 'prefixToQueryObject',
            return: {
                type: 'object',
                desc: 'Object with prefixed keys'
            },
            params: [
                {
                    name: 'prefix',
                    desc: '[string] String to be prefixed to each key'
                }, {
                    name: 'obj',
                    desc: `[object] Object whose keys has to be prefixed`
                }
            ],
            desc: `Prefix the given key to each string in the object`,
            example: [`
var obj = {a: 1, b: 1};
var prefix = "test"
console.log(helper.prefixToQueryObject(prefix, obj))
// {"test.a" : 1, "test.b": 1}
                    `
            ]
        },
        {
            id: 'validateFieldsCb',
            name: 'validateFieldsCb(obj: object, fieldSpecs: IFieldSpec[], strict: boolean, callback: Function): void;',
            nav: 'validateFieldsCb',
            params: [
                {
                    name: 'obj',
                    desc: '[object] Object to be validated'
                }, {
                    name: 'fieldSpecs',
                    desc: "[object[]] Field Validation Options",
                }, {
                    name: '-> fieldSpec.name',
                    desc: `[string] Name of the field`
                }, {
                    name: '-> fieldSpec.type',
                    desc: `[string] Expected type of the field`
                }, {
                    name: '-> fieldSpec.required (optional)',
                    desc: `[boolean] If the field is required to be present`
                }, {
                    name: '-> fieldSpec.preTransform',
                    desc: `[Function : (data, ...preTransformArgs) => any]. Returned Data would be futher used for validation`
                }, {
                    name: '-> fieldSpec.preTransformArgs',
                    desc: `[any[]] Arguments to be passed to fieldSpec.preTranform function`
                }, {
                    name: '-> fieldSpec.validate',
                    desc: `[Function| Function[] : (data, ...validateArgs[index], done?: (err, isValid: boolean))]. Validation Function/s. If the number of args(data + validateArgs) > function.arguments.length then the last param is considered as a callback and the same is passed to the validation function`
                }, {
                    name: '-> fieldSpec.validateArgs',
                    desc: `[any[]] Arguments to be passed to fieldSpec.validate function`
                }, {
                    name: '-> fieldSpec.validateErrMsg',
                    desc: `[string | string[]] Error Messages to be returned on validation failure`
                }, {
                    name: '-> fieldSpec.transform',
                    desc: `[Function | Function[] : (data, ...transformArgs, done?: (err, transformedData) => void)]: any. Transform Function/s. If the number of args(data + transformArgs) > function.arguments.length then the last param is considered as a callback and the same is passed to the transform function`
                }, {
                    name: '-> fieldSpec.transformArgs',
                    desc: `[any | any[]] Arguments to be passed to fieldSpec.transform function`
                }, {
                    name: '-> fieldSpec.errMsg',
                    desc: `This will be return when fieldName is not present/type mismatch is found/validation errMsg is not specified`
                }, {
                    name: 'strict',
                    desc: 'If this is true, then the fields that are not specified in fieldSpecs will be removed'
                }
            ],
            desc: `Asynchronous form validations`,
            example: [`
var obj = {a: 1, b: "asdf", c: [], d: {}, e: '2'};
var validations = [
    {
        name: 'a',
        type: "number",
        errMsg: "'a' is a required field and must be a number"
    }, {
        name: 'b',
        type: 'string',
        validate: (data, len) => data.length > len,
        validateArgs: 2,
        validateErrMsg: "'b' must have a atleast 2 characters",
        errMsg: "'b' is a required field"
    }, {
        name: 'c',
        type: 'array',
        errMsg: "'c' must be an array"
    }, {
        name: 'd',
        type: 'object',
        errMsg: "'d' must be an object"
    }, {
        name: 'e',
        type: ['string', 'number'],
        preTransform: (data) => parseInt(data),
        validate: (data, minVal) => data > minVal,
        validateArgs: 2
    }, {
        name: 'f',
        type: 'string',
        required: false,
        errMsg: "'f' must be a string"
    }
]

helper.validateFieldsCb(obj, validations, false, (err) => console.log(err))
// null
                    `
            ]
        },
        {
            id: 'validateFields',
            name: 'validateFields(obj: object, fieldSpecs: IFieldSpec[], strict: boolean): boolean;',
            return: {
                type: 'boolean',
                desc: 'true - if all the fields are valid'
            },
            nav: 'validateFields',
            desc: `(Recommend to use validateFieldsCb) Synchronous form validations. Params are same as validateFieldsCb except that validateFns and transformFns are all synchronous functions`,
            params: [
                {
                    name: 'obj',
                    desc: '[object] object to be validated'
                }, {
                    name: 'fieldSpecs',
                    desc: '[object] Field Validation options'
                }, {
                    name: '-> fieldSpec.name',
                    desc: '[string] Name of field'
                }, {
                    name: '-> fieldSpec.type',
                    desc: '[string | string[]] Expected type of the field'
                }, {
                    name: '-> fieldSpec.preTransform',
                    desc: '[(data, ...preTransformArgs) => any] Pre-Transform function'
                }, {
                    name: '-> fieldSpec.preTransformArgs',
                    desc: '[any[]] Arguments for preTransform function'
                }, {
                    name: '-> fieldSpec.validate',
                    desc: '[Function | Function[] : (data, ...validateArgs) => boolean] Validation function/s '
                }, {
                    name: '-> fieldSpec.validateArgs',
                    desc: '[any[]] Arguments for validate function/s'
                }, {
                    name: '-> fieldSpec.transform',
                    desc: '[(data, ...transformArgs) => any] Transform function'
                }, {
                    name: '-> fieldSpec.transformArgs',
                    desc: '[any[]] Arguments for tranform function'
                }
            ],
            example: [`
var obj = {a: 1, b: "asdf", c: [], d: {}, e: '2'};
var validations = [
    {
        name: 'a',
        type: "number",
    }, {
        name: 'b',
        type: 'string',
        validate: (data, len) => data.length > len,
        validateArgs: 2,
    }, {
        name: 'c',
        type: 'array',
    }, {
        name: 'd',
        type: 'object',
    }, {
        name: 'e',
        type: ['string', 'number'],
        preTransform: (data) => parseInt(data),
        validate:  [ minValueCheck, maxValueCheck ],
        validateArgs: 2
    }, {
        name: 'f',
        type: 'string',
        required: false,
    }
]

if(helper.validateFields(obj, validations, false)) {
    // All Fields are valid
}
                    `
            ]
        }, {
            id: 'saltHash',
            name: 'saltHashsaltHash(pwd: string, saltLength?: number) => string',
            nav: 'saltHash',
            return: {
                type: 'string',
                desc: 'Salted and hashed password'
            },
            params: [
                {
                    name: 'pwd',
                    desc: '[string] String to be salted and hashed'
                }, {
                    name: 'saltLength (optional)',
                    desc: `[number] Length of salt to be Prefixed`,
                    default: '16'
                }
            ],
            desc: `Adds a salt and hashes the password`,
            example: [`
var password = "password";
console.log(helper.saltHash(password, 10));
// 567981784abc67f9678fa760bc679e67879a7c - this is just an indicative password
                    `
            ]
        }, {
            id: 'verifySaltHash',
            name: 'verifySaltHash(salted: string, pwd: string, saltLength?: number) => boolean',
            nav: 'verifySaltHash',
            return: {
                type: 'boolean',
                desc: 'true - if the password matches the salted hash'
            },
            params: [
                {
                    name: 'salted',
                    desc: '[string] Salted and hashed password'
                }, {
                    name: 'pwd',
                    desc: `[string] Password to be validated`
                }, {
                    name: 'saltLength (optional)',
                    desc: `[number] Length of salt prefix in the salted hash`,
                    default: '16'
                }
            ],
            desc: `Verifies if the salted hash password matches the password`,
            example: [`
var password = "password"
var salted = "567981784abc67f9678fa760bc679e67879a7c"; // this is just an indicative password
helper.verifySaltHash(salted, password, 10) // returns true
                    `
            ]
        },
    ]
}