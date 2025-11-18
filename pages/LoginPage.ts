import { Page, Locator } from '@playwright/test';

export class LoginPage {
    private readonly page: Page;    

    // Locators for Login using Playwright's locator strategies
    private readonly txtEmailAddress : Locator;
    private readonly txtPassword : Locator;
    private readonly btnLogin : Locator
    private readonly loginErrorMessage : Locator;
    private readonly forgotPassword : Locator;

    constructor(page: Page) {
        this.page = page;        
        this.txtEmailAddress = page.getByLabel('E-Mail Address');
        this.txtPassword = page.getByLabel('Password');
        this.btnLogin = page.locator('input[type="submit"]');
        this.loginErrorMessage = page.locator(".alert.alert-danger.alert-dismissible");
        this.forgotPassword = page.locator("//a[@class='list-group-item'][normalize-space()='Forgotten Password']");
    }

    // Method to Enter Email Address
    async setEmail(email: string): Promise<void> {
        await this.txtEmailAddress.fill(email);
    }

    // Method to Enter Password
    async setPassword(password: string): Promise<void> {
        await this.txtPassword.fill(password);
    }

    // Method to click on Login button
    async clickLogin(): Promise<void> {
        await this.btnLogin.click();
    }
    
    // Alternative Method to perform login action 
    async login(email: string, password: string): Promise<void> {
        await this.setEmail(email);
        await this.setPassword(password);
        await this.clickLogin();
    }

    async getLoginErrorMessage(): Promise<string>{
        const errorMessage = await this.loginErrorMessage.textContent() || '';
        const warningMatch = errorMessage.match(/Warning/);
        return warningMatch ? warningMatch[0]: '';
    }

    // Click on Forgotton Password Link
    async ClickOnForgotPassword(): Promise<void> {
        await this.forgotPassword.click();
    }
}