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
        null,
        null,
        null,
        "620159 - Kendal Kentmere House",
        "1 - First Floor - 620159-011",
        "Panic Alarm Activation - Emergency Response - P&R Required",
        null,
        "Email - DWP",
        "MINOR"
    )
    const workOrderPage = new WorkOrderPage(workOrderObj.page)
    await workOrderPage.checkWOStatusAndLogNotes('ASSIGNED', 'Work Order Created')
});

test('2-Work Order is created and document uploaded', async ({  homePage }) => {
    const workOrderObj = await homePage.createNewWorkOrder(
        null,
        null,
        null,
        "620159 - Kendal Kentmere House",
        "1 - First Floor - 620159-011",
        "Panic Alarm Activation - Emergency Response - P&R Required",
        null,
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

for(let i = 1; i < 6; i++) {
    test(`3-Manned Guarding- AFP Review / CMT Post WO Completion Audit - ${i}`, async ({homePage}) => {
        const workOrderObj = await homePage.createNewWorkOrder(
            "Test",
            "Test",
            "Test",
            "620380 - Chelmsley Wood JCP",
            "0 - Whole Building - 620380-000",
            "In Hours Additional Guard - DWP Request",
            "***TEST - -- WO Created to prove the SCC API -- TEST***",
            "Email - DWP",
            "MINOR"
        )
        const workOrderPage = new WorkOrderPage(workOrderObj.page)
        // const page = await homePage.openExistingWorkOrder("MSS:416")
        // const workOrderPage = new WorkOrderPage(page)
        await workOrderPage.checkWorkOrderCompletionTest(
            workOrderObj.workOrderId!,
            "KBR Incidents Mailbox",
            "120",
            "20",
            "120",
            "20",
            "All Estimated Costs Provided")
        console.log("Status is ............................. " + i + " " + await workOrderPage.woStatusInput.getAttribute("value"))
        if( i == 10 ) {
            await expect(workOrderPage.woStatusInput).toHaveValue("CMT Post WO Completion Audit")
        } else {
            await expect(workOrderPage.woStatusInput).toHaveValue("AFP Review")
        }
        //await workOrderPage.checkWOStatusAndLogNotes('ASSIGNED', 'Work Order Created')
    });
}

[
    { actLabour: "120", actMaterial: "20", expected: "AFP Review"},
    { actLabour: "108", actMaterial: "18", expected: "AFP Review"},
    { actLabour: "132", actMaterial: "22", expected: "CMT Post WO Completion Audit"}
].forEach(({actLabour, actMaterial, expected}) => {
    test(`4-Manned Guarding- AFP Review / CMT Post WO Completion Audit - ${actLabour}`, async ({homePage}) => {
        const workOrderObj = await homePage.createNewWorkOrder(
            "Test",
            "Test",
            "Test",
            "620380 - Chelmsley Wood JCP",
            "0 - Whole Building - 620380-000",
            "In Hours Additional Guard - DWP Request",
            "***TEST - -- WO Created to prove the SCC API -- TEST***",
            "Email - DWP",
            "MINOR"
        )
        const workOrderPage = new WorkOrderPage(workOrderObj.page)
        await workOrderPage.checkWorkOrderCompletionTest(
            workOrderObj.workOrderId!,
            "KBR Incidents Mailbox",
            "120",
            "20",
            `${actLabour}`,
            `${actMaterial}`,
            "All Estimated Costs Provided")
        console.log("Status is .............................  " + await workOrderPage.woStatusInput.getAttribute("value"))
        await expect(workOrderPage.woStatusInput).toHaveValue(`${expected}`)
    });
});

//AFP Review

//CMT Post WO Completion Audit
