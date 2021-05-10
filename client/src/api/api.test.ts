import { api, baseOptions, IMethod } from '.';

function testCommonFunctionality(method: IMethod): void {
  describe(`${method.toUpperCase()} method common functionality`, () => {
    let fetchSpy: jest.SpyInstance;
    // Only GET methods should not include body in the Response options
    const bodyParam = method === 'get' ? {} : { body: '{}' };

    beforeEach(() => {
      fetchMock.resetMocks();
      fetchSpy = jest.spyOn(window, 'fetch');
    });

    it('uses base options', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({}));
      await api[method]('/buildings');
      expect(fetchSpy).toBeCalledWith('/buildings', {
        ...baseOptions,
        ...bodyParam,
        headers: new Headers([['Content-Type', 'application/json']]),
        method: method.toUpperCase(),
      });
    });

    it('extends base options', async () => {
      const extendedOptions: Partial<Request> = {
        mode: 'navigate',
        cache: 'force-cache',
        credentials: 'omit',
        headers: new Headers([['Content-Type', 'multipart/form-data']]),
      };
      fetchMock.mockResponseOnce(JSON.stringify({}));
      await api[method]('/buildings', undefined, extendedOptions);
      expect(fetchSpy).toBeCalledWith('/buildings', {
        ...baseOptions,
        ...bodyParam,
        ...extendedOptions,
        method: method.toUpperCase(),
      });
    });

    it('converts JSON response keys from snake to camel case', async () => {
      const responseStub = {
        snake_case: 12345,
      };
      fetchMock.mockResponseOnce(JSON.stringify(responseStub));
      const response = await api[method]('/buildings');

      // Response JSON properties should be converted from snake to camel case
      expect(response).toEqual({ snakeCase: 12345 });
      expect(fetchMock.mock.calls.length).toEqual(1);
      expect(fetchMock.mock.calls[0][0]).toEqual('/buildings');
    });
  });
}

describe('api', () => {
  ['get', 'post', 'put', 'patch', 'delete'].forEach(method =>
    testCommonFunctionality(method as IMethod),
  );

  describe('GET method functionality', () => {
    beforeEach(fetchMock.resetMocks);

    it('converts data to encoded uri query parameters', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({}));
      await api.get('/buildings', { param1: '${#@}^abc' });

      expect(fetchMock.mock.calls.length).toEqual(1);
      expect(fetchMock.mock.calls[0][0]).toEqual(
        '/buildings?param1=%24%7B%23%40%7D%5Eabc',
      );
    });

    it('converts query key params from camel to snake case', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({}));
      await api.get('/buildings', { snakeParam1: 1, snakeParam2: 2 });

      expect(fetchMock.mock.calls.length).toEqual(1);
      expect(fetchMock.mock.calls[0][0]).toEqual(
        '/buildings?snake_param1=1&snake_param2=2',
      );
    });

    it('strips undefined, null, and empty string query params', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({}));
      await api.get('/buildings', {
        undefinedParam: undefined,
        nullParam: null,
        emptyStringParam: '',
      });

      expect(fetchMock.mock.calls.length).toEqual(1);
      expect(fetchMock.mock.calls[0][0]).toEqual('/buildings');
    });
  });
});
