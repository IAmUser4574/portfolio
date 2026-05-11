import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { CvSkills } from "@/components/cv-skills";

const groups = [
  { label: "Languages", skills: ["TypeScript", "C++"] },
  { label: "Cloud", skills: ["AWS", "Cloudflare"] },
];

describe("CvSkills", () => {
  it("opens Languages by default", () => {
    render(<CvSkills groups={groups} />);

    expect(screen.getByRole("button", { name: /languages/i })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    expect(screen.getByText("TypeScript")).toBeVisible();
    expect(screen.getByText("AWS")).not.toBeVisible();
  });

  it("opens a clicked group and closes the previous group", async () => {
    const user = userEvent.setup();

    render(<CvSkills groups={groups} />);

    await user.click(screen.getByRole("button", { name: /cloud/i }));

    expect(screen.getByRole("button", { name: /languages/i })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    expect(screen.getByRole("button", { name: /cloud/i })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    expect(screen.getByText("TypeScript")).not.toBeVisible();
    expect(screen.getByText("AWS")).toBeVisible();
  });

  it("closes an open group when clicked again", async () => {
    const user = userEvent.setup();

    render(<CvSkills groups={groups} />);

    await user.click(screen.getByRole("button", { name: /languages/i }));

    expect(screen.getByRole("button", { name: /languages/i })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    expect(screen.getByText("TypeScript")).not.toBeVisible();
  });
});
