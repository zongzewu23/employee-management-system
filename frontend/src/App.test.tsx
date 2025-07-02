// App.test.tsx
import React from 'react';
import { render } from '@testing-library/react';

const SimpleComponent: React.FC = () => {
  return (
      <div className="test-component">
        <h1>Test Component</h1>
        <p>This is a simple test</p>
      </div>
  );
};

describe('Simple Component Tests', () => {
  test('renders simple component', () => {
    const { container } = render(<SimpleComponent />);
    expect(container).toBeInTheDocument();
  });

  test('contains expected text', () => {
    const { getByText } = render(<SimpleComponent />);
    expect(getByText('Test Component')).toBeInTheDocument();
    expect(getByText('This is a simple test')).toBeInTheDocument();
  });

  test('has correct class name', () => {
    const { container } = render(<SimpleComponent />);
    const component = container.querySelector('.test-component');
    expect(component).toBeInTheDocument();
  });
});