import fs from 'fs';
import { test, expect } from '@playwright/test';

import { CheckBox } from '../page/checkBox.ts';

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(
    page.getByRole('heading', { name: 'Installation' }),
  ).toBeVisible();
});

test('Create Account', async ({ page }) => {
  // Step-1: Go to the login page and click on thre Join Real button
  await page.goto('https://bolt.playrealbrokerage.com/login');
  await page.getByText('Join Real').click();
  // Expected: Verify the agent-signup page is visible.
  await expect(page).toHaveURL(/agent-signup/);

  // Step-2: Fill the first name/ last name/ username/ email/ password and confirm password filed and click on the checkbox.
  await page.getByTestId('text-input-First Name').fill('surajit');
  await page.getByTestId('text-input-Last Name').fill('Maity');
  await page.getByTestId('text-input-Username').fill('maitysurajit');
  await page
    .getByTestId('email-input-Email')
    .fill('maitysurajit17035@gmail.com');
  await page.getByTestId('password-input-Password').fill('Asdfasdf@1234');
  await page
    .getByTestId('password-input-Password Confirmation')
    .fill('Asdfasdf@1234');

  const termsCheckbox = page.locator('[data-testid="consentedToTerms"]');
  const consentedToCallCheckbox = page.locator(
    '[data-testid="consentedToCallMessage"]',
  );
  await termsCheckbox.click();
  await consentedToCallCheckbox.click();
  // Expected: Verify the checkboxex are checked
  await expect(termsCheckbox).toBeChecked();
  await expect(consentedToCallCheckbox).toBeChecked();

  // Step-3: click on the Create Account button
  await page.getByRole('button', { name: 'Create Account' }).click();
  // Expected: Verify user is created successfully and logout button is displayed.
  await expect(page).toHaveURL(/agent-onboarding/);
  await expect(page.getByText('Logout')).toBeVisible();
});

test('ecommerce e2e testing', async ({ page, context }) => {
  await page.goto('https://demo.nopcommerce.com/');
  const product = await page.locator('.product-item').first();
  await product.scrollIntoViewIfNeeded();
  const addToCart = await product.locator('.Add to cart');
  const price = await product.locator('.price.actual-price');

  await expect(price.textContent()).toContain('$1,200.00');

  await addToCart.click();

  await expect(page).toHaveURL(
    'https://demo.nopcommerce.com/build-your-own-computer',
  );

  await expect(page.locator('#price-value-1')).toHaveText('$1,200.00');

  const [newPgae] = await Promise.all([
    context.waitForEvent('page'),
    page.locator('.click').click(),
  ]);
});

test('file upload and download', async ({ page }) => {
  await page.goto('https://demoqa.com/upload-download');
  await page.locator('#uploadFile').setInputFiles('test-data/banner.png');
  await expect(page.locator('#uploadedFilePath')).toHaveText(/banner.png/);
  await page.waitForTimeout(5000);
});

test('Verify the sample file is downloaded successfully', async ({ page }) => {
  await page.goto('https://demoqa.com/upload-download');

  const filePath = 'test-data/sampleFile.jpeg';

  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: 'Download' }).click(),
  ]);

  await download.saveAs(filePath);
  await page.waitForTimeout(5000);

  expect(fs.existsSync(filePath)).toBeTruthy();

  fs.unlinkSync(filePath);
});

test('Intercept css n/w request', async ({ page }) => {
  await page.route(
    'https://demoqa.com/assets/index-pe2EUVKA.css',
    async (route, request) => {
      console.log('Intercept url - ', request.url());
      await route.continue();
    },
  );
  await page.goto('https://demoqa.com/upload-download');

  await page.waitForTimeout(5000);
});

test('verify the dropdown', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/dropdown');
  const options = await page.locator('//select[@id="dropdown"]/option');

  await expect(options).toHaveCount(3);
});

