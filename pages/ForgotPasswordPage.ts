import { Page, Locator } from '@playwright/test';

export class ForgotPasswordPage {
    private readonly page: Page;

    // Locators
    private readonly txtEmail: Locator;
    private readonly btnContinue: Locator;
    private readonly confirmationMessage: Locator;

    constructor(page: Page) {
        this.page = page;
        // Email input field
        this.txtEmail = page.getByRole('textbox', { name: /E-Mail Address/i });
        // Continue button
        this.btnContinue = page.locator('input[type="submit"]');
        // Confirmation message
        this.confirmationMessage = page.locator('.alert.alert-success.alert-dismissible');
    }

    // Method to enter email address
    async setEmail(email: string): Promise<void> {
        await this.txtEmail.fill(email);
    }

    // Method to click Continue button
    async clickContinue(): Promise<void> {
        await this.btnContinue.click();
    }

    // Method to get confirmation message text
    async getConfirmationMessage(): Promise<string> {
        try {
            const text = await this.confirmationMessage.textContent({ timeout: 5000 });
            return text ? text.trim() : '';
        } catch {
            return '';
        }
    }

    // Method to check if confirmation message is visible
    async isConfirmationMessageVisible(): Promise<boolean> {
        try {
            return await this.confirmationMessage.isVisible({ timeout: 5000 });
        } catch {
            return false;
        }
    }

    // Combined method to enter email and continue
    async submitForgotPasswordForm(email: string): Promise<void> {
        await this.setEmail(email);
        await this.clickContinue();
    }
}
