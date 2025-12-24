"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jsonArrayOrString = exports.emailOrPhoneValidation = exports.urlValidator = exports.idParamValidator = exports.passwordValidator = exports.nullableDateTimeValidator = exports.dateTimeValidator = exports.nullableNumberValidator = exports.numberValidator = exports.nullableBooleanValidator = exports.booleanValidator = exports.jsonValidator = exports.fileValidator = exports.nullableStringValidator = exports.stringValidator = exports.optionalPhoneNumberValidator = exports.phoneNumberValidator = exports.optionalEmailValidator = exports.emailValidator = exports.optionalIdValidator = exports.idValidator = void 0;
const logger_1 = require("@/utils/logger/logger");
const joi_1 = __importDefault(require("joi"));
const idValidator = (field) => {
    logger_1.logger.info(field);
    return joi_1.default.string().min(20).max(36).required().messages({
        'string.pattern.base': 'validation.idFormat',
        'string.base': `validation.string`,
        'string.empty': `validation.notEmpty`,
        'string.required': `validation.required`,
    });
};
exports.idValidator = idValidator;
const optionalIdValidator = (field) => {
    logger_1.logger.info(field);
    return joi_1.default.string().min(20).max(36).allow(null, '').optional().messages({
        'string.pattern.base': 'validation.idFormat',
        'string.base': `validation.string`,
        'string.empty': `validation.notEmpty`,
        'string.required': `validation.required`,
    });
};
exports.optionalIdValidator = optionalIdValidator;
const emailValidator = () => {
    return joi_1.default.string()
        .email({ tlds: { allow: false } })
        .required()
        .messages({
        'string.email': `validation.email`,
        'string.base': `validation.string`,
        'string.empty': `validation.notEmpty`,
        'any.required': `validation.required`,
    });
};
exports.emailValidator = emailValidator;
const optionalEmailValidator = () => {
    return joi_1.default.string()
        .email({ tlds: { allow: false } })
        .optional()
        .allow(null, '')
        .messages({
        'string.email': `validation.email`,
        'string.base': `validation.string`,
        'string.empty': `validation.notEmpty`,
    });
};
exports.optionalEmailValidator = optionalEmailValidator;
const phoneNumberValidator = () => {
    return joi_1.default.string()
        .pattern(/^(09|07|'+'251|00)\d{8}$/)
        .required()
        .messages({
        'string.pattern.base': `validation.phoneNumber`,
        'string.base': `validation.number`,
        'string.empty': `validation.notEmpty`,
        'string.required': `validation.required`,
    });
};
exports.phoneNumberValidator = phoneNumberValidator;
const optionalPhoneNumberValidator = () => {
    return joi_1.default.string()
        .pattern(/^(09|07|'+'251|00)\d{8}$/)
        .optional()
        .messages({
        'string.pattern.base': `validation.phoneNumber`,
        'string.base': `validation.number`,
        'string.empty': `validation.notEmpty`,
        'string.required': `validation.required`,
    });
};
exports.optionalPhoneNumberValidator = optionalPhoneNumberValidator;
const stringValidator = (min = 2, max = 500) => {
    return joi_1.default.string().trim().min(min).max(max).required().messages({
        'string.base': `validation.string`,
        'any.required': `validation.required`,
        'string.min': `validation.min`,
        'string.max': `validation.max`,
    });
};
exports.stringValidator = stringValidator;
const nullableStringValidator = (min = 2, max = 500) => {
    return joi_1.default.string()
        .trim(false)
        .min(min)
        .max(max)
        .allow(null, '')
        .optional()
        .messages({
        'string.base': `validation.string`,
        'string.min': `validation.min`,
        'string.max': `validation.max`,
    });
};
exports.nullableStringValidator = nullableStringValidator;
const fileValidator = () => {
    return joi_1.default.any().optional().messages({
        'any.required': `validation.required`,
    });
};
exports.fileValidator = fileValidator;
const jsonValidator = (field = 'JSON') => joi_1.default.alternatives()
    .try(joi_1.default.object(), joi_1.default.string().custom((value, helpers) => {
    // allow string that is valid JSON
    try {
        JSON.parse(value);
        return value;
    }
    catch {
        return helpers.error('any.invalid');
    }
}, 'JSON string parse'))
    .messages({
    'any.invalid': `${field} must be a valid JSON object or JSON string`,
    'object.base': `${field} must be an object`,
    'string.base': `${field} must be a JSON string`,
});
exports.jsonValidator = jsonValidator;
const booleanValidator = () => {
    return joi_1.default.boolean().required().messages({
        'boolean.base': `validation.boolean`,
        'any.required': `validation.required`,
    });
};
exports.booleanValidator = booleanValidator;
const nullableBooleanValidator = () => {
    return joi_1.default.boolean().optional().messages({
        'boolean.base': `validation.boolean`,
    });
};
exports.nullableBooleanValidator = nullableBooleanValidator;
const numberValidator = () => {
    return joi_1.default.number().required().messages({
        'number.base': `validation.number`,
        'any.required': `validation.required`,
        'number.integer': `validation.integer`,
    });
};
exports.numberValidator = numberValidator;
const nullableNumberValidator = () => {
    return joi_1.default.number().allow(null, '').optional().messages({
        'number.base': `validation.number`,
        'any.required': `validation.required`,
        'number.integer': `validation.integer`,
    });
};
exports.nullableNumberValidator = nullableNumberValidator;
const dateTimeValidator = () => {
    return joi_1.default.date().required().iso().messages({
        'date.base': `validation.date`,
        'any.required': `validation.required`,
        'date.iso': `validation.dateIso`,
    });
};
exports.dateTimeValidator = dateTimeValidator;
const nullableDateTimeValidator = () => {
    return joi_1.default.date().optional().iso().messages({
        'date.base': `validation.date`,
        'any.required': `validation.required`,
        'date.iso': `validation.dateIso`,
    });
};
exports.nullableDateTimeValidator = nullableDateTimeValidator;
const passwordValidator = () => {
    return joi_1.default.string().min(6).required().messages({
        'string.base': `validation.string`,
        'any.required': `validation.required`,
        'string.min': `validation.min`,
    });
};
exports.passwordValidator = passwordValidator;
const idParamValidator = (field = 'ID') => {
    return joi_1.default.object({
        body: joi_1.default.object().length(0),
        params: joi_1.default.object({
            id: (0, exports.idValidator)(field),
        }),
        query: joi_1.default.object().length(0),
    });
};
exports.idParamValidator = idParamValidator;
const urlValidator = () => {
    return joi_1.default.string().uri().required().messages({
        'string.base': `validation.string`,
        'any.required': `validation.required`,
        'string.uri': `validation.url`,
    });
};
exports.urlValidator = urlValidator;
const emailOrPhoneValidation = (label) => joi_1.default.string()
    .trim()
    .required()
    .label(label)
    .custom((val, helpers) => {
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    const isPhone = /^(09|07)\d{8}$/.test(val);
    if (!isEmail && !isPhone) {
        return helpers.error('any.invalid');
    }
    return val;
}, 'Email or phone validation')
    .messages({
    'any.invalid': `validation.phoneNumberOrEmail`,
});
exports.emailOrPhoneValidation = emailOrPhoneValidation;
exports.jsonArrayOrString = joi_1.default.alternatives().try(joi_1.default.array().items(joi_1.default.object({
    title: (0, exports.stringValidator)(2, 100),
    description: (0, exports.jsonValidator)(),
})), joi_1.default.string().custom((value, helpers) => {
    let arr;
    try {
        arr = JSON.parse(value);
    }
    catch {
        return helpers.error('any.invalid');
    }
    if (!Array.isArray(arr)) {
        return helpers.error('any.invalid');
    }
    return arr;
}, 'JSON-array parser'));
