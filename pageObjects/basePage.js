import { Page } from '@playwright/test';

export class BasePage {
    /**
     * @param {Page} page
     */
    constructor(page) {
        this.page = page;
    }
}

export { Page, expect } from '@playwright/test';