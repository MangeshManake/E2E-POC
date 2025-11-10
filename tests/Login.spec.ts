import {test, expect} from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { MyAccountPage } from '../pages/MyAccountPage';
import { HomePage } from '../pages/HomePage';
import { TestConfig } from '../test.config';

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

test('Test Login with Valid Credentials @master @sanity @regression', async ({ }) => {
    // Navigate to Login Page
    config = new TestConfig();
    await homePage.clickMyAccount();
    await homePage.clickLogin();

    // Perform Login //
    await loginPage.login(config.email, config.password);

    const isLoggedIn = await myAccountPage.isMyAccountPageExists();
    expect(isLoggedIn).toBeTruthy();

});