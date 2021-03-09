import decamelize from "decamelize";
import camelcase from "./camelcase";

const objectKeyProcessor = (strategy, params, depth = 10, count = 0) => {
  if (count > depth) {
    return params;
  }

  if (!isObject(params)) {
    return params;
  }

  return Object.keys(params).reduce((processed, key) => {
    let value;

    if (isObject(params[key])) {
      value = objectKeyProcessor(strategy, params[key], depth, count + 1);
    } else if (Array.isArray(params[key])) {
      value = params[key].map(value =>
        isObject(value)
          ? objectKeyProcessor(strategy, value, depth, count + 1)
          : value
      );
    } else {
      value = params[key];
    }

    return {
      ...processed,
      [strategy(key)]: value
    };
  }, {});
};

export const decamelizeKeys = (params, depth = 10) =>
  objectKeyProcessor(decamelize, params, depth);

export const camelizeKeys = (params, depth = 10) =>
  objectKeyProcessor(camelcase, params, depth);

export const isObject = value =>
  typeof value === "object" && value !== null && !Array.isArray(value);
