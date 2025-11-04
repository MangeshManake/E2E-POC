import { Page, expect, Locator } from '@playwright/test';

export class CheckoutPage {
    private readonly page: Page;
    
    // Locators
    private readonly radioGuest: Locator;
    private readonly btnContinue: Locator;
    private readonly txtFirstName: Locator;
    private readonly txtLastName: Locator;
    private readonly txtAddress1: Locator;
    private readonly txtAddress2: Locator;
    private readonly txtCity: Locator;
    private readonly txtPin: Locator;
    private readonly drpCountry: Locator;
    private readonly drpState: Locator;
    private readonly btnContinueBillingAddress: Locator;
    private readonly btnContinueDeliveryAddress: Locator;
    private readonly txtDeliveryMethod: Locator;
    private readonly btnContinueShippingAddress: Locator;
    private readonly chkboxTerms: Locator;
    private readonly btnContinuePaymentMethod: Locator;
    private readonly lblTotalPrice: Locator;
    private readonly btnConfOrder: Locator;
    private readonly lblOrderConMsg: Locator;

    constructor(page: Page) {
        this.page = page;
        
        // Initialize locators with CSS selectors
        this.radioGuest = page.locator('input[value="guest"]');
        this.btnContinue = page.locator('#button-account');
        this.txtFirstName = page.locator('#input-payment-firstname');
        this.txtLastName = page.locator('#input-payment-lastname');
        this.txtAddress1 = page.locator('#input-payment-address-1');
        this.txtAddress2 = page.locator('#input-payment-address-2');
        this.txtCity = page.locator('#input-payment-city');
        this.txtPin = page.locator('#input-payment-postcode');
        this.drpCountry = page.locator('#input-payment-country');
        this.drpState = page.locator('#input-payment-zone');
        this.btnContinueBillingAddress = page.locator('#button-payment-address');
        this.btnContinueDeliveryAddress = page.locator('#button-shipping-address');
        this.txtDeliveryMethod = page.locator('textarea[name="comment"]');
        this.btnContinueShippingAddress = page.locator('#button-shipping-method');
        this.chkboxTerms = page.locator('input[name="agree"]');
        this.btnContinuePaymentMethod = page.locator('#button-payment-method');
        this.lblTotalPrice = page.locator('strong:has-text("Total:") + td');
        this.btnConfOrder = page.locator('#button-confirm');
        this.lblOrderConMsg = page.locator('#content h1');
    }

    // Check if checkout page exists
    async isCheckoutPageExists() {
        try {
            await expect(this.page).toHaveTitle("Checkout");
            return true;
        } catch (error) {
            return false;
        }
    }
    
    // Choose checkout option
    async chooseCheckoutOption(checkOutOption: string){
        if (checkOutOption === "Guest Checkout") {
            await this.radioGuest.click();
        }
    }

    // Click on continue button
    async clickOnContinue(){
        await this.btnContinue.click();
    }

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

    // Continue button methods
    async clickOnContinueAfterBillingAddress() {
        await this.btnContinueBillingAddress.click();
    }

    async clickOnContinueAfterDeliveryAddress() {
        await this.btnContinueDeliveryAddress.click();
    }

    // Delivery method
    async setDeliveryMethodComment(deliveryMsg: string) {
        await this.txtDeliveryMethod.fill(deliveryMsg);
    }

    async clickOnContinueAfterDeliveryMethod() {
        await this.btnContinueShippingAddress.click();
    }

    // Terms and conditions
    async selectTermsAndConditions() {
        await this.chkboxTerms.check();
    }

    async clickOnContinueAfterPaymentMethod() {
        await this.btnContinuePaymentMethod.click();
    }

    // Order confirmation
    async getTotalPriceBeforeConfOrder() {
        return await this.lblTotalPrice.textContent();
    }

    async clickOnConfirmOrder() {
        await this.btnConfOrder.click();
    }

    async isOrderPlaced() {
        try {
            // Handle alert if present
            if (this.page.on('dialog', dialog => dialog.accept())) {
                await this.page.waitForEvent('dialog');
            }
            
            await expect(this.lblOrderConMsg).toHaveText("Your order has been placed!");
            return true;
        } catch (error) {
            console.log(`Error verifying order placement: ${error}`);
            return false;
        }
    }
}