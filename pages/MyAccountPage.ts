import {Page, Locator} from '@playwright/test';
import {LogoutPage} from './LogoutPage';

export class MyAccountPage {
    private readonly page: Page;

    // Locators using Playwright's locator strategies
    private readonly lnkLogout: Locator;
    private readonly msgHeading: Locator;

    constructor(page: Page) {
        this.page = page;
        this.msgHeading = page.locator('h2:has-text("My Account")');
        this.lnkLogout = page.getByRole('link', { name: 'Logout' });
    }

    // Method to check My Account page is exists
    async isMyAccountPageExists(): Promise<boolean> {
        try {
            return await this.msgHeading.isVisible();
        } catch (error) {
            console.log("Error in locating My Account Page: ", error);
            return false;
        }

    }

    // Method to click on Logout link
    async clickLogout(): Promise<LogoutPage> {
        try{
            await this.lnkLogout.click();
            return new LogoutPage(this.page);
        }
        catch(error){
            console.log("Error in clicking Logout link: ", error);
            throw error;
        }
        
    }

    //Alternative method to check My Account page is exists
    async getPageTitle(): Promise<string> {
        return this.page.title();
    }
}