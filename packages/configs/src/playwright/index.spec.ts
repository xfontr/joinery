import { describe, expect, it } from "vitest";
import { createConfig } from "./index.ts";

const collectedAt = (tag: string) =>
    createConfig({ port: 4000, command: "node server.mjs" })
        .projects!.filter(({ grepInvert }) => !(grepInvert as RegExp).test(tag))
        .map(({ name }) => name);

describe("createConfig", () => {
    it("runs an untagged test at every width", () => {
        expect(collectedAt("renders the home page")).toEqual(["390px", "768px", "1280px"]);
    });

    it("runs a @desktop test only from the desktop width, and a @mobile one only below it", () => {
        expect(collectedAt("opens the menu @desktop")).toEqual(["1280px"]);
        expect(collectedAt("opens the menu @mobile")).toEqual(["390px", "768px"]);
    });

    it("runs an @any-width test once, at the first width, so a header check isn't repeated", () => {
        expect(collectedAt("sends the security headers @any-width")).toEqual(["390px"]);
    });
});
