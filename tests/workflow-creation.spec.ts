import { expect } from '@playwright/test'
import { test } from '../fixtures/wom.fixtures'

test.beforeEach(async ({ loginPage}) => {
    await loginPage.navigate();
    await loginPage.login("AUTOTEST", "Autotest")

});
test('Work Order is created', async ({  homePage }) => {
    const workOrderId = await homePage.createNewWorkOrder(
        "620159 - Kendal Kentmere House",
        "1 - First Floor - 620159-011",
        "Panic Alarm Activation - Emergency Response - P&R Required",
        "Email - DWP",
        "MINOR"
    )

    await expect(homePage.processSpinner).toHaveCount(0)
    await homePage.searchForWorkOrderById(workOrderId)
    await expect(homePage.woSearchResultRowData.nth(4)).toContainText('ASSIGNED')
});


