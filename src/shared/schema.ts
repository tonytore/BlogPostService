import { logger } from '@/utils/logger/logger';
import Joi from 'joi';

export const idValidator = (field: string) => {
  logger.info(field);
  return Joi.string().min(20).max(36).required().messages({
    'string.pattern.base': 'validation.idFormat',
    'string.base': `validation.string`,
    'string.empty': `validation.notEmpty`,
    'string.required': `validation.required`,
  });
};

export const optionalIdValidator = (field: string) => {
  logger.info(field);
  return Joi.string().min(20).max(36).allow(null, '').optional().messages({
    'string.pattern.base': 'validation.idFormat',
    'string.base': `validation.string`,
    'string.empty': `validation.notEmpty`,
    'string.required': `validation.required`,
  });
};

export const emailValidator = () => {
  return Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.email': `validation.email`,
      'string.base': `validation.string`,
      'string.empty': `validation.notEmpty`,
      'any.required': `validation.required`,
    });
};

export const optionalEmailValidator = () => {
  return Joi.string()
    .email({ tlds: { allow: false } })
    .optional()
    .allow(null, '')
    .messages({
      'string.email': `validation.email`,
      'string.base': `validation.string`,
      'string.empty': `validation.notEmpty`,
    });
};

export const phoneNumberValidator = () => {
  return Joi.string()
    .pattern(/^(09|07|'+'251|00)\d{8}$/)
    .required()
    .messages({
      'string.pattern.base': `validation.phoneNumber`,
      'string.base': `validation.number`,
      'string.empty': `validation.notEmpty`,
      'string.required': `validation.required`,
    });
};
export const optionalPhoneNumberValidator = () => {
  return Joi.string()
    .pattern(/^(09|07|'+'251|00)\d{8}$/)
    .optional()
    .messages({
      'string.pattern.base': `validation.phoneNumber`,
      'string.base': `validation.number`,
      'string.empty': `validation.notEmpty`,
      'string.required': `validation.required`,
    });
};

export const stringValidator = (min = 2, max = 500) => {
  return Joi.string().trim().min(min).max(max).required().messages({
    'string.base': `validation.string`,
    'any.required': `validation.required`,
    'string.min': `validation.min`,
    'string.max': `validation.max`,
  });
};

export const nullableStringValidator = (min = 2, max = 500) => {
  return Joi.string()
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

export const fileValidator = () => {
  return Joi.any().optional().messages({
    'any.required': `validation.required`,
  });
};

export const jsonValidator = (field = 'JSON') =>
  Joi.alternatives()
    .try(
      Joi.object(),
      Joi.string().custom((value, helpers) => {
        // allow string that is valid JSON
        try {
          JSON.parse(value);
          return value;
        } catch {
          return helpers.error('any.invalid');
        }
      }, 'JSON string parse'),
    )
    .messages({
      'any.invalid': `${field} must be a valid JSON object or JSON string`,
      'object.base': `${field} must be an object`,
      'string.base': `${field} must be a JSON string`,
    });

export const booleanValidator = () => {
  return Joi.boolean().required().messages({
    'boolean.base': `validation.boolean`,
    'any.required': `validation.required`,
  });
};
export const nullableBooleanValidator = () => {
  return Joi.boolean().optional().messages({
    'boolean.base': `validation.boolean`,
  });
};
export const numberValidator = () => {
  return Joi.number().required().messages({
    'number.base': `validation.number`,
    'any.required': `validation.required`,
    'number.integer': `validation.integer`,
  });
};
export const nullableNumberValidator = () => {
  return Joi.number().allow(null, '').optional().messages({
    'number.base': `validation.number`,
    'any.required': `validation.required`,
    'number.integer': `validation.integer`,
  });
};

export const dateTimeValidator = () => {
  return Joi.date().required().iso().messages({
    'date.base': `validation.date`,
    'any.required': `validation.required`,
    'date.iso': `validation.dateIso`,
  });
};
export const nullableDateTimeValidator = () => {
  return Joi.date().optional().iso().messages({
    'date.base': `validation.date`,
    'any.required': `validation.required`,
    'date.iso': `validation.dateIso`,
  });
};

export const passwordValidator = () => {
  return Joi.string().min(6).required().messages({
    'string.base': `validation.string`,
    'any.required': `validation.required`,
    'string.min': `validation.min`,
  });
};

export const idParamValidator = (field = 'ID') => {
  return Joi.object({
    body: Joi.object().length(0),
    params: Joi.object({
      id: idValidator(field),
    }),
    query: Joi.object().length(0),
  });
};

export const urlValidator = () => {
  return Joi.string().uri().required().messages({
    'string.base': `validation.string`,
    'any.required': `validation.required`,
    'string.uri': `validation.url`,
  });
};

export const emailOrPhoneValidation = (label: string) =>
  Joi.string()
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

export const jsonArrayOrString = Joi.alternatives().try(
  Joi.array().items(
    Joi.object({
      title: stringValidator(2, 100),
      description: jsonValidator(),
    }),
  ),
  Joi.string().custom((value, helpers) => {
    let arr;
    try {
      arr = JSON.parse(value);
    } catch {
      return helpers.error('any.invalid');
    }
    if (!Array.isArray(arr)) {
      return helpers.error('any.invalid');
    }
    return arr;
  }, 'JSON-array parser'),
);
