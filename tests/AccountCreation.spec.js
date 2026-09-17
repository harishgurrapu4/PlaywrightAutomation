const {test, expect} = require('@playwright/test');

import testData from '../TestData/testData.json';

test('ui basic test', async ({page}) => {
    await page.goto('https://automationexercise.com/');
    console.log(await page.title());
    await expect(page).toHaveTitle('Automation Exercise');
    await page.getByRole('link', { name: ' Signup / Login' }).click();
    await page.getByRole('textbox', { name: 'name' }).fill(testData.user.name);
    await page.locator('[data-qa="signup-email"]').fill(testData.user.email);
    await page.getByRole('button', { name: 'Signup' }).click();
    console.log(await page.title());
    await expect(page).toHaveTitle('Automation Exercise - Signup');
    if (await page.locator('.continue-prompt-text').isVisible()) {
        await page.locator('.continue-prompt-text').click();
    } else {
        console.log('Close button not found, skipping click action.');
    }
    await page.locator('#uniform-id_gender1').check();
    await page.locator('#password').fill(testData.user.password);
    await page.locator('#days').selectOption('10');
    await page.locator('#months').selectOption('May');
    await page.locator('#years').selectOption('1990');
    await page.locator('#newsletter').check();
    await page.locator('#optin').check();
    await page.locator('#first_name').fill('Test');
    await page.locator('#last_name').fill('User');
    await page.locator('#company').fill('Test Company');
    await page.locator('#address1').fill('123 Test Street');
    await page.locator('#address2').fill('Apt 456');
    await page.locator('#country').selectOption('United States');
    await page.locator('#state').fill('California');
    await page.locator('#city').fill('Los Angeles');
    await page.locator('#zipcode').fill('90001');
    await page.locator('#mobile_number').fill('1234567890');
    await page.getByRole('button', { name: 'Create Account' }).click();
    await expect(page.getByRole('heading', { name: 'Account Created!' })).toBeVisible();
    });
