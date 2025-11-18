import { test, expect } from "@playwright/test";
import { PageFactory } from "../pages/PageFactory";
import { Logger } from "../pages/Logger";

test.beforeEach(async ({ page }) => {
  // Navigate to Application URL
  const config = PageFactory.getConfig();
  await page.goto(config.appUrl);
});

test("Test Login with Valid Credentials @master @sanity @regression", async ({page}) => {
  // Navigate to Login Page
  const config = PageFactory.getConfig();
  Logger.log("Open the URL:", { url: config.appUrl });

  await test.step("Open the URL and Click on My Account link", async () => {
    await PageFactory.getHomePage(page).clickMyAccount();
  });

  await test.step("Click on Login Button", async () => {
    await PageFactory.getHomePage(page).clickLogin();
  });

  await PageFactory.getLoginPage(page).login(config.email, config.password);

  await test.step("Verify My Account Page is exist", async () => {
    const isLoggedIn = await PageFactory.getMyAccountPage(
      page
    ).isMyAccountPageExists();
    expect(isLoggedIn).toBeTruthy();
  });
});
