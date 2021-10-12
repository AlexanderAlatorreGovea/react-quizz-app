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

  it("expects 'Next Question Button' to appear on the page after user clicks on an option'", async () => {
    user.click(screen.getByText(/start/i));

    await waitForElementToBeRemoved(() => screen.getByText(/loading/i));

    const option = await screen.findByText(/Pac-Man/i);

    user.click(option);

    expect(screen.getByText(/Next Question/i)).toBeInTheDocument();
  });

  it("expects 'Options' to be disabled after an option is clicked", async () => {
    user.click(screen.getByText(/start/i));

    await waitForElementToBeRemoved(() => screen.getByText(/loading/i));

    const option = await screen.findByText(/Pac-Man/i);

    user.click(option);

    const disabledBtn = await screen.findByRole("button", {
      name: /pac\-man/i,
    });

    expect(disabledBtn).toHaveProperty("disabled", true);
  });

  it("expets 'score' to be 1 and Question to be '1/10'", async () => {
    user.click(screen.getByText(/start/i));

    await waitForElementToBeRemoved(() => screen.getByText(/loading/i));

    const correctAnswer = await screen.findByText(/Pac-Man/i);

    user.click(correctAnswer);

    const score = await screen.findByText("Score: 1");

    expect(score).toBeInTheDocument();
  });
});
