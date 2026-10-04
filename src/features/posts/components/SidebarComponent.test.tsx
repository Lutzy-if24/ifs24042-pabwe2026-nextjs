import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { render } from "@testing-library/react";
import SidebarComponent from "./SidebarComponent";

let pathnameValue = "/";
let searchParamsValue = new URLSearchParams();

vi.mock("next/navigation", () => ({
  usePathname: () => pathnameValue,
  useSearchParams: () => searchParamsValue,
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
  beforeEach(() => {
    pathnameValue = "/";
    searchParamsValue = new URLSearchParams();
  });

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

  it("highlights only Semua Postingan on the home page", () => {
    render(<SidebarComponent />);
    expect(screen.getByTestId("sidebar-link-Semua Postingan")).toHaveClass(
      "bg-teal-50"
    );
    expect(
      screen.getByTestId("sidebar-link-Postingan Saya")
    ).not.toHaveClass("bg-teal-50");
    expect(screen.getByTestId("sidebar-link-Semua Postingan")).toHaveAttribute(
      "aria-current",
      "page"
    );
  });

  it("highlights only Postingan Saya when is_me=1", () => {
    searchParamsValue = new URLSearchParams("is_me=1");
    render(<SidebarComponent />);
    expect(screen.getByTestId("sidebar-link-Postingan Saya")).toHaveClass(
      "bg-teal-50"
    );
    expect(
      screen.getByTestId("sidebar-link-Semua Postingan")
    ).not.toHaveClass("bg-teal-50");
  });

  it("highlights Daftar Pengguna on the users page", () => {
    pathnameValue = "/users";
    render(<SidebarComponent />);
    expect(screen.getByTestId("sidebar-link-Daftar Pengguna")).toHaveClass(
      "bg-teal-50"
    );
    expect(
      screen.getByTestId("sidebar-link-Semua Postingan")
    ).not.toHaveClass("bg-teal-50");
    expect(
      screen.getByTestId("sidebar-link-Postingan Saya")
    ).not.toHaveClass("bg-teal-50");
  });

  it("highlights Profil Saya on the profile page", () => {
    pathnameValue = "/profile";
    render(<SidebarComponent />);
    expect(screen.getByTestId("sidebar-link-Profil Saya")).toHaveClass(
      "bg-teal-50"
    );
  });
});