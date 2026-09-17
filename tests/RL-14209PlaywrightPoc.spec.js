const { test, expect } = require('@playwright/test');
const testData = require('../TestData/testData.json');

// RL-14209: Playwright POC with AI integration
test('user can login, add Winter Top to cart, and verify it in the cart', async ({ page }) => {
    await page.goto('https://automationexercise.com/login');
    await page.locator('[data-qa="login-email"]').fill(testData.user.email);
    await page.locator('[data-qa="login-password"]').fill(testData.user.password);
    await page.getByRole('button', { name: 'Login' }).click();
    await page.goto('https://automationexercise.com/products');
    const productCard = page.locator('.productinfo').filter({ hasText: 'Winter Top' });
    await productCard.scrollIntoViewIfNeeded();
    await productCard.locator('.btn.btn-default.add-to-cart').click();
    await page.getByRole('link', { name: 'View Cart' }).click();
    await expect(page.locator('.cart_description').filter({ hasText: 'Winter Top' })).toBeVisible();
});
