import Page from "./page";

class HomePage extends Page {
  //#region Home Page locators
  public get cookiesAcceptButton() {
    return $("button.consent-button.agree-consent--all");
  }

  public get cookiesOnlyNecessaryButton() {
    return $("button.consent-button agree-necessary-cookie");
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
      await this.cookiesOnlyNecessaryButton.click();
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
