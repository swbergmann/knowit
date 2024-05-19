import React from 'react';
import renderer from 'react-test-renderer';

import StartScreen from "./StartScreen";
import { validateLogin } from '../utils/validateLogin';

/**
 * To execute unit tests in the terminal run:
 * npm test
 * 
 * In case the UI component changes, update the component snapshot:
 * npm run test -- -u
 */
it('renders StartScreen correctly', () => {
  const tree = renderer
    .create(<StartScreen />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

/**
 * The validateLogin function is tested with unit tests to ensure application users
 * get helpful interactive feedback and can correct their faulty input values easily.
 * 
 * validateLogin is called with several edge-case string values as a parameter and
 * the expected return value of validateLogin is compared with the assumed return value.
 * 
 * It is critical for the user interface, that the user name is not too short and not too long.
 */
it('does not allow empty input for login', () => {
  expect(validateLogin(''))
  .toBe('Name is required.');
});

it('does not allow blank spaces as input for login', () => {
  expect(validateLogin('     '))
  .toBe('Name is required.');
});

it('does not allow 1 letter input for login', () => {
  expect(validateLogin('S'))
  .toBe('Name must be at least 3 characters.');
});

it('does not allow 2 letter input for login', () => {
  expect(validateLogin('Se'))
  .toBe('Name must be at least 3 characters.');
});

it('does not allow several blank spaces in combination with 2 letter input for login', () => {
  expect(validateLogin(' S e '))
  .toBe('Name must be at least 3 characters.');
});

it('allows 3 letter input for login', () => {
  expect(validateLogin('Seb'))
  .toBe('');
});

it('allows 9 letter input for login', () => {
  expect(validateLogin('Sebastian'))
  .toBe('');
});

it('allows 10 letter input for login', () => {
  expect(validateLogin('SebastianS'))
  .toBe('');
});

it('does not allow more than 10 letter input for login', () => {
  expect(validateLogin('SebastianSe'))
  .toBe('Maximum length is 10 characters.');
});

it('does not allow more than 10 letter input for login', () => {
  expect(validateLogin('SebastianSebastianSebastian'))
  .toBe('Maximum length is 10 characters.');
});