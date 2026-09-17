const {test, expect} = require('@playwright/test');


test('Browser basic test', async ({browser}) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('https://example.com');
    console.log(await page.title());
    expect(await page.title()).toBe('Example Domain');
    await context.close();
});

test.only('ui basic test', async ({page}) => {
    await page.goto('https://www.rediffmailpro.com/cgi-bin/login.cgi');
    console.log(await page.title());
    await expect(page).toHaveTitle('Rediffmail Enterprise - A Next Generation Email Service | Business Email | Company Email | Professional Email');
    await page.locator('#useremail').fill("testuser");
    console.log('Filled username');
    await page.locator('[name="passwd"]').fill("testpassword");
    console.log('Filled password');
    await page.locator('[type="submit"]').click();
    await page.locator('[type="submit"]').click();
// 1. Register the dialog handler
    await page.on('dialog', async dialog => {
    console.log(dialog.message());
    // 2. Assert the message
    await expect(dialog.message()).toContain("Please enter valid email address");
    // 3. Accept the dialog (click OK)
    await dialog.accept();
    });
});