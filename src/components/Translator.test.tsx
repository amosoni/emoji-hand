import { render, screen } from '@testing-library/react';
import Translator from './Translator';
import '../i18n';

jest.mock('~/utils/api', () => ({
  api: {
    emoji: {
      translate: {
        useMutation: () => ({ mutate: jest.fn() })
      }
    }
  }
}));

describe('Translator', () => {
  it('renders input and send button', () => {
    render(<Translator />);
    expect(screen.getByPlaceholderText(/type your message/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
  });
}); 