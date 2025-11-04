/* Test Case : Logout Test 
   Tags: @master @regression */

import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/Homepage';
import { MyAccountPage } from '../pages/myAccountPage';
import { LoginPage } from '../pages/LoginPage';
import { LogoutPage } from '../pages/LogoutPage';
import { TestConfig } from '../test.config';

let config = new TestConfig();
let homePage: HomePage;
let loginPage: LoginPage;
let myAccountPage: MyAccountPage;
let logoutPage: LogoutPage;

// Setup before each test
test.beforeEach(async ({ page }) => {
    // Initialize page objects
    config = new TestConfig();
    homePage = new HomePage(page);
    loginPage = new LoginPage(page);
    myAccountPage = new MyAccountPage(page);
    logoutPage = new LogoutPage(page);
});

test('User Logout Test @master @regression', async ({ page }) => {

    // Navigate to application URL 
    await page.goto(config.appUrl);

    // Perform login steps
    await homePage.clickMyAccount();
    await homePage.clickLogin();
    await loginPage.login(config.email, config.password);
    expect(await myAccountPage.isMyAccountPageExists()).toBeTruthy();

    // Perform logout steps
    await myAccountPage.clickLogout();
    expect(await logoutPage.isContinueButtonVisible()).toBeTruthy();

    // Click Continue to return to Home Page
    await logoutPage.clickContinue();
    expect(await homePage.isHomePageExists()).toBeTruthy();

});
