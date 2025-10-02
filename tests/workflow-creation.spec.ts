import { expect } from '@playwright/test'
import { test } from '../fixtures/wom.fixtures'
import '../playwright.config'
import {WorkOrderPage} from "../page-object/WorkOrderPage";

test.beforeEach(async ({ loginPage}) => {
    await loginPage.navigate();
    if (!process.env.WPS_USERNAME || !process.env.WPS_PASSWORD) {
        throw new Error('Missing WPS_USERNAME or WPS_PASSWORD in .env file');
    }
    await loginPage.login(process.env.WPS_USERNAME, process.env.WPS_PASSWORD)

});
test('1-Work Order is created', async ({  homePage }) => {
    const workOrderObj = await homePage.createNewWorkOrder(
        "620159 - Kendal Kentmere House",
        "1 - First Floor - 620159-011",
        "Panic Alarm Activation - Emergency Response - P&R Required",
        "Email - DWP",
        "MINOR"
    )
    const workOrderPage = new WorkOrderPage(workOrderObj.page)
    await workOrderPage.checkWOStatusAndLogNotes('ASSIGNED', 'Work Order Created')
});

test('2-Work Order is created and document uploaded', async ({  homePage }) => {
    const workOrderObj = await homePage.createNewWorkOrder(
        "620159 - Kendal Kentmere House",
        "1 - First Floor - 620159-011",
        "Panic Alarm Activation - Emergency Response - P&R Required",
        "Email - DWP",
        "MINOR"
    )
    const workOrderPage = new WorkOrderPage(workOrderObj.page)
    await workOrderPage.uploadWODocument(
        workOrderObj.workOrderId!,
        "Completion Certificates",
        "Mitie FM (Manned Guarding)",
        "fixtures/files/25 Advanced Guitar Chords.pdf"
    )
    await workOrderPage.checkForUploadedDocument('Document')
});

