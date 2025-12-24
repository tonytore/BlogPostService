import Joi from "joi";
import { requiredString } from "./shortcuts.js";

export const idSchema = (value: string) =>
  Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": `${value} field must have valid ID format`,
      "string.base": `${value} field must be a string`,
      "string.empty": `${value} field cannot be empty`,
      "string.required": `${value} field is required`,
    });

export const certificateNumberSchema = (value: string) =>
  Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": `${value} field must have valid ID format`,
      "string.base": `${value} field must be a string`,
      "string.empty": `${value} field cannot be empty`,
      "string.required": `${value} field is required`,
    });
export const optIdSchema = (value: string) =>
  Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional()
    .messages({
      "string.pattern.base": `${value} field must have valid ID format`,
      "string.base": `${value} field must be a string`,
    });
export const phoneNumberSchema = (value: string) =>
  Joi.string()
    .pattern(/^09\d{8}$/)
    .required()
    .messages({
      "string.pattern.base": `${value} field must be a valid phone number`,
      "string.base": `${value} field must be a number`,
      "string.empty": `${value} field cannot be empty`,
      "string.required": `${value} field is required`,
    });

export const emailSchema = (value: string) =>
  Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.email": `${value} field must be a valid email address`,
      "string.base": `${value} field must be a string`,
      "string.empty": `${value} field cannot be empty`,
      "any.required": `${value} field is required`,
    });
export const address = Joi.string().max(300);

export const timestamps = {
  createdAt: Joi.date().iso().optional(),
  updatedAt: Joi.date().iso().optional(),
};

export const gender = Joi.string().valid("Male", "Female").required();
export const maritalStatus = Joi.string()
  .valid("Single", "Married", "Divorced", "Widowed")
  .required();
export const cgpa = Joi.number().min(0).max(4).precision(2).required();
export const currentYear = new Date().getFullYear();
export const grade = Joi.string().valid(
  "A_PLUS",
  "A",
  "A_MINUS",
  "B_PLUS",
  "B",
  "B_MINUS",
  "C_PLUS",
  "C",
  "C_MINUS",
  "D_PLUS",
  "D",
  "D_MINUS",
  "F",
);

export const certificateStatus = Joi.string().valid(
  "GRADUATED",
  "LEARNING",
  "FAILED",
);

export const jobType = requiredString.valid("FULL-TIME", "PART-TIME", "MIXED");
