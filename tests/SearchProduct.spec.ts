/* Test Case: Search Product
   Tags: @master @regression  */

import {test, expect} from "@playwright/test"
import {HomePage} from "../pages/HomePage";
import {SearchResultsPage} from "../pages/SearchResultsPage";
import {TestConfig} from "../test.config";

// Declare variables for Test Config and Page Objects
let testConfig: TestConfig;
let homePage: HomePage;
let searchResultsPage: SearchResultsPage;

test.beforeEach(async ({page})=>{
    // Initialize Test Config and Page Objects
    testConfig = new TestConfig();
    homePage = new HomePage(page);
    searchResultsPage = new SearchResultsPage(page);
    await page.goto(testConfig.appUrl);
});

test(`Search Products @master @regression`, async ({page})=>{
    // Read product name from Test Config
    const productName = testConfig.productName;

    // Perform search operation on Home Page
    await homePage.enterProductName(productName);
    await homePage.clickSearchButton();

    // Verify if Search Results Page is displayed
    const isSearchPageExists = await searchResultsPage.isSearchResultsPageExists();
    expect(isSearchPageExists).toBeTruthy();

    // Verify if the searched product exists in the search results
    const isProductExists = await searchResultsPage.isProductExist(productName);
    expect(isProductExists).toBeTruthy();
});


