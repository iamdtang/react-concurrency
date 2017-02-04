import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import AsyncButton from './test-components/AsyncButton';
import { task } from './../index';

describe('isRunning', () => {
  it('should be false when the task has not been started', () => {
    let doSomethingAsync = sinon.stub();
    const wrapper = mount(
      <AsyncButton
        default="Save"
        pending="Saving ..."
        success="Saved"
        error="Try Again"
        onClick={doSomethingAsync} />
    );
    let asyncButton = wrapper.instance();
    expect(asyncButton.handleClick.isRunning).to.be.false;
  });

  it('should be true when the task is running', () => {
    let doSomethingAsync = function() {
      return new Promise(function() {
        // unresolved
      });
    };
    const wrapper = mount(
      <AsyncButton
        default="Save"
        pending="Saving ..."
        success="Saved"
        error="Try Again"
        onClick={doSomethingAsync} />
    );
    wrapper.find('button').simulate('click');
    let asyncButton = wrapper.instance();
    expect(asyncButton.handleClick.isRunning).to.be.true;
  });

  it('should be false when the task has completed running', function(done) {
    function doSomethingAsync() {
      return Promise.resolve();
    }

    const wrapper = mount(
      <AsyncButton
        default="Save"
        pending="Saving ..."
        success="Saved"
        error="Try Again"
        onClick={doSomethingAsync} />
    );
    wrapper.find('button').simulate('click');
    let asyncButton = wrapper.instance();

    setTimeout(function() {
      expect(asyncButton.handleClick.isRunning).to.be.false;
      done();
    }, 0);
  });
});
