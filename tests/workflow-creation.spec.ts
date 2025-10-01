import { expect } from '@playwright/test'
import { test } from '../fixtures/wom.fixtures'
import '../playwright.config'
import {WorkOrderPage} from "../page-object/WorkOrderPage";

test.beforeEach(async ({ loginPage}) => {
    await loginPage.navigate();
    await loginPage.login(process.env.Username, process.env.Password)

});
test('1-Work Order is created', async ({  homePage }) => {
    const workOrderObj = await homePage.createNewWorkOrder(
        "620159 - Kendal Kentmere House",
        "1 - First Floor - 620159-011",
        "Panic Alarm Activation - Emergency Response - P&R Required",
        //"1 - Cleaners - 620159-012",
        //"CCTV Image Request - Cat 1 - Police",
        "Email - DWP",
        "MINOR"
    )

    await homePage.closeWindow(workOrderObj.page)
    await homePage.searchForWorkOrderById("WO", workOrderObj.workOrderId)
    await expect(homePage.woSearchResultWORowData.nth(4)).toContainText('ASSIGNED')

    await homePage.searchForWorkOrderById("LN", workOrderObj.workOrderId)
    await expect(homePage.lnTableData.nth(1)).toContainText(workOrderObj.workOrderId)
    await expect(homePage.lnTableData.nth(4)).toContainText('Work Order Created')

});
test('2-Work Order is created and document uploaded', async ({  homePage }) => {
    const workOrderObj = await homePage.createNewWorkOrder(
        "620159 - Kendal Kentmere House",
        "1 - First Floor - 620159-011",
        "Panic Alarm Activation - Emergency Response - P&R Required",
        //"1 - Cleaners - 620159-012",
        //"CCTV Image Request - Cat 1 - Police",
        "Email - DWP",
        "MINOR"
    )

    await homePage.uploadWODocument(
        workOrderObj.page,
        workOrderObj.workOrderId,
        "Completion Certificates",
        "Mitie FM (Manned Guarding)",
        "fixtures/files/25 Advanced Guitar Chords.pdf"
    )

    await expect(new WorkOrderPage(workOrderObj.page).woDocumentTable.nth(4)).toContainText('Document')
    await homePage.closeWindow(workOrderObj.page)
});

