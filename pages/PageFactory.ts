import { TestConfig } from "../test.config";
import { HomePage } from "./HomePage";
import { LoginPage } from "./LoginPage";
import { Page } from "@playwright/test";
import { RegistrationPage } from "./RegistrationPage";
import { ProductPage } from "./ProductPage";
import { LogoutPage } from "./LogoutPage";
import { MyAccountPage } from "./MyAccountPage";
import { ShoppingCartPage } from "./ShoppingCartPage";
import { SearchResultsPage } from "./SearchResultsPage";
import { CheckoutPage } from "./CheckoutPage";

export class PageFactory {
  static getConfig(): TestConfig {
    return new TestConfig();
  }
  static getLoginPage(page: Page): LoginPage {
    return new LoginPage(page);
  }

  static getHomePage(page: Page): HomePage {
    return new HomePage(page);
  }

  static getMyAccountPage(page: Page): MyAccountPage {
    return new MyAccountPage(page);
  }

  static getRegistrationPage(page: Page): RegistrationPage {
    return new RegistrationPage(page);
  }
}
