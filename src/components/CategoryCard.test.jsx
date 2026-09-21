import { cleanup, render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { afterEach, describe, it, expect, vi } from "vitest";
import CategoryCard from "./CategoryCard";

//tests for CategoryCard component
afterEach(cleanup);

describe("CategoryCard", () => {
  it("renders the category name and icon", () => {
    render(
      <CategoryCard
        name="Food"
        icon="🍎"
      />
    );

    expect(screen.getByText("Food")).toBeInTheDocument();
    expect(screen.getByText("🍎")).toBeInTheDocument();
  });

  it("calls onSelect with the category name when clicked", () => {
    const onSelect = vi.fn();

    render(
      <CategoryCard
        name="Food"
        icon="🍎"
        onSelect={onSelect}
      />
    );

    fireEvent.click(screen.getByRole("button"));

    expect(onSelect).toHaveBeenCalledWith("Food");
  });

  it("does not fail when onSelect is not provided", () => {
    render(
      <CategoryCard
        name="Food"
        icon="🍎"
      />
    );

    expect(() => {
      fireEvent.click(screen.getByRole("button"));
    }).not.toThrow();
  });

  it("applies selected styling when selected is true", () => {
    render(
      <CategoryCard
        name="Food"
        icon="🍎"
        selected={true}
      />
    );

    const button = screen.getByRole("button");

    expect(button).toHaveClass("border-green-500");
    expect(button).toHaveClass("shadow-lg");
  });

  it("applies default styling when selected is false", () => {
    render(
      <CategoryCard
        name="Food"
        icon="🍎"
        selected={false}
      />
    );

    const button = screen.getByRole("button");

    expect(button).toHaveClass("border-transparent");
    expect(button).toHaveClass("bg-gray-100");
  });
});