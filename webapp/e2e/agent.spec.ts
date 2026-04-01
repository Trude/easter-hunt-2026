import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/agent');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test.describe('Agent-hub', () => {
  test('viser 6 gruppe-kort', async ({ page }) => {
    // 6 knapper for grupper (ekskl. reset-knapp)
    const groupButtons = page.locator('button[class*="w-full text-left"]');
    await expect(groupButtons).toHaveCount(6);
  });

  test('gruppe 1 er aktiv (første er ikke låst)', async ({ page }) => {
    // Første gruppe-knapp skal ha animate-pulse (aktiv)
    const firstGroup = page.locator('button[class*="w-full text-left"]').first();
    await expect(firstGroup).not.toBeDisabled();
  });

  test('gruppe 2–6 er låst til gruppe 1 er fullført', async ({ page }) => {
    const groupButtons = page.locator('button[class*="w-full text-left"]');
    // Sjekk at gruppe 2–6 er disabled
    for (let i = 1; i < 6; i++) {
      await expect(groupButtons.nth(i)).toBeDisabled();
    }
  });

  test('viser "0/6 arkivmapper dekryptert" ved start', async ({ page }) => {
    await expect(page.locator('text=0/6 arkivmapper dekryptert')).toBeVisible();
  });

  test('etter at gruppe 1 er fullført vises 1/6 og gruppe 2 er aktiv', async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem('svein_dept_1_complete', 'true');
    });
    await page.reload();
    await expect(page.locator('text=1/6 arkivmapper dekryptert')).toBeVisible();

    const groupButtons = page.locator('button[class*="w-full text-left"]');
    // Gruppe 1 er ferdig, gruppe 2 er neste (aktiv)
    await expect(groupButtons.nth(0)).not.toBeDisabled(); // done = ikke disabled
    await expect(groupButtons.nth(1)).not.toBeDisabled(); // active = ikke disabled
    await expect(groupButtons.nth(2)).toBeDisabled(); // locked
  });

  test('bokstav-indikator viser ? for ikke-fullført gruppe', async ({ page }) => {
    // Sjekk at første bokstav-indikator viser '?'
    await expect(page.locator('text=?').first()).toBeVisible();
  });

  test('bokstav avsløres når gruppe er fullført', async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem('svein_dept_1_complete', 'true');
    });
    await page.reload();
    // Første bokstav 'O' skal nå vises
    const letterIndicators = page.locator('.flex.gap-2.justify-center > div span');
    await expect(letterIndicators.first()).toHaveText('O');
  });

  test('alle 6 fullført viser ONKELS og ferdig-skjerm', async ({ page }) => {
    await page.evaluate(() => {
      for (let i = 1; i <= 6; i++) {
        localStorage.setItem(`svein_dept_${i}_complete`, 'true');
      }
    });
    await page.reload();
    await expect(page.locator('text=ONKELS').first()).toBeVisible();
    await expect(page.locator('text=DEKRYPTERT')).toBeVisible();
  });

  test('klikk på aktiv gruppe navigerer til /agent/gruppe/1', async ({ page }) => {
    const firstGroup = page.locator('button[class*="w-full text-left"]').first();
    await firstGroup.click();
    await expect(page).toHaveURL('/agent/gruppe/1');
  });
});

test.describe('AgentGroup — trivia', () => {
  test('viser spørsmål for gruppe 1', async ({ page }) => {
    await page.goto('/agent/gruppe/1');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    // Bruk first() for å unngå strict mode-feil (heading + intro-tekst matcher begge)
    await expect(page.locator('text=ARKIVMAPPE #1').first()).toBeVisible();
    await expect(page.locator('text=1/5').first()).toBeVisible();
  });

  test('feil svar viser rødt, korrekt svar viser grønt (multiple-choice)', async ({ page }) => {
    await page.goto('/agent/gruppe/1');
    await page.evaluate(() => localStorage.clear());
    await page.reload();

    // Svar feil — velg 1973 (feil svar, riktig er 1977)
    await page.click('button:has-text("1973")');
    // Feil svar skal gi rød border
    await expect(page.locator('button:has-text("1973")')).toHaveClass(/border-red-600/);
  });

  test('riktig svar viser grønt (multiple-choice)', async ({ page }) => {
    await page.goto('/agent/gruppe/1');
    await page.evaluate(() => localStorage.clear());
    await page.reload();

    // Svar riktig — velg 1977
    await page.click('button:has-text("1977")');
    await expect(page.locator('button:has-text("1977")')).toHaveClass(/border-mc-green/);
  });

  test('AVVIST-skjerm vises med < 4 riktige svar', async ({ page }) => {
    // Bruk gruppe 1 (alle multiple-choice) — svar feil på alle ved å velge alternativ 0
    // Gruppe 1, spørsmål 1: riktig = '1977', alternativ 0 = '1973' (feil)
    // Gruppe 1, spørsmål 2: riktig = 'Steven Gerrard', alternativ 0 = 'Steven Gerrard' (riktig!)
    // Gruppe 1, spørsmål 3: riktig = 'The Kop', alternativ 0 = 'The Kop' (riktig!)
    // Vi trenger å velge feil alternativ (ikke siste alternativ er riktig for de fleste)
    // Strategi: for hvert spørsmål, klikk siste alternativ som ikke er riktig
    await page.goto('/agent/gruppe/1');
    await page.evaluate(() => localStorage.clear());
    await page.reload();

    // Svar feil på alle 5 ved å alltid velge siste alternativ (index 3)
    // Spørsmål 1: opt[3]='1984' (feil — riktig er 1977) ✓
    // Spørsmål 2: opt[3]='Vladimir Šmicer' (feil — riktig er Steven Gerrard) ✓
    // Spørsmål 3: opt[3]='The Reds End' (feil — riktig er The Kop) ✓
    // Spørsmål 4: opt[3]='Graeme Souness' (feil — riktig er Rafael Benítez) ✓
    // Spørsmål 5: opt[3]='"Liverpool FC"' (feil — riktig er "This Is Anfield") ✓
    for (let q = 0; q < 5; q++) {
      // Vent på at spørsmålsbokser er synlige
      await page.waitForSelector('button[class*="bg-black/30 border border-gray-600"]', { timeout: 5000 });
      const options = page.locator('button[class*="bg-black/30 border border-gray-600"]');
      const count = await options.count();
      if (count > 0) {
        await options.nth(count - 1).click();
      }
      // Vent på animasjon (1500ms delay i koden)
      await page.waitForTimeout(1700);
    }

    await expect(page.locator('text=AVVIST')).toBeVisible({ timeout: 8000 });
    await expect(page.locator('button:has-text("PRØV IGJEN")')).toBeVisible();
  });

  test('bokstav avsløres etter 4/5 riktige — pre-sett via localStorage', async ({ page }) => {
    // Pre-sett gruppe 1 som fullført via localStorage
    await page.evaluate(() => {
      localStorage.setItem('svein_dept_1_complete', 'true');
    });
    await page.goto('/agent/gruppe/1');
    // Skal vise allerede-dekryptert skjerm med bokstav O
    await expect(page.locator('text=MAPPE #1 ALLEREDE DEKRYPTERT')).toBeVisible();
    await expect(page.locator('text=O').first()).toBeVisible();
  });

  test('PRØV IGJEN nullstiller tilstand', async ({ page }) => {
    await page.goto('/agent/gruppe/1');
    await page.evaluate(() => localStorage.clear());
    await page.reload();

    // Svar feil på alle 5 ved å alltid velge siste alternativ
    for (let q = 0; q < 5; q++) {
      await page.waitForSelector('button[class*="bg-black/30 border border-gray-600"]', { timeout: 5000 });
      const options = page.locator('button[class*="bg-black/30 border border-gray-600"]');
      const count = await options.count();
      if (count > 0) await options.nth(count - 1).click();
      await page.waitForTimeout(1700);
    }

    await page.locator('button:has-text("PRØV IGJEN")').click({ timeout: 8000 });
    // Skal komme tilbake til spørsmål 1
    await expect(page.locator('text=1/5').first()).toBeVisible();
    await expect(page.locator('text=AVVIST')).not.toBeVisible();
  });

  test('ukjent gruppe-ID viser feilmelding', async ({ page }) => {
    await page.goto('/agent/gruppe/999');
    await expect(page.locator('text=Ukjent gruppe')).toBeVisible();
  });
});
