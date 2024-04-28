import _ from 'lodash';

// eslint-disable-next-line import/prefer-default-export
export const formatResponse = (object: any) => {
  if (object === null || typeof object !== 'object') {
    return object;
  }

  const result: any = {};

  Object.keys(object).forEach(key => {
    if (object[key]) {
      const snakeCaseKey = _.snakeCase(key);
      result[snakeCaseKey] = formatResponse(object[key]);
    }
  });

  return result;
};
