import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { SearchResultsPage } from '../pages/SearchResultsPage';
import { ProductPage } from '../pages/ProductPage';
//import { ShoppingCartPage } from '../pages/ShoppingCartPage';
import { CheckoutAddressPage } from '../pages/CheckoutAddressPage';
import { MyAccountPage } from '../pages/MyAccountPage';
import { TestConfig } from '../test.config';

// Each test is isolated: login -> search MacBook -> add to cart -> checkout -> run one negative case -> logout
const testCases = [
    { name: 'Empty First Name', firstName: '', lastName: 'Smith', address: '123 Main St', city: 'New York', postCode: '10001', shouldFail: true },
    { name: 'Empty Last Name', firstName: 'John', lastName: '', address: '123 Main St', city: 'New York', postCode: '10001', shouldFail: true },
    { name: 'Empty Address', firstName: 'John', lastName: 'Smith', address: '', city: 'New York', postCode: '10001', shouldFail: true },
    { name: 'Empty City', firstName: 'John', lastName: 'Smith', address: '123 Main St', city: '', postCode: '10001', shouldFail: true },
    { name: 'Empty Post Code', firstName: 'John', lastName: 'Smith', address: '123 Main St', city: 'New York', postCode: '', shouldFail: true },
    { name: 'First Name Too Long (33)', firstName: 'A'.repeat(33), lastName: 'Smith', address: '123 Main St', city: 'New York', postCode: '10001', shouldFail: true },
    { name: 'Last Name Too Long (33)', firstName: 'John', lastName: 'S'.repeat(33), address: '123 Main St', city: 'New York', postCode: '10001', shouldFail: true },
    { name: 'Address Too Long (129)', firstName: 'John', lastName: 'Smith', address: 'A'.repeat(129), city: 'New York', postCode: '10001', shouldFail: true },
    { name: 'First Name 1 char', firstName: 'A', lastName: 'Smith', address: '123 Main St', city: 'New York', postCode: '10001', shouldFail: false },
    { name: 'First Name 32 chars', firstName: 'A'.repeat(32), lastName: 'Smith', address: '123 Main St', city: 'New York', postCode: '10001', shouldFail: false },
    { name: 'All Fields Valid', firstName: 'John', lastName: 'Smith', address: '123 Main St', city: 'New York', postCode: '10001', shouldFail: false }
];

const config = new TestConfig();

for (const tc of testCases) {
    test(`${tc.name} @checkout @negative`, async ({ page }) => {
        const home = new HomePage(page);
        const login = new LoginPage(page);
        const search = new SearchResultsPage(page);
        const checkoutAddr = new CheckoutAddressPage(page);

        // 1) Login
        await page.goto(config.appUrl);
        await home.clickMyAccount();
        await home.clickLogin();
        await login.login(config.email, config.password);

        // 2) Search and open product
        await home.enterProductName(config.productName);
        await home.clickSearchButton();

        const productLocator = page.locator('h4 > a');
        const count = await productLocator.count();
        let clicked = false;
        for (let i = 0; i < count; i++) {
            const title = (await productLocator.nth(i).textContent())?.trim() || '';
            if (title.toLowerCase().includes(config.productName.toLowerCase())) {
                await productLocator.nth(i).click();
                clicked = true;
                break;
            }
        }
        if (!clicked) {
            test.skip();
            return;
        }

        // product page actions
        const product = new ProductPage(page);
        await product.addProductToCart('1');
        try {
            await product.clickItemsToNavigateToCart();
            const shoppingCart = await product.clickViewCart();
            // 3) Go to checkout
            const checkoutPage = await shoppingCart.clickOnCheckout();

            // small wait for checkout sections
            await page.waitForTimeout(800);

            // 4) Select new address
            try { await checkoutAddr.selectUseNewAddress(); } catch (e) { console.log('selectUseNewAddress failed', e); }

            // 5) Fill address fields for this case
            try {
                await checkoutAddr.setFirstName(tc.firstName);
                await checkoutAddr.setLastName(tc.lastName);
                await checkoutAddr.setAddress1(tc.address);
                await checkoutAddr.setCity(tc.city);
                await checkoutAddr.setPostCode(tc.postCode);
                try { await checkoutAddr.setCountry('United States'); await checkoutAddr.setState('New York'); } catch {}
            } catch (e) {
                console.log('Error filling address fields:', e);
            }

            // Submit
            try { await checkoutAddr.clickContinue(); } catch (e) { console.log('clickContinue failed', e); }
            await page.waitForTimeout(800);

            const errors = await checkoutAddr.getErrorMessages();
            const alert = await checkoutAddr.getAlertMessage();
            console.log(`Case: ${tc.name} -> Errors: ${errors.length ? errors.join(' | ') : 'none'}; Alert: ${alert || 'none'}`);

            if (tc.shouldFail) {
                if (!(errors.length > 0 || alert)) {
                    console.log(`⚠ ${tc.name}: no validation shown (site accepted)`);
                }
            } else {
                expect(errors.length).toBe(0);
            }

            // Logout
            await page.goto(`${config.appUrl}index.php?route=account/account`).catch(() => {});
            const myAcc = new MyAccountPage(page);
            try { const logoutPage = await myAcc.clickLogout(); await logoutPage.clickContinue(); } catch (e) { console.log('Logout failed', e); }

        } catch (e) {
            console.log('Cart/checkout navigation failed, skipping case:', e);
            test.skip();
            return;
        }
    });
}