test('verify the checkbox and radio button', async ({ page }) => {
  const cb = new CheckBox(page);

  await page.goto('https://demoqa.com/checkbox');
  await expect(cb.checkBox).not.toBeChecked();

  await cb.checkBox.click();
  await expect(cb.checkBox).toBeChecked();

  await cb.radioButton.click();
  await expect(cb.impressiveRadioButton).not.toBeChecked();

  await cb.impressiveRadioButton.click();
  await expect(cb.impressiveRadioButton).toBeChecked();
});

test('verify the images/Toolsqa.jpg is loaded successfully', async ({
  page,
}) => {
  await page.goto('https://jsonplaceholder.typicode.com/');
  await page.locator('#run-button').scrollIntoViewIfNeeded();

  await Promise.all([
    page.waitForResponse(
      (res) =>
        res.url() === 'https://jsonplaceholder.typicode.com/todos/1' &&
        res.status() === 200,
    ),
    page.locator('#run-button').click(),
  ]);

  await expect(page.locator('#run-message')).toHaveText(
    "Congrats! You've made your first call to JSONPlaceholder. 😃 🎉",
  );
});

test('capture all network request', async ({ page }) => {
  page.on('request', (request) => {
    console.log(`>> Request: ${request.method()} ${request.url()}`);
  });

  page.on('response', (res) => {
    console.log(`<< Response: ${res.status()} ${res.url()}`);
  });

  await page.goto('https://demoqa.com/upload-download');
});

test('multiple tab testing', async ({ page, context }) => {
  await page.goto('https://demo.automationtesting.in/Windows.html');
  const [newPage] = await Promise.all([
    context.waitForEvent('page'),
    page.getByRole('button', { name: 'click' }).click(),
  ]);

  console.log(await newPage.title());
  console.log(await newPage.url());
});

test('Keyboard mock test', async ({ page }) => {
  await page.goto('https://demoqa.com/text-box');
  await page.locator('#userName').click();
  await page.keyboard.type('Hello world');

  await page.locator('#userEmail').click();
  await page.keyboard.type('maitysurajit17035@gmail.com');

  await page.locator('#currentAddress').click();
  await page.keyboard.type(
    ' 605, Palladium Business Hub, Nr Vishwakarma Govt Engineering College, Visat Gandhinagar Highway, Motera, Ahmedabad, Gujarat 382424',
  );

  await page.locator('#permanentAddress').click();
  await page.keyboard.type(
    ' 605, Palladium Business Hub, Nr Vishwakarma Govt Engineering College, Visat Gandhinagar Highway, Motera, Ahmedabad, Gujarat 382424',
  );

  await page.keyboard.press('ArrowUp');
  await page.keyboard.press('ArrowUp');
  await page.keyboard.press('ArrowUp');
  await page.waitForTimeout(2000);
});

test('hover test', async ({ page }) => {
  await page.goto('https://testautomationpractice.blogspot.com/');
  const locationEle = await page.getByRole('button', { name: 'start' });

  await locationEle.hover();

  const drop = await page.locator('#comboBox');
  await drop.scrollIntoViewIfNeeded();
  await drop.click();
  await page.locator('#dropdown').getByText('Item 90').scrollIntoViewIfNeeded();
  await page.locator('#dropdown').getByText('Item 90').click();

  await page.waitForTimeout(2000);
});

test('orangehrmlive demo', async ({ page }) => {
  await page.goto(
    'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login',
  );
  await page.getByPlaceholder('Username').fill('Admin');
  await page.getByPlaceholder('Password').fill('admin123');

  await page.getByRole('button', { name: 'Login' }).click();

  await page.getByText('admin').click();
  // await page.getByText('.oxd-checkbox-input').nth(9).click();

  const row = await page.locator('.oxd-table-card');

  (await row.allTextContents()).find((ele) => {
    if (ele === 'pttest') {
      row.click();
    }
  });

  await page.waitForTimeout(2000);
});
