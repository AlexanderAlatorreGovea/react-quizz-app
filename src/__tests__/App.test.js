import App from "../App";
import {
  render,
  screen,
  fireEvent,
  act,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { mockedData } from "../__mocks__/trivia-mock";
import user from "@testing-library/user-event";

describe("<App/>", () => {
  beforeEach(() => {
    window.fetch = jest.fn();
    window.fetch.mockResolvedValueOnce({
      json: async () =>
        Promise.resolve({
          results: mockedData,
        }),
    });
    render(<App />);
  });
  it("Renders the start Button on Page load", async () => {
    expect(await screen.getByText(/start/i)).toBeInTheDocument();
  });
  it("expects loading to be in the document after click is fired", async () => {
    user.click(screen.getByText(/start/i));
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
  it("expects 'Pac-Man' to be in the document after click is fired", async () => {
    user.click(screen.getByText(/start/i));
  
    await waitForElementToBeRemoved(() => screen.getByText(/loading/i));
  
    const response = await screen.findByText(/Pac-Man/i);
  
    expect(response).toBeInTheDocument();
  });
});
