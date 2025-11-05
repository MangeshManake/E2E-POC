import { Page, Locator } from '@playwright/test';
import { RandomDataUtil } from '../utils/randomDataGenerator';

export class CheckoutPage {
    private readonly page: Page;
    
    // Locators
    private readonly btnAddrContinue: Locator;
    private readonly txtFirstName: Locator;
    private readonly txtLastName: Locator;
    private readonly txtAddress1: Locator;
    private readonly txtAddress2: Locator;
    private readonly txtCity: Locator;
    private readonly txtPin: Locator;
    private readonly drpCountry: Locator;
    private readonly drpState: Locator;
    private readonly addCommentMsg: Locator;
    private readonly acceptTandC: Locator;
    private readonly btnContinuePaymentMethod: Locator;
    private readonly warningPayment : Locator;

    constructor(page: Page) {
        this.page = page;
        // Initialize locators 
        this.btnAddrContinue = page.locator('#button-payment-address');
        this.txtFirstName = page.getByRole('textbox', { name: 'First Name' });
        this.txtLastName = page.getByRole('textbox', { name: 'Last Name' });
        this.txtAddress1 = page.getByRole('textbox', { name: 'Address 1' });
        this.txtAddress2 = page.getByRole('textbox', { name: 'Address 2' });
        this.txtCity = page.getByRole('textbox', { name: 'City' });
        this.txtPin = page.getByRole('textbox', { name: 'Post Code' });
        this.drpCountry = page.getByRole('combobox', { name: 'Country' });
        this.drpState = page.getByRole('combobox', { name: 'Region / State' });
        this.addCommentMsg= page.locator('[name="comment"]');
        this.acceptTandC = page.locator('[name="agree"]');
        this.btnContinuePaymentMethod = page.locator('#button-payment-method');
        this.warningPayment = page.locator('div.alert.alert-danger.alert-dismissible')
    }

    // Check if checkout page exists
    /*async isCheckoutPageExists() {
        try {
            await expect(this.page).toHaveTitle("Checkout");
            return true;
        } catch (error) {
            return false;
        }
    }*/

    // Form field methods
    async setFirstName(firstName: string){
        await this.txtFirstName.fill(firstName);
    }

    async setLastName(lastName: string){
        await this.txtLastName.fill(lastName);
    }

    async setAddress1(address1: string) {
        await this.txtAddress1.fill(address1);
    }

    async setAddress2(address2: string){
        await this.txtAddress2.fill(address2);
    }

    async setCity(city: string){
        await this.txtCity.fill(city);
    }

    async setPin(pin: string){
        await this.txtPin.fill(pin);
    }

    async setCountry(country: string){
        await this.drpCountry.selectOption({ label: country });
    }

    async setState(state: string){
        await this.drpState.selectOption({ label: state });
    }

    // Click on continue button
    async clickOnContinue(){
        await this.btnAddrContinue.click();
    }

     // Add comment in Payment Details
    async addComment(){
        //if (checkOutOption === "Guest Checkout") {
            await this.addCommentMsg.fill(RandomDataUtil.getRandomAlphanumeric(50));
        //}
    }

    // Accept Terms and Conditions of Payment Method
    async acceptTermsAndConditions(){
        await this.acceptTandC.check();
    }

        async clickOnPaymentContinue(){
        await this.btnContinuePaymentMethod.click();
    }

    async warningPaymentMethod(): Promise<any>{
        return (await this.warningPayment.textContent());
    }
}