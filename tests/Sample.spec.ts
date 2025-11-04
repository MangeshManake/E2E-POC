import {test, expect} from "@playwright/test"   
test("homePage sample test", async ({page})=>{
    await page.goto("https://naveenautomationlabs.com/opencart/");
    //await page.getByRole('link', { name: ' My Account' }).click();
    await page.getByRole('textbox', { name: 'Search' }).fill("MacBook");
    await page.locator("//i[@class='fa fa-search']").click();
    await expect(page.locator('h1:has-text("Search - /")')).toBeVisible();
    
});