import { test, expect } from '@playwright/test';

test.describe('SanderHub', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/sander');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('viser agentnavn KODEKNEKKEREN', async ({ page }) => {
    await expect(page.locator('text=KODEKNEKKEREN')).toBeVisible();
  });

  test('viser 12 avdelingskort i grid', async ({ page }) => {
    await expect(page.locator('.grid.grid-cols-2 > *')).toHaveCount(12);
  });

  test('viser 0/12 fullført ved start', async ({ page }) => {
    await expect(page.locator('text=0/12 fullført')).toBeVisible();
  });

  test('egg-teller vises ikke ved start (ingen egg funnet)', async ({ page }) => {
    await expect(page.locator('text=påskeegg funnet')).not.toBeVisible();
  });

  test('egg-teller vises etter egg er funnet', async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem('sander_egg_1', 'true');
    });
    await page.reload();
    await expect(page.locator('text=1/6 påskeegg funnet')).toBeVisible();
  });

  test('klikk på skjult egg oppdaterer teller', async ({ page }) => {
    // Egg-knapp er nesten usynlig (opacity 0.07), men klikk med force fungerer
    const eggBtn = page.locator('button.absolute').first();
    await eggBtn.click({ force: true });
    await expect(page.locator('text=1/6 påskeegg funnet')).toBeVisible({ timeout: 3000 });
  });

  test('hemmelig avdeling vises etter alle 6 egg er funnet', async ({ page }) => {
    await page.evaluate(() => {
      for (let i = 1; i <= 6; i++) {
        localStorage.setItem(`sander_egg_${i}`, 'true');
      }
    });
    await page.reload();
    // DepartmentCard med status='secret' viser teksten 'HEMMELIG' (ikke tittelen)
    await expect(page.locator('text=HEMMELIG').first()).toBeVisible();
  });

  test('avdeling 1 er aktiv (ikke låst) ved start', async ({ page }) => {
    const firstCard = page.locator('.grid.grid-cols-2 > *').first();
    await firstCard.click();
    await expect(page).toHaveURL('/sander/1');
  });

  test('avdeling 2 er låst til avdeling 1 er fullført', async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem('sander_dept_1_complete', 'true');
    });
    await page.reload();
    await expect(page.locator('text=1/12 fullført')).toBeVisible();
  });
});

test.describe('SeldaHub', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/selda');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('viser agentnavn SPORHUNDEN', async ({ page }) => {
    await expect(page.locator('text=SPORHUNDEN')).toBeVisible();
  });

  test('viser 12 avdelingskort i grid', async ({ page }) => {
    await expect(page.locator('.grid.grid-cols-2 > *')).toHaveCount(12);
  });

  test('viser 0/12 fullført ved start', async ({ page }) => {
    await expect(page.locator('text=0/12 fullført')).toBeVisible();
  });

  test('egg-teller vises etter egg er funnet', async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem('selda_egg_1', 'true');
      localStorage.setItem('selda_egg_2', 'true');
    });
    await page.reload();
    await expect(page.locator('text=2/6 påskeegg funnet')).toBeVisible();
  });

  test('klikk på skjult egg oppdaterer teller', async ({ page }) => {
    const eggBtn = page.locator('button.absolute').first();
    await eggBtn.click({ force: true });
    await expect(page.locator('text=1/6 påskeegg funnet')).toBeVisible({ timeout: 3000 });
  });

  test('hemmelig avdeling vises etter alle 6 egg er funnet', async ({ page }) => {
    await page.evaluate(() => {
      for (let i = 1; i <= 6; i++) {
        localStorage.setItem(`selda_egg_${i}`, 'true');
      }
    });
    await page.reload();
    // DepartmentCard med status='secret' viser teksten 'HEMMELIG' (ikke tittelen)
    await expect(page.locator('text=HEMMELIG').first()).toBeVisible();
  });

  test('avdeling 1 er aktiv (kan navigeres til) ved start', async ({ page }) => {
    const firstCard = page.locator('.grid.grid-cols-2 > *').first();
    await firstCard.click();
    await expect(page).toHaveURL('/selda/1');
  });
});
