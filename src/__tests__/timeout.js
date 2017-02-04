import { expect } from 'chai';
import sinon from 'sinon';
import { timeout } from './../index';

describe('timeout', () => {
  let clock;
  beforeEach(() => {
    clock = sinon.useFakeTimers();
  });

  afterEach(() => {
    clock.restore();
  });

  it('should return a promise', (done) => {
    timeout(2000).then(done);
    clock.tick(2000);
  });
});
