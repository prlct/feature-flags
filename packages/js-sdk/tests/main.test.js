const { create } = require('../src').default;

describe('SDK instance creation', () => {
  test('SDK instance not created if no `publicApiKey` provided', () => {
    expect(() => create({ publicApiKey: '', env: 'development' }))
      .toThrowError()
  });

  test('SDK api url sets to production if isDevelopmentApi is not provided', () => {
    const instance = create({ publicApiKey: 'someKey', env: 'production' });

    expect(instance.apiClient._api.defaults.baseURL).toBe('https://api.growthflags.com')
  })
});
