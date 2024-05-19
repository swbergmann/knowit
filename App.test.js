import React from 'react';
import renderer from 'react-test-renderer';

import App from './App';

/**
 * To execute tests run 'npm test' in the terminal.
 */
describe('<App />', () => {
  it('has exactyl 1 child element', () => {
    const tree = renderer
      .create(<App />)
      .toJSON();
    expect(tree.children.length).toBe(1);
  });
});