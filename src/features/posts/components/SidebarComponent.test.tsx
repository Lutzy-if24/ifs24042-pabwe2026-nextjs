import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { render } from "@testing-library/react";
import SidebarComponent from "./SidebarComponent";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe("SidebarComponent", () => {
  it("renders menu items", () => {
    render(<SidebarComponent open />);
    expect(screen.getByTestId("sidebar")).toBeInTheDocument();
    expect(screen.getByText("Semua Postingan")).toBeInTheDocument();
    expect(screen.getByText("Postingan Saya")).toBeInTheDocument();
    expect(screen.getByText("Daftar Pengguna")).toBeInTheDocument();
    expect(screen.getByText("Profil Saya")).toBeInTheDocument();
  });

  it("calls onClose when overlay clicked", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<SidebarComponent open onClose={onClose} />);
    await user.click(screen.getByTestId("sidebar-overlay"));
    expect(onClose).toHaveBeenCalled();
  });
});
