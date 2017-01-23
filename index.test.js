import IFrameCommunicator from './';

describe('IFrameCommunicator', () => {
  describe('constructor()', () => {
    it('it stores the given properties', () => {
      const com = new IFrameCommunicator('jon', ['d', 'o', 'e']);
      expect(com.id).toBe('jon');
      expect(com.remainingDeps).toEqual(['d', 'o', 'e']);
    });
  });

  describe('event-management', () => {
    it('stores the listener', () => {
      function onReady() {}

      const com = new IFrameCommunicator('jon', ['doe']);
      com.on('ready', onReady);

      expect(com.listeners.ready).toBeDefined();
      expect(com.listeners.ready[0]).toBe(onReady);
    });

    it('calls the registrated listener', () => {
      const onReady = jest.fn();
      const com = new IFrameCommunicator('jon', ['doe']);

      com.on('ready', onReady);
      com.fire('ready');

      expect(onReady).toHaveBeenCalled();
    });
  });
});
