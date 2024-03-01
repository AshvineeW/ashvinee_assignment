import { browser } from "@wdio/globals";

export default class Page {
  // Open url
  static open(path: string) {
    return browser.url(path);
  }
}
