import { th } from "@faker-js/faker";
import { Page, expect, Locator } from "@playwright/test";

export class HomePage {
    // Locators
    private readonly page: Page
    private readonly lnkMyAccount: Locator;
    private readonly lnkRegister: Locator;
    private readonly lnkLogin: Locator;
    private readonly txtSearchBox: Locator;
    private readonly btnSearch: Locator;

    constructor(page: Page) {
        this.page = page;
        this.lnkMyAccount = page.getByRole('link', { name: ' My Account' });
        this.lnkRegister = page.getByRole('link', { name: 'Register' });
        this.lnkLogin = page.getByRole('link', { name: 'Login' });
        this.txtSearchBox = page.getByRole('textbox', { name: 'Search' });
        this.btnSearch = page.locator("button[class='btn btn-default btn-lg']")
    }

    // Check if Home Page exists
    async isHomePageExists() {
        let title: string = await this.page.title();
        if (title) {
            return true;
        }
        return false;
    }

    // Click "My Account" Link
    async clickMyAccount() {
        try {
            await this.lnkMyAccount.click();
        } catch (error) {
            console.log(`Error clicking My Account link: ${error}`);
            throw error;
        }
    }
    // Click "Register" Link
    async clickRegister() {
        try {
            await this.lnkRegister.click();
        } catch (error) {
            console.log(`Error clicking Register link: ${error}`);
            throw error;
        }
    }   
    // Click "Login" Link
    async clickLogin() {
        try {
            await this.lnkLogin.click();
        } catch (error) {
            console.log(`Error clicking Login link: ${error}`);
            throw error;
        }
    }   
    // Enter Product Name in Search Box
    async enterProductName(productName: string) {
        try {
            await this.txtSearchBox.fill(productName);
            //await this.btnSearch.click();
        } catch (error) {
            console.log(`Error searching for product ${productName}: ${error}`);
            throw error;
        }
    }   
    // Click Search Button
    async clickSearchButton() {
        try {
            await this.btnSearch.click();
        } catch (error) {
            console.log(`Error clicking Search button: ${error}`);
            throw error;
        }
    }   

}
