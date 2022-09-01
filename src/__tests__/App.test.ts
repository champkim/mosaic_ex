import { render, cleanup } from "@testing-library/svelte";
import AppSvelte from "../../src/App.svelte";

beforeEach(cleanup); // Required!

describe("App", () => {
  test("정상적으로 동작해야 합니다", () => {
    const { container } = render(AppSvelte);

    expect(container.nodeName).toBe("BODY");
  });
});
