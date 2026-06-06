import { Page, Locator } from '@playwright/test';

export class CheckBox {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get checkBox(): Locator {
    return this.page.locator('[role="treeitem"] .rc-tree-checkbox');
  }

  get radioButton(): Locator {
    return this.page
      .locator('[href="/radio-button"]')
      .getByText('Radio Button');
  }

  get impressiveRadioButton(): Locator {
    return this.page.locator('#impressiveRadio');
  }
}
