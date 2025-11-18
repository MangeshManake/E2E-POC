// Tags: @master @sanity @regression

import {test, expect} from "@playwright/test"
import {PageFactory } from "../pages/PageFactory";
import {RandomDataUtil} from "../utils/randomDataGenerator";
import {TestConfig} from "../test.config";

let config: TestConfig;

test.beforeEach(async ({page})=>{
    // Navigate to Application URL
    const config = PageFactory.getConfig();
    await page.goto(config.appUrl);
});

// Cleanup after each test. It is optional
test.afterEach(async ({page})=>{
    await page.close();
});

test('Account Registration Test @master @sanity @regression', async ({page})=>{
   
    // Click on My Account  and Register Link
    //await PageFactory.getHomePage(page).clickMyAccount();
    await PageFactory.getHomePage(page).clickMyAccount();

    // Fill Registration Form with random data
    await PageFactory.getRegistrationPage(page).setFirstName(RandomDataUtil.getRandomFirstName());
    await PageFactory.getRegistrationPage(page).setLastName(RandomDataUtil.getRandomLastName());
    await PageFactory.getRegistrationPage(page).setEmail(RandomDataUtil.getRandomEmail());
    await PageFactory.getRegistrationPage(page).setTelephone(RandomDataUtil.getPhoneNumber());

    const password = RandomDataUtil.getRandomPassword();
    await PageFactory.getRegistrationPage(page).setPassword(password);
    await PageFactory.getRegistrationPage(page).setConfirmPassword(password);

    // Accept Privacy Policy and Submit the form
    await PageFactory.getRegistrationPage(page).acceptPrivacyPolicy();
    await PageFactory.getRegistrationPage(page).clickContinue();

    expect(await PageFactory.getRegistrationPage(page).getConfirmationMessage()).toContain("Your Account Has Been Created!");
});