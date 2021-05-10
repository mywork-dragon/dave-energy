import camelcaseKeys from 'camelcase-keys';
import { snakeCase } from 'snake-case';


// TODO: Revisit these options as the server API matures
export const baseOptions: Partial<Request> = {
  mode: 'cors',
  cache: 'no-cache',
  credentials: 'same-origin',
  redirect: 'follow',
  referrerPolicy: 'no-referrer',
};

export type IMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

type IMethodFunction = <T>(
  url: string,
  data?: Record<string, any>,
  options?: Partial<Request>,
) => Promise<T | null>;
interface ErrorData {
  error?: string;
  id?: number;
}
class API {
  public get: IMethodFunction;
  public post: IMethodFunction;
  public put: IMethodFunction;
  public patch: IMethodFunction;
  public delete: IMethodFunction;

  constructor() {
    this.get = this.createHttpMethod('get');
    this.post = this.createHttpMethod('post');
    this.put = this.createHttpMethod('put');
    this.patch = this.createHttpMethod('patch');
    this.delete = this.createHttpMethod('delete');
  }

  private generateQueryParametersSlug = (data: Record<string, any>): string => {
    // If the data has at least one key with a truthy value, spread like so
    // ?key1=param1&key2=param2
    const queryParams: string = Object.keys(data)
      .reduce((queryStringArray, key) => {
        const value = data[key];
        // Keys with an empty string, undefined, or null
        // are stripped. 0, false, and NaN are still valid
        if (value === null || value === undefined || value === '') {
          return queryStringArray;
        }
        // Client JSON property keys are always camel case and should be
        // converted to snake case for Python consumption. Encode values
        queryStringArray.push(
          `${snakeCase(key)}=${encodeURIComponent(data[key])}`,
        );
        return queryStringArray;
      }, [] as string[])
      .join('&');

    return queryParams.length > 0 ? '?' + queryParams : '';
  };

  private createHttpMethod = (method: IMethod) => {
    // Return a wrapped fetch method that extends common Request options and
    // resolves to the generic type provided. Otherwise throw an error
    return async <T extends unknown>(
      url: string,
      data: Record<string, any> = {},
      options: Partial<Request> = {},
    ): Promise<T | null> => {
      // Attach data according to method
      if (method === 'get') {
        url = `${url}${this.generateQueryParametersSlug(data)}`;
      } else {
        options = Object.assign(options, {
          method: method.toUpperCase(),
          body: JSON.stringify(data),
        });
      }

      // Objects are merged in order that they appear as params. This makes it
      // easier to understand the overwriting order of keys. Don't put
      // baseOptions as the first param or else it will be overwritten for
      // subsequent uses
      options = Object.assign(
        {},
        baseOptions,
        {
          headers: new Headers([['Content-Type', 'application/json']]),
          method: method.toUpperCase(),
        },
        options,
      );
      let err: ErrorData;
      try {
        const response = await fetch(url, options);
        const { ok, status } = response;
        if (!ok || status < 200 || status > 299) {
          err = await response.json();
          throw err;
        } else if (status === 204) {
          // 204 doesn't have a response body. Return gracefully without
          // attempting to JSONify response because that will throw an error
          return null;
        }

        const json = await response.json();

        // The server will return a 200 with { errMsg: string } if it cannot
        // find a specific resource. We should throw an error so that the proper
        // Redux action can be dispatched and not process successfully.
        if (typeof json?.errMsg === 'string') {
          throw json;
        }

        if (response.headers.get('x-no-convert') === 'true') {
          return json;
        }

        return camelcaseKeys(json, { deep: true });
      } catch (e) {
        throw e;
      }
    };
  };
}

export const api = new API();
