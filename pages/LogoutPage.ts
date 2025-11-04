import {Page, Locator} from '@playwright/test';
import {HomePage} from './HomePage';

export class LogoutPage {
    private readonly page: Page;
    private readonly btnContinue: Locator;

    constructor(page: Page) {
        this.page = page;
        // Locator for Continue button using Playwright's locator strategies
        this.btnContinue = page.getByRole('link', { name: 'Continue' });    
    }

    // Method to check Continue button is visible
    async isContinueButtonVisible(): Promise<boolean> {
        return await this.btnContinue.isVisible();
    }

    // Method to click on Continue button
    async clickContinue(): Promise<HomePage> {
        try {
            await this.btnContinue.click();
            return new HomePage(this.page);
        } catch (error) {
            console.log("Error in clicking Continue button: ", error);
            throw error;
        }
    }
}