import {Page, Locator } from "@playwright/test";

export class RegistrationPage {
    private readonly page: Page;

    //locators
    private readonly txtFirstName: Locator;
    private readonly txtLastName: Locator;
    private readonly txtEmail: Locator;
    private readonly txtTelephone: Locator;
    private readonly txtPassword: Locator;
    private readonly txtConfirmPassword: Locator;
    private readonly chkPolicy: Locator;
    private readonly btnContinue: Locator;
    private readonly msgConfirmation: Locator;

    constructor(page: Page) {
        this.page = page;

        //initialize locators
        this.txtFirstName = page.getByRole('textbox', { name: 'First Name' });
        this.txtLastName = page.getByRole('textbox', { name: 'Last Name' });
        this.txtEmail = page.getByRole('textbox', { name: 'E-Mail' });
        this.txtTelephone = page.getByRole('textbox', { name: 'Telephone' });
        this.txtPassword = page.getByLabel('Password', { exact: true })
        this.txtConfirmPassword = page.getByRole('textbox', { name: 'Password Confirm' });
        this.chkPolicy = page.getByRole('checkbox');
        this.btnContinue = page.getByRole('button', { name: 'Continue' });
        this.msgConfirmation = page.locator('h1:has-text("Your Account Has Been Created!")')
    }

    // Get all validation error messages displayed on the form
    async getErrorMessages(): Promise<string[]> {
        // OpenCart displays alerts in div.alert-danger or similar containers
        const errorLocators = this.page.locator('div.alert, div.alert-danger, .alert-danger');
        const count = await errorLocators.count();
        const errors: string[] = [];
        
        for (let i = 0; i < count; i++) {
            const text = await errorLocators.nth(i).textContent();
            if (text) {
                errors.push(text.trim());
            }
        }
        return errors;
    }

    // Get error message for a specific field (checks for inline validation messages)
    async getFieldErrorMessage(fieldName: string): Promise<string | null> {
        // Try to find error near the field (many forms put errors in small/span after the field)
        const fieldLocator = this.page.getByRole('textbox', { name: fieldName });
        
        try {
            // Look for error text near the field or in a common error container
            const errorText = await this.page
                .locator(`xpath=//input[@placeholder="${fieldName}" or @aria-label="${fieldName}"]/following-sibling::*[contains(@class, "error") or contains(@class, "invalid") or contains(text(), "must")]`)
                .first()
                .textContent({ timeout: 2000 });
            return errorText ? errorText.trim() : null;
        } catch {
            return null;
        }
    }

    // Get error message from browser validation (HTML5 validation pop-up)
    async getBrowserValidationMessage(): Promise<string | null> {
        try {
            // Attempt to get validation message from the first invalid input
            const message = await this.page.evaluate(() => {
                const invalidInput = document.querySelector('input:invalid');
                return invalidInput ? (invalidInput as any).validationMessage : null;
            });
            return message;
        } catch {
            return null;
        }
    }   

    // set the First Name in Registration form
    async setFirstName(firstName: string): Promise<void> {
        await this.txtFirstName.fill(firstName);
    }

    // set the Last Name in Registration form
    async setLastName(lastName: string): Promise<void> {
        await this.txtLastName.fill(lastName);
    }

    // set the Email in Registration form
    async setEmail(email: string): Promise<void> {
        await this.txtEmail.fill(email);
    }

    // set the Telephone in Registration form
    async setTelephone(telephone: string): Promise<void> {
        await this.txtTelephone.fill(telephone);
    }

    // set the Password in Registration form
    async setPassword(password: string): Promise<void> {
        await this.txtPassword.fill(password);
    }

    // set the Confirm Password in Registration form
    async setConfirmPassword(confirmPassword: string): Promise<void> {
        await this.txtConfirmPassword.fill(confirmPassword);
    }

    // accept Privacy Policy
    async acceptPrivacyPolicy(): Promise<void> {
        await this.chkPolicy.check();
    }

    // click on Continue button
    async clickContinue(): Promise<void> {
        await this.btnContinue.click();
    }

    // get Confirmation Message - with timeout to prevent hanging
    async getConfirmationMessage(): Promise<string> {
        try {
            // Use a short timeout to check if element exists, don't wait for it
            const text = await this.msgConfirmation.textContent({ timeout: 3000 });
            return text ?? '';
        } catch (error) {
            // Element not found or timeout, return empty string
            return '';
        }
    }

}