const {test, expect} = require('@playwright/test');

import testData from '../TestData/testData.json';
import { LoginPage } from '../pageObjects/LoginPage.js';

test('ui basic test', async ({page}) => {
    let loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(testData.user.email, testData.user.password);
    console.log(await page.title());
    await expect(page).toHaveTitle('Automation Exercise');
});