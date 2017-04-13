[![Build Status](https://travis-ci.org/skaterdav85/react-concurrency.svg?branch=master)](https://travis-ci.org/skaterdav85/react-concurrency)

React Concurrency
=================

An implementation of [ember-concurrency](http://ember-concurrency.com/) for React components. This is still a work in progress.

## Current Implemented Features

* Tasks get automatically canceled when the component they live on is destroyed
* Derived state with `isRunning` and `isIdle` flags
* promise based `timeout`

## Installation

```
npm install react-concurrency
```

## Why?

Have you ever seen the error?

> Warning: setState(...): Can only update a mounted or mounting component. This usually means you called setState() on an unmounted component. This is a no-op. Please check the code for the YourComponent component.

There are a few ways to deal with this in React. Read about them [here](https://facebook.github.io/react/blog/2015/12/16/ismounted-antipattern.html).

In Ember, this is solved with a brilliant addon called [ember-concurrency](http://ember-concurrency.com/). This library attempts to do the same but for React components while keeping a similar API. If you haven't read about ember-concurrency, check out this great article: [ember-concurrency: the solution to so many problems you never knew you had](https://emberway.io/ember-concurrency-the-solution-to-so-many-problems-you-never-knew-you-had-cce6d7731ba9#.e6r0iv44u)


[Example 1](examples/example-1.md)
[Example 2](examples/example-2.md)

## About This Repo

This repo was created with [react-npm-boilerplate](https://github.com/juliancwirko/react-npm-boilerplate).

1. Clone this repo
2. Inside cloned repo run `npm install`
3. If you want to run tests: `npm test` or `npm run testonly` or `npm run test-watch`. You need to write tests in `__tests__` folder. You need at least Node 4 on your machine to run tests.
4. If you want to run linting: `npm test` or `npm run lint`. Fix bugs: `npm run lint-fix`. You can adjust your `.eslintrc` config file.
5. If you want to run transpilation to ES5 in `dist` folder: `npm run prepublish` (standard npm hook).
