import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/Homepage';
import { MyAccountPage } from '../pages/myAccountPage';
import { LoginPage } from '../pages/LoginPage';
import { DataProvider } from '../utils/DataProvider';
import { TestConfig } from '../test.config';

// Load JSON test data from "logindata.json"
const jsonPath = "testdata/logindata.json";
const jsonTestData = DataProvider.getTestDataFromJson(jsonPath);

for (const data of jsonTestData) {
    test(`Login Test with JSON data: ${data.email} - ${data.password} @datadriven`, async ({ page }) => {
        const config = new TestConfig();
        const homePage = new HomePage(page);
        const loginPage = new LoginPage(page);
        const myAccountPage = new MyAccountPage(page);

        await page.goto(config.appUrl);
        await homePage.clickMyAccount();
        await homePage.clickLogin();
        await loginPage.login(data.email, data.password);

        if (data.expected.toLowerCase() === "success") {
            // Verify successful login by checking My Account page exists
            expect(await myAccountPage.isMyAccountPageExists()).toBeTruthy();
        }
        else if (data.expected.toLowerCase() === "failure") {
            // Verify error message is displayed for failed login
            const errorMessage = await loginPage.getLoginErrorMessage();
            expect(errorMessage).toBe(" Warning: No match for E-Mail Address and/or Password.");
        }
    });
}


// Load CSV test data from "logindata.json"
const csvPath = "testdata/logindata.json";
const csvTestData = DataProvider.getTestDataFromJson(csvPath);

for (const data of csvTestData) {
    test(`Login Test with CSV data: ${data.email} - ${data.password} @datadriven`, async ({ page }) => {
        const config = new TestConfig();
        const homePage = new HomePage(page);
        const loginPage = new LoginPage(page);
        const myAccountPage = new MyAccountPage(page);

        await page.goto(config.appUrl);
        await homePage.clickMyAccount();
        await homePage.clickLogin();
        await loginPage.login(data.email, data.password);

        if (data.expected.toLowerCase() === "success") {
            // Verify successful login by checking My Account page exists
            expect(await myAccountPage.isMyAccountPageExists()).toBeTruthy();
        }
        else if (data.expected.toLowerCase() === "failure") {
            // Verify error message is displayed for failed login
            const errorMessage = await loginPage.getLoginErrorMessage();
            expect(errorMessage).toBe(" Warning: No match for E-Mail Address and/or Password.");
        }

    });
}


