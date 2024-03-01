import Page from "./page";

class HomePage extends Page {
  //#region HomePage locators
  public get cookiesAcceptButton() {
    return $("button.consent-button.agree-consent--all");
  }

  private get searchTermInput() {
    return $(
      '[placeholder="Fachbereich, Name des Arztes, Praxis oder Einrichtung"]'
    );
  }

  private getSuggestionListOption(city: string) {
    return $(`//span[text()=' ${city} ']`);
  }
  //#endregion

  //#region Helper functions

  public async handleCookieDialog(accept: boolean = true) {
    await this.cookiesAcceptButton.waitForEnabled();

    if (accept) {
      await this.cookiesAcceptButton.click();
    } else {
      // Assume there is a reject button (replace with the actual selector)
      const rejectButton = $("button.reject-button");
      await rejectButton.waitForEnabled();
      await rejectButton.click();
    }
  }

  public async searchForPhysician(physicianName: string, city: string) {
    await this.searchTermInput.setValue(physicianName);
    const suggestionListFirstOption = this.getSuggestionListOption(city);
    await suggestionListFirstOption.waitForClickable();
    await suggestionListFirstOption.click();
  }
  //#endregion
}

export default new HomePage();
