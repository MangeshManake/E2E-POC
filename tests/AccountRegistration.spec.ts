// Tags: @master @sanity @regression

import {test, expect} from "@playwright/test"
import { HomePage } from "../pages/HomePage";
import { RegistrationPage } from "../pages/RegistrationPage";
import {RandomDataUtil} from "../utils/randomDataGenerator";
import {TestConfig} from "../test.config"

let homePage: HomePage;
let registrationPage: RegistrationPage;
let config: TestConfig;

test.beforeEach(async ({page})=>{
    // Navigate to Application URL
    config = new TestConfig();
    await page.goto(config.appUrl);

    homePage = new HomePage(page);
    registrationPage = new RegistrationPage(page);
});

// Cleanup after each test. It is optional
test.afterEach(async ({page})=>{
    await page.close();
});

test('Account Registration Test @master @sanity @regression', async ()=>{
   
    // Click on My Account  and Register Link
    await homePage.clickMyAccount();
    await homePage.clickRegister();

    // Fill Registration Form with random data
    await registrationPage.setFirstName(RandomDataUtil.getRandomFirstName());
    await registrationPage.setLastName(RandomDataUtil.getRandomLastName());
    await registrationPage.setEmail(RandomDataUtil.getRandomEmail());
    await registrationPage.setTelephone(RandomDataUtil.getPhoneNumber());
    const password = RandomDataUtil.getRandomPassword();
    await registrationPage.setPassword(password);
    await registrationPage.setConfirmPassword(password);

    // Accept Privacy Policy and Submit the form
    await registrationPage.acceptPrivacyPolicy();
    await registrationPage.clickContinue();

    // Verify Registration is successful        
    //const confirmationMsg = await registrationPage.getConfirmationMessage();
    //expect(confirmationMsg).toContain("Your Account Has Been Created!");
    expect(await registrationPage.getConfirmationMessage()).toContain("Your Account Has Been Created!");
});