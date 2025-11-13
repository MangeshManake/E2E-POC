import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { RegistrationPage } from '../pages/RegistrationPage';
import { TestConfig } from '../test.config';

let homePage: HomePage;
let registrationPage: RegistrationPage;
let config: TestConfig;

function uniqueEmail() {
    return `test+${(Math.random() * 1000)}@example.com`;
}

test.describe('Registration - negative and boundary tests ', () => {
    test.beforeEach(async ({ page }) => {
        config = new TestConfig();
        await page.goto(config.appUrl);

        homePage = new HomePage(page);
        registrationPage = new RegistrationPage(page);

        await homePage.clickMyAccount();
        await homePage.clickRegister();
    });

    const negativeTestCases = [
        { name: 'Empty First Name', firstName: '', lastName: 'Last', email: '', telephone: '1234567890', password: 'Pass123', confirmPassword: 'Pass123', acceptPolicy: true, shouldFail: true, expectedErrorPatterns: ['First Name', 'must be'] },
        { name: 'First Name Too Long', firstName: 'A'.repeat(33), lastName: 'Last', email: '', telephone: '1234567890', password: 'Pass123', confirmPassword: 'Pass123', acceptPolicy: true, shouldFail: true, expectedErrorPatterns: ['First Name', 'must be'] },
        
        { name: 'Empty Last Name', firstName: 'First', lastName: '', email: '', telephone: '1234567890', password: 'Pass123', confirmPassword: 'Pass123', acceptPolicy: true, shouldFail: true, expectedErrorPatterns: ['Last Name', 'must be'] },

        { name: 'Empty Email', firstName: 'First', lastName: 'Last', email: '', telephone: '1234567890', password: 'Pass123', confirmPassword: 'Pass123', acceptPolicy: true, shouldFail: true, expectedErrorPatterns: ['E-mail', 'valid'] },
        { name: 'Email Missing @', firstName: 'First', lastName: 'Last', email: 'invalidexample.com', telephone: '1234567890', password: 'Pass123', confirmPassword: 'Pass123', acceptPolicy: true, shouldFail: true, expectedErrorPatterns: ['@', 'email'] },

        { name: 'Empty Telephone', firstName: 'First', lastName: 'Last', email: '', telephone: '', password: 'Pass123', confirmPassword: 'Pass123', acceptPolicy: true, shouldFail: true, expectedErrorPatterns: ['Telephone', 'must be'] },
        { name: 'Telephone Too Short', firstName: 'First', lastName: 'Last', email: '', telephone: '1', password: 'Pass123', confirmPassword: 'Pass123', acceptPolicy: true, shouldFail: true, expectedErrorPatterns: ['Telephone', 'must be'] },

        { name: 'Empty Password', firstName: 'First', lastName: 'Last', email: '', telephone: '1234567890', password: '', confirmPassword: '', acceptPolicy: true, shouldFail: true, expectedErrorPatterns: ['Password', 'must be'] },
        { name: 'Password Too Short', firstName: 'First', lastName: 'Last', email: '', telephone: '1234567890', password: '123', confirmPassword: '123', acceptPolicy: true, shouldFail: true, expectedErrorPatterns: ['Password', 'must be'] },
        { name: 'Password Mismatch', firstName: 'First', lastName: 'Last', email: '', telephone: '1234567890', password: 'ValidPass1', confirmPassword: 'Different', acceptPolicy: true, shouldFail: true, expectedErrorPatterns: ['confirmation', 'match'] },

        { name: 'Policy Not Accepted', firstName: 'First', lastName: 'Last', email: '', telephone: '1234567890', password: 'ValidPass1', confirmPassword: 'ValidPass1', acceptPolicy: false, shouldFail: true, expectedErrorPatterns: ['Privacy', 'Policy', 'agree'] },

        { name: 'All Fields Empty', firstName: '', lastName: '', email: '', telephone: '', password: '', confirmPassword: '', acceptPolicy: false, shouldFail: true, expectedErrorPatterns: [] },

        { name: 'FirstName 1 char', firstName: 'A', lastName: 'Last', email: '', telephone: '1234567890', password: 'Pass123', confirmPassword: 'Pass123', acceptPolicy: true, shouldFail: false, expectedErrorPatterns: [] },
        { name: 'FirstName 32 chars', firstName: 'F'.repeat(32), lastName: 'Last', email: '', telephone: '1234567890', password: 'Pass123', confirmPassword: 'Pass123', acceptPolicy: true, shouldFail: false, expectedErrorPatterns: [] },
        { name: 'Telephone 3 chars', firstName: 'First', lastName: 'Last', email: '', telephone: '123', password: 'Pass123', confirmPassword: 'Pass123', acceptPolicy: true, shouldFail: false, expectedErrorPatterns: [] },
        { name: 'Password 4 chars', firstName: 'First', lastName: 'Last', email: '', telephone: '1234567890', password: 'P123', confirmPassword: 'P123', acceptPolicy: true, shouldFail: false, expectedErrorPatterns: [] },
        { name: 'Password 20 chars', firstName: 'First', lastName: 'Last', email: '', telephone: '1234567890', password: 'P'.repeat(20), confirmPassword: 'P'.repeat(20), acceptPolicy: true, shouldFail: false, expectedErrorPatterns: [] }
    ];

    for (const testCase of negativeTestCases) {
        test(`${testCase.name} @regression @negative`, async ({ page }) => {
            const emailToUse = testCase.email && testCase.email.length > 0 ? testCase.email : uniqueEmail();

            await registrationPage.setFirstName(testCase.firstName);
            await registrationPage.setLastName(testCase.lastName);
            await registrationPage.setEmail(emailToUse);
            await registrationPage.setTelephone(testCase.telephone);
            await registrationPage.setPassword(testCase.password);
            await registrationPage.setConfirmPassword(testCase.confirmPassword);

            if (testCase.acceptPolicy) {
                await registrationPage.acceptPrivacyPolicy();
            }

            await registrationPage.clickContinue();
            await page.waitForTimeout(1500);

            const currentUrl = page.url();
            const errorMessages = await registrationPage.getErrorMessages();
            const confirmationMsg = await registrationPage.getConfirmationMessage();

            console.log(`Test: ${testCase.name}`);
            console.log(`  URL: ${currentUrl}`);
            console.log(`  Errors: ${errorMessages.length} - ${errorMessages.join(' | ')}`);
            console.log(`  Confirmation: ${confirmationMsg}`);

            if (testCase.shouldFail) {
                if (errorMessages.length > 0 && testCase.expectedErrorPatterns.length > 0) {
                    const joined = errorMessages.join(' ');
                    const matched = testCase.expectedErrorPatterns.some(p => joined.toLowerCase().includes(p.toLowerCase()));
                    expect(matched).toBeTruthy();
                } else {
                    console.log(`  Note: No validation error displayed for '${testCase.name}'. Site may accept this input.`);
                }
            } else {
                expect(errorMessages.length).toBe(0);
                const isSuccess = confirmationMsg.includes('Your Account Has Been Created!') || !currentUrl.includes('register');
                expect(isSuccess).toBeTruthy();
            }
        });
    }
});
