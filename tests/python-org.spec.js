// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('python.org', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('главная страница содержит ожидаемые тексты', async ({ page }) => {
    await expect(page).toHaveTitle('Welcome to Python.org');

    const widgetTitles = page.locator('h2.widget-title');
    await expect(widgetTitles.filter({ hasText: 'Get Started' })).toBeVisible();
    await expect(widgetTitles.filter({ hasText: 'Download' })).toBeVisible();
    await expect(widgetTitles.filter({ hasText: 'Docs' })).toBeVisible();
    await expect(widgetTitles.filter({ hasText: 'Jobs' })).toBeVisible();
  });

  test('поиск по сайту через форму возвращает результаты', async ({ page }) => {
    const searchField = page.locator('#id-search-field');
    await expect(searchField).toBeVisible();

    await searchField.fill('decorator');
    await expect(searchField).toHaveValue('decorator');
    await page.locator('#submit').click();

    await expect(page).toHaveURL(/\/search\/\?q=decorator/);
    await expect(page.getByRole('heading', { name: 'Search Python.org' })).toBeVisible();

    const results = page.locator('ul.list-recent-events > li');
    await expect(results.first()).toBeVisible();
    expect(await results.count()).toBeGreaterThan(0);
  });

  test('переход на страницу Downloads через главное меню', async ({ page }) => {
    await page.locator('#mainnav #downloads > a').click();

    await expect(page).toHaveURL(/\/downloads\/$/);
    await expect(page).toHaveTitle('Download Python | Python.org');
    await expect(
      page.getByRole('heading', { name: /Download the latest version for/ }).first()
    ).toBeVisible();
  });
});
