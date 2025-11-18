import { Page, Locator } from '@playwright/test';

export class CheckoutAddressPage {
    private readonly page: Page;

    // Radio button and form locators for "I want to use a new address"
    private readonly radioBtnUseNewAddress: Locator;
    private readonly txtFirstName: Locator;
    private readonly txtLastName: Locator;
    private readonly txtAddress1: Locator;
    private readonly txtCity: Locator;
    private readonly txtPostCode: Locator;
    private readonly drpCountry: Locator;
    private readonly drpState: Locator;
    private readonly btnContinue: Locator;
    private readonly alertMessages: Locator;

    constructor(page: Page) {
        this.page = page;
        // Radio button to select "I want to use a new address"
        // Target the "new" address radio by accessible name to avoid strict-mode ambiguity
        this.radioBtnUseNewAddress = page.getByRole('radio', { name: /I want to use a new address/i });
        
        // Address form fields
        this.txtFirstName = page.getByRole('textbox', { name: /First Name/i });
        this.txtLastName = page.getByRole('textbox', { name: /Last Name/i });
        this.txtAddress1 = page.getByRole('textbox', { name: /Address 1/i });
        this.txtCity = page.getByRole('textbox', { name: /City/i });
        this.txtPostCode = page.getByRole('textbox', { name: /Post Code/i });
        this.drpCountry = page.getByRole('combobox', { name: /Country/i });
        this.drpState = page.getByRole('combobox', { name: /Region.*State/i });

        // Continue button
        this.btnContinue = page.locator('#button-payment-address');

        // Alert/error messages
        this.alertMessages = page.locator('div.alert.alert-danger');
    }

    // Click on "I want to use a new address" radio button
    async selectUseNewAddress() {
        await this.radioBtnUseNewAddress.click();
    }

    // Fill address form fields
    async setFirstName(firstName: string) {
        await this.txtFirstName.fill(firstName);
    }

    async setLastName(lastName: string) {
        await this.txtLastName.fill(lastName);
    }

    async setAddress1(address1: string) {
        await this.txtAddress1.fill(address1);
    }

    async setCity(city: string) {
        await this.txtCity.fill(city);
    }

    async setPostCode(postCode: string) {
        await this.txtPostCode.fill(postCode);
    }

    async setCountry(country: string) {
        await this.drpCountry.selectOption({ label: country });
    }

    async setState(state: string) {
        await this.drpState.selectOption({ label: state });
    }

    // Click continue button
    async clickContinue() {
        await this.btnContinue.click();
    }

    // Get all alert/error messages
    async getErrorMessages(): Promise<string[]> {
        const messages: string[] = [];
        const count = await this.alertMessages.count();
        for (let i = 0; i < count; i++) {
            const text = await this.alertMessages.nth(i).textContent();
            if (text) {
                messages.push(text.trim());
            }
        }
        return messages;
    }

    // Get alert message text
    async getAlertMessage(): Promise<string> {
        try {
            const text = await this.alertMessages.first().textContent({ timeout: 3000 });
            return text ? text.trim() : '';
        } catch {
            return '';
        }
    }
}
