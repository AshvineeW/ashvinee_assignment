import { OpeningHours } from "../helper";
import { getCurrentDay } from "../utils/currentDay";

class PhysicianPage {
  //#region Physician Page locators
  public get physicianName() {
    return $("h1");
  }

  public get physicianAddress() {
    return $('[data-web-test="address-link"]');
  }

  public get currentDay() {
    return $(
      "div.text-day__item--container > div.text-day__item--text.current-date"
    );
  }

  private get openingHoursContainer() {
    return $("div.text-day-hours-container__items-wrapper");
  }

  private get firstShiftOpeningHoursElements() {
    return this.openingHoursContainer.$$(
      "div.text-day-hour__item-container.current-date > div:first-of-type"
    );
  }

  private get secondShiftOpeningHoursElements() {
    return this.openingHoursContainer.$$(
      "div.text-day-hour__item-container.current-date > div:nth-of-type(2)"
    );
  }

  //#endregion

  //#region Helper functions

  public async getCurrentDayElementText() {
    return this.currentDay.getText();
  }

  // Add current day start and end time of morning and afternoon shift timings to a collection
  private async addShiftOpeningHoursToCollection(
    collection: OpeningHours[],
    shiftElements: WebdriverIO.ElementArray
  ) {
    for (let i = 0; i < shiftElements.length; i++) {
      const element = shiftElements[i];
      const startTime = await element
        .$("div.text-day-hour__text-startTime")
        .getText();
      const endTime = await element
        .$("div.text-day-hour__text-endTime")
        .getText();
      collection.push({ startTime, endTime });
    }
  }

  public async getCurrentDayOpeningHours() {
    const openingHours: OpeningHours[] = [];
    if (await this.currentDay.isExisting()) {
      const currentDayActualText = await this.currentDay.getText();
      if (currentDayActualText == getCurrentDay()) {
        try {
          // Fetch opening hours for the first shift
          await this.addShiftOpeningHoursToCollection(
            openingHours,
            await this.firstShiftOpeningHoursElements
          );

          // If second shift exists, fetch opening hours for second shift as well
          if ((await this.secondShiftOpeningHoursElements.length) > 0) {
            await this.addShiftOpeningHoursToCollection(
              openingHours,
              await this.secondShiftOpeningHoursElements
            );
          }
        } catch (error) {
          console.error("Error while fetching opening hours:", error);
          throw error;
        }
      } else {
        throw new Error(
          `Error: Current day text (${currentDayActualText}) does not match the expected day (${getCurrentDay()}).`
        );
      }
    }
    return openingHours;
  }

  public async getExpectedOpeningHoursForDay(
    dayElement: string
  ): Promise<OpeningHours[]> {
    if (dayElement === "Mi.") {
      // For Wednesday, only the first half working hours are expected
      return [{ startTime: "09:00 Uhr", endTime: "14:00 Uhr" }];
    } else {
      // For other days, both first and second half working hours are expected
      return [
        { startTime: "09:00 Uhr", endTime: "12:00 Uhr" },
        { startTime: "14:00 Uhr", endTime: "18:00 Uhr" },
      ];
    }
  }
  //#endregion
}

export default new PhysicianPage();
