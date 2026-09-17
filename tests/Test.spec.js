const {test, expect} = require('@playwright/test');

import testData from '../TestData/testData.json';
import { LoginPage } from '../pageObjects/LoginPage.js';

test('ui basic test', async ({page}) => {
await page.goto('https://automationexercise.com/');
await page.getByRole('link', { name: ' Signup / Login' }).click();
await page.locator('[data-qa="login-email"]').fill(testData.user.email);
})

test('dialog test', async ({page}) => {
page.on('dialog', async dialog => {
  console.log(`Dialog message: ${dialog.message()}`);
  await dialog.accept();
});
const countFrames = page.frames().length;
console.log(`Number of frames on the page: ${countFrames}`);
await page.frame({ name: 'iframe-name' }).getByRole('button', { name: 'Click Me' }).click();
})

test('multiplewindow test', async ({page}) => {
const [newPage] = await Promise.all([
  page.waitForEvent('popup'),
  page.getByRole('link', { name: 'Open New Window' }).click()
]);
await newPage.waitForLoadState();
const newPageTitle = await newPage.title();
console.log(`New window title: ${newPageTitle}`);

const pages = page.context().pages();
console.log(`Number of open pages: ${pages.length}`);
for (const p of pages) {
    console.log(`Page title: ${await p.title()}`);
    if (p !== page) {
        await p.close();
    }
}
})

test('login test', async ({browser}) => {
const context = await browser.newContext();
const context2 = await browser.newContext();

const page = await context.newPage();
const page2 = await context2.newPage();

const loginPage = new LoginPage(page);
await loginPage.open();
await loginPage.login(testData.user.email, testData.user.password);

const loginPage2 = new LoginPage(page2);
await loginPage2.open();
await loginPage2.login(testData.user.email, testData.user.password);

})