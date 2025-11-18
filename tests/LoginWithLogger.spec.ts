import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { MyAccountPage } from "../pages/MyAccountPage";
import { HomePage } from "../pages/HomePage";
import { TestConfig } from "../test.config";
import { Logger } from "../pages/Logger";

let config: TestConfig;
let homePage: HomePage;
let loginPage: LoginPage;
let myAccountPage: MyAccountPage;

test.beforeEach(async ({ page }) => {
  // Navigate to Application URL
  const config = new TestConfig();
  await page.goto(config.appUrl);

  // Initialize Page Objects
  homePage = new HomePage(page);
  loginPage = new LoginPage(page);
  myAccountPage = new MyAccountPage(page);
});

test("Test Login with Valid Credentials @master @sanity @regression", async ({}) => {
  // Navigate to Login Page
  config = new TestConfig();

    Logger.log("Open the URL:", {url: config.appUrl});
    await homePage.clickMyAccount();

    await test.step("Click on Login Button", async () => {
      await homePage.clickLogin();
    });

    await loginPage.login(config.email, config.password);

    await test.step("Verify My Account Page is exist", async () => {
      const isLoggedIn = await myAccountPage.isMyAccountPageExists();
      expect(isLoggedIn).toBeTruthy();
    });
  });
