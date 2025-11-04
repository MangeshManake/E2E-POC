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

    // get Confirmation Message
    async getConfirmationMessage(): Promise<string> {
        return await this.msgConfirmation.textContent() ?? '';
    }

}