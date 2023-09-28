import { Page, Browser, BrowserContext } from "playwright";

export function usePlaywrightPage(page: Page): Page {
  return page;
}

export function usePlaywrightBrowser(
  browser: Browser,
  page: Page,
): { browser: Browser; page: Page } {
  return {
    browser,
    page,
  };
}

export function usePlaywrightBrowserContext(
  context: BrowserContext,
  browser: Browser,
  page: Page,
): { context: BrowserContext; browser: Browser; page: Page } {
  return {
    context,
    browser,
    page,
  };
}
