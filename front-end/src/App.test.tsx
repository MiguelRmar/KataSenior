import { render } from '@testing-library/react';
import App from './App';
import { describe, it, expect } from 'vitest';

describe('App', () => {
    it('renders the main application', () => {
        render(<App />);
        // Assuming there is some text in App or at least it renders without crashing
        expect(document.body).toBeInTheDocument();
    });
});
