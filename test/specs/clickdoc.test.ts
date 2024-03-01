import * as assert from "assert";
import homePage from "../pageobjects/home.page";
import physicianPage from "../pageobjects/physician.page";
import { OpeningHours } from "../helper";
import { getCurrentDay } from "../utils/currentDay";
import page from "../pageobjects/page";
import { addStep } from "@wdio/allure-reporter";

describe("ClickDoc - Physician information and opening hours", () => {
  before(() => {
    //Navigate to the ClickDoc site
    page.open("https://demo.clickdoc.de/cd-de/");
    homePage.cookiesAcceptButton.waitForEnabled();
  });

  it("Accept cookies", async () => {
    await homePage.handleCookieDialog(true);
  });

  it("Search for Dr. Peter Test and verify “Dr. Peter Test” physician view is displayed", async () => {
    await homePage.searchForPhysician("Peter Test", "Neuwied");
    await expect(physicianPage.physicianName).toBeDisplayed();
  });

  it("Validate physician name and address", async () => {
    await expect(physicianPage.physicianName).toHaveText("Dr. Peter Test");
    await expect(physicianPage.physicianAddress).toHaveText(
      "Blücherstraße 10\n56564 Neuwied"
    );
  });

  it("Validate current day start and end time of morning and afternoon shift", async () => {
    // Get current day
    const currentDayElement = await physicianPage.getCurrentDayElementText();
    // Get current day opening hours
    const actualOpeningHours = await physicianPage.getCurrentDayOpeningHours();

    // Get current day expected opening hours
    let expectedOpeningHours: OpeningHours[] = [];
    expectedOpeningHours =
      await physicianPage.getExpectedOpeningHoursForDay(currentDayElement);
    if (actualOpeningHours.length !== 0) {
      assert.deepStrictEqual(
        actualOpeningHours,
        expectedOpeningHours,
        `Opening hours for ${getCurrentDay()} do not match the expected values`
      );
    } else {
      addStep(
        `We are closed on weekend! Please check opening hours to book an appointment.`
      );
    }
  });

  it("Validate the current day is shown in bold", async () => {
    const fontWeight =
      await physicianPage.currentDay.getCSSProperty("font-weight");

    assert.strictEqual(fontWeight.value, 900, "Text is not displayed as bold");
  });

  after(() => {
    browser.closeWindow();
  });
});
