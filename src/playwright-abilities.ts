import { Browser, BrowserContext, Page } from "playwright";
import { Ability } from "./screenplay-pattern";

export class UsePlaywrightPage extends Ability<Page> {
  constructor(private page: Page) {
    super();
  }
  can(): Page {
    return this.page;
  }
}

export class UsePlaywrightBrowser extends Ability<{
  browser: Browser;
  page: Page;
}> {
  constructor(
    private browser: Browser,
    private page: Page,
  ) {
    super();
  }
  can(): {
    browser: Browser;
    page: Page;
  } {
    return {
      browser: this.browser,
      page: this.page,
    };
  }
}

export class UsePlaywrightBrowserContext extends Ability<{
  context: BrowserContext;
  browser: Browser;
  page: Page;
}> {
  constructor(
    private context: BrowserContext,
    private browser: Browser,
    private page: Page,
  ) {
    super();
  }
  can(): {
    browser: Browser;
    page: Page;
    context: BrowserContext;
  } {
    return {
      context: this.context,
      browser: this.browser,
      page: this.page,
    };
  }
}
