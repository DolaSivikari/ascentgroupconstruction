import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";
import { PageHeroImage } from "./PageHeroImage";
import { cityPhotography, portfolioPhotography } from "@/data/hero-photography";
import { generatedHeroScenes } from "@/data/hero-scenes";

afterEach(cleanup);
const show = (props: Parameters<typeof PageHeroImage>[0]) =>
  render(
    <MemoryRouter>
      <PageHeroImage {...props} />
    </MemoryRouter>,
  );
describe("hero image loading and crop", () => {
  it("loads eagerly and applies the focal point to the actual image, with city attribution after load", () => {
    const photo = cityPhotography.toronto;
    show({ src: photo.image, alt: "Old generic city description" });
    const image = screen.getByRole("img", { name: photo.alt });
    expect(image).toHaveAttribute("loading", "eager");
    expect(image).toHaveAttribute("fetchpriority", "high");
    expect(image).toHaveStyle({ "--hero-image-position": photo.position });
    expect(screen.queryByText("Photo credit")).not.toBeInTheDocument();
    fireEvent.load(image);
    expect(screen.getByText("Photo credit")).toBeInTheDocument();
    expect(screen.getByText(`Photo: ${photo.author}`)).toBeInTheDocument();
    expect(screen.getByText(photo.license!)).toHaveAttribute(
      "href",
      photo.licenseUrl,
    );
    expect(
      screen.getByText("Original photograph & attribution"),
    ).toHaveAttribute("href", photo.source);
  });
  it("retains the saved image until it fails, then uses the bundled fallback with accurate credit", () => {
    const photo = portfolioPhotography["interior-finishes"];
    show({
      src: "https://storage.example/missing.jpg",
      fallbackSrc: photo.image,
      alt: "Saved image",
    });
    const original = screen.getByRole("img", { name: "Saved image" });
    expect(original).toHaveAttribute(
      "src",
      "https://storage.example/missing.jpg",
    );
    fireEvent.error(original);
    const fallback = screen.getByRole("img", { name: photo.alt });
    expect(fallback).toHaveAttribute("src", photo.image);
    fireEvent.load(fallback);
    expect(
      screen.getByRole("link", {
        name: `Project reference: ${photo.projectTitle}`,
      }),
    ).toHaveAttribute("href", photo.projectPath);
    expect(screen.queryByText("Photo credit")).not.toBeInTheDocument();
  });
  it("stops retries and hides broken image/credits when the fallback also fails", () => {
    const { container } = show({
      src: "/missing.jpg",
      fallbackSrc: "/also-missing.jpg",
      alt: "Photo",
    });
    fireEvent.error(screen.getByRole("img"));
    expect(screen.getByRole("img")).toHaveAttribute("src", "/also-missing.jpg");
    fireEvent.error(screen.getByRole("img"));
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(container.querySelector("[data-hero-image-state]")).toHaveAttribute(
      "data-hero-image-state",
      "unavailable",
    );
  });
  it("honours an explicit crop on desktop and mobile", () => {
    show({ src: cityPhotography.markham.image, alt: "City", position: "top" });
    expect(screen.getByRole("img")).toHaveStyle({
      "--hero-image-position": "top",
      "--hero-image-position-mobile": "top",
    });
  });

  it("labels generated scenes as illustrations without inventing a project reference or credentials", () => {
    const photo = generatedHeroScenes["certifications-insurance"];
    show({ src: photo.image, alt: "Actual company certificates" });
    const image = screen.getByRole("img", { name: photo.alt });
    fireEvent.load(image);
    expect(
      screen.getByText("Illustrative construction scene"),
    ).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(screen.queryByText("Photo credit")).not.toBeInTheDocument();
  });
});
