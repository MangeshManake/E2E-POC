import { test, expect } from '@playwright/test';
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage';
import { TestConfig } from '../test.config';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';

let config: TestConfig;
let forgotPasswordPage: ForgotPasswordPage;
let homePage : HomePage;
let loginPage : LoginPage;

test.beforeEach(async ({ page }) => {
    config = new TestConfig();
    forgotPasswordPage = new ForgotPasswordPage(page);
    homePage = new HomePage(page);
    loginPage = new LoginPage(page);
});

test('Forgot Password - Verify confirmation message @regression', async ({ page }) => {
    // Navigate from homepage -> My Account -> Login -> Forgotten Password
    await page.goto(config.appUrl);
    await homePage.clickMyAccount();
    await homePage.clickLogin();
    await loginPage.ClickOnForgotPassword();
    //await page.click('text=My Account');
    //await page.click('text=Login');
    //await page.click('text=Forgotten Password');

    // Ensure we've arrived at the forgotten password URL
    await expect(page).toHaveURL(`${config.appUrl}index.php?route=account/forgotten`);

    // Enter email address and submit form
    await forgotPasswordPage.submitForgotPasswordForm(config.email);

    // Wait briefly for response
   // await page.waitForTimeout(2000);

    // Verify confirmation message is visible
    const isVisible = await forgotPasswordPage.isConfirmationMessageVisible();
    expect(isVisible).toBeTruthy();

    // Get and verify the exact confirmation message
    const confirmationMsg = await forgotPasswordPage.getConfirmationMessage();
    console.log(`Confirmation message: ${confirmationMsg}`);
    
    expect(confirmationMsg).toContain('An email with a confirmation link has been sent your email address.');
});

