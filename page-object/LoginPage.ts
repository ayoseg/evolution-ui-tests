import { Page } from '@playwright/test'

export class LoginPage {
    constructor(private page: Page) {}

    public usernameInput = this.page.locator('input[type="text"]');
    public passwordInput = this.page.locator('input[type="password"]');
    public loginButton = this.page.locator('input[value="Log In"]');

    async navigate() {
        await this.page.goto('https://stageconcept.dwp-estates-integrator.co.uk/wpstest/!System/Security/Login.aspx?ReturnUrl=%2fwpstest%2f');
    }

    async fillUsernameInput(text: string) {
        await this.usernameInput.fill(text);
    }

    async fillPasswordInput(text: string) {
        await this.passwordInput.fill(text);
    }

    async clickLoginButton() {
        await this.loginButton.click();
    }

    async login (userName: string, password: string) {
        await this.fillUsernameInput(userName);
        await this.fillPasswordInput(password);
        await this.clickLoginButton();
    }

}
