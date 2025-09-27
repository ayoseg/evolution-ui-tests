import { test as baseTest } from '@playwright/test'
import { HomePage } from "../page-object/HomePage";
import { LoginPage } from "../page-object/LoginPage";

export const test = baseTest.extend<{ homePage: HomePage, loginPage: LoginPage }>({
    homePage: async ({page}, use) => {
        await use(new HomePage(page));
    },
    loginPage: async ({page}, use) => {
        await use(new LoginPage(page));
    }
});
