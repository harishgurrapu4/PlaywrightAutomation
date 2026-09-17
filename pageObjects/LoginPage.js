import { BasePage, expect } from './basePage';

class LoginPage extends BasePage {
    
    constructor(page){
        super(page);
        this.txtBox_username = this.page.locator('[data-qa="login-email"]');
        this.txtBox_password = this.page.locator('[data-qa="login-password"]');
        this.btn_Login = this.page.locator('[data-qa="login-button"]');
        this.msg_incorrect_username_password = this.page.locator('[style*=block]');
    }

    // Method to open the login page
    async open() {
        await this.page.goto('https://automationexercise.com/login');
    }

    // Method to perform login action
    async login(username, password) {
        await this.txtBox_username.fill(username);
        await this.txtBox_password.fill(password);
        await this.btn_Login.click();
    }

    // Method to get error message text
    async getErrorMessage() {
        return await this.msg_incorrect_username_password.textContent();
    }
}

// Export the class so the test can instantiate it with a valid `page` instance.
module.exports = {LoginPage};
