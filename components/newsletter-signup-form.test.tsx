import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { NewsletterSignupForm } from "@/components/newsletter-signup-form";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("NewsletterSignupForm", () => {
  it("renders the compact variant without the card heading", () => {
    render(<NewsletterSignupForm variant="compact" />);
    expect(screen.queryByText("Get notified of new posts")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /subscribe/i })).toBeInTheDocument();
  });

  it("renders the prominent variant with a heading", () => {
    render(<NewsletterSignupForm variant="prominent" />);
    expect(screen.getByText("Get notified of new posts")).toBeInTheDocument();
  });

  it("submits the typed email and shows a success message", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();

    render(<NewsletterSignupForm variant="compact" />);

    await user.type(screen.getByLabelText(/email address/i), "foo@example.com");
    await user.click(screen.getByRole("button", { name: /subscribe/i }));

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/newsletter/subscribe",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ email: "foo@example.com" }),
      })
    );
    expect(await screen.findByText(/subscribed/i)).toBeInTheDocument();
  });

  it("shows an error message when the request fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 500 }));
    const user = userEvent.setup();

    render(<NewsletterSignupForm variant="compact" />);

    await user.type(screen.getByLabelText(/email address/i), "foo@example.com");
    await user.click(screen.getByRole("button", { name: /subscribe/i }));

    expect(await screen.findByText(/something went wrong/i)).toBeInTheDocument();
  });
});
