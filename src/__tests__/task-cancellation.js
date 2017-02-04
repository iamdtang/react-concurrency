import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import AsyncButton from './test-components/AsyncButton';
import { task } from './../index';

describe('A task', () => {
  it(`should automatically cancel when the component it lives on is
      destroyed and an error isn't thrown`, (done) => {
    let resolvePromise;
    let promise = new Promise(function(resolve) {
      // pending
      resolvePromise = resolve;
    });
    function doSomethingAsync() {
      return promise;
    }
    const wrapper = mount(
      <AsyncButton
        default="Save"
        pending="Saving ..."
        success="Saved"
        error="Try Again"
        onClick={doSomethingAsync} />
    );

    let asyncButton = wrapper.instance();
    sinon.spy(asyncButton, 'setState');

    wrapper.find('button').simulate('click');
    wrapper.unmount();
    resolvePromise();

    setTimeout(function() {
      expect(asyncButton.setState.callCount).to.equal(1);
      done();
    }, 0);
  });

  it(`should automatically cancel when the component it lives on is
      destroyed and an error is thrown`, (done) => {
    let rejectPromise;
    let promise = new Promise(function(resolve, reject) {
      // pending
      rejectPromise = reject;
    });
    function doSomethingAsync() {
      return promise;
    }
    const wrapper = mount(
      <AsyncButton
        default="Save"
        pending="Saving ..."
        success="Saved"
        error="Try Again"
        onClick={doSomethingAsync} />
    );

    let asyncButton = wrapper.instance();
    sinon.spy(asyncButton, 'setState');

    wrapper.find('button').simulate('click');
    wrapper.unmount();
    rejectPromise();

    setTimeout(function() {
      expect(asyncButton.setState.callCount).to.equal(1);
      done();
    }, 0);
  });
});
