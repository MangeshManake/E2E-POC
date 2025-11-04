import{expect, test} from "@playwright/test"
import {HomePage} from "../pages/HomePage";
import {SearchResultsPage} from "../pages/SearchResultsPage";
import {TestConfig} from "../test.config";
import {ProductPage} from "../pages/ProductPage";

// Declare variables for Test Config and Page Objects
let config: TestConfig;
let homePage: HomePage;
let searchResultsPage: SearchResultsPage;
let productPage: ProductPage;

test.beforeEach(async ({page})=>{
    // Initialize Test Config and Page Objects
    config = new TestConfig();
    homePage = new HomePage(page);
    searchResultsPage = new SearchResultsPage(page);
    productPage = new ProductPage(page);
    await page.goto(config.appUrl);
});

test(`Add product to Cart @master @regression`, async ({page})=>{
    // Read product name and search for it
    const productName = config.productName;
    await homePage.enterProductName(productName);
    await homePage.clickSearchButton();

    // Verify if Search Results Page is exists
    const isSearchPageExists = await searchResultsPage.isSearchResultsPageExists();
    expect(isSearchPageExists).toBeTruthy();

    // Verify if the searched product exists
    const isProductExists = await searchResultsPage.isProductExist(productName);
    expect(isProductExists).toBeTruthy();

    // Select the product from search results
    await searchResultsPage.selectProduct(productName);

    // Set quantity and add to cart
    if(await searchResultsPage.isProductExist(productName)){
        await searchResultsPage.selectProduct(productName);
        await productPage.setQuantity(config.productQuantity);
        await productPage.addToCart();

        // Verify if confirmation message is visible
        const isCnfMsgVisible = await productPage.isConfirmationMessageVisible();
        expect(isCnfMsgVisible).toBeTruthy();
    }
});

