import {expect, Page} from '@playwright/test'
import { WorkOrderPage } from "./WorkOrderPage";
import {WorkOrderNewDocumentPage} from "./WorkOrderNewDocumentPage";

export class HomePage {
    constructor(private page: Page) {}


    public wom = this.page.locator('a[title="Work Order Management"]');
    public helpDesk = this.page.locator('a[title="HelpDesk"]');
    public workOrders = this.page.locator('div[id="ctl00_FsiNavigator1_ctl106"] a[title="Work Orders"]');
    public newWorkOrders = this.page.locator('span[class="x-button x-button-text RightFloat"]');
    public workOrderIdWOSearchField = this.page.locator('input[name="ctl00$contentPlaceHolder$fsiGridTasks$innerGrid$ctl00$ctl02$ctl02$ctl01$listF_TASKS_TA_TASK_ID_3"]')
    public woSearchResultWORowData = this.page.locator('#ctl00_contentPlaceHolder_fsiGridTasks_innerGrid_ctl00__0>td')
    public woSearchResultLNRowData = this.page.locator('#ctl00_F_EVENTS_userControl_EntitiesGrid_973_innerGrid_ctl00__0>td')
    public woProcessSpinner = this.page.locator('#ctl00_contentPlaceHolder_fsiGridTasksUpdateProgress .progressPanel span')
    public lnProcessSpinner = this.page.locator('#ctl00_F_EVENTS_userControl_EntitiesGrid_973UpdateProgress .progressPanel span')
    public lnWorkOrderLoading = this.page.locator('#ctl00_F_EVENTS_userControl_EntitiesGrid_973_innerGrid_ctl00_ctl02_ctl02_ctl01_autoF_EVENTS_EV_FKEY_TA_SEQ_2_comboBox_LoadingDiv')

    public workOrderIdLNSearchField = this.page.locator('#ctl00_F_EVENTS_userControl_EntitiesGrid_973_innerGrid_ctl00_ctl02_ctl02_ctl01_autoF_EVENTS_EV_FKEY_TA_SEQ_2_comboBox_Input')
    public lnTableData = this.page.locator("#ctl00_F_EVENTS_userControl_EntitiesGrid_973_innerGrid_ctl00 tbody>tr:nth-child(1)>td")

    async selectPopUp() {
        this.page.on('dialog', async dialog => {
            console.log(dialog.message());
            await dialog.accept();
        });
    }
    async createNewWorkOrder(building: string, location: string, problem: string, source: string, userDefine: string) {
        await this.wom.click();
        await this.workOrders.click();
        const [nwoPage] = await Promise.all([
            this.page.waitForEvent('popup'),
            await this.newWorkOrders.click()
        ])

        const title = await nwoPage.title()
        expect(title).toBe('New Entity')
        const workOrderPage = new WorkOrderPage(nwoPage)
        await workOrderPage.buildingInput.fill(building.split(" ")[0])
        await nwoPage.getByText(building).first().click()
        await workOrderPage.locationInput.fill(location.split(" ")[0])
        await nwoPage.getByText(location).first().click()
        await workOrderPage.problemInput.fill(problem.split(" ")[0])
        await nwoPage.getByText(problem).first().click()
        await workOrderPage.sourceInput.fill(source)
        await nwoPage.getByText(source).click()
        await workOrderPage.userDefineInput.click()
        await nwoPage.getByText(userDefine).click()
        await workOrderPage.saveButton.click()

        let woSpinnerStyleText: string | null
        do
        {
            woSpinnerStyleText = await workOrderPage.processSpinner.getAttribute("style")
            //console.log("woSpinner Style value is " + woSpinnerStyleText );
        } while(!woSpinnerStyleText || !woSpinnerStyleText.includes("none"));

        let woModalStyleText = await workOrderPage.duplicateWOModal.getAttribute("style")
        console.log("woModal Style value is " + woModalStyleText)
        if (!woModalStyleText || !woModalStyleText.includes("display:"))
        {
            await workOrderPage.saveTaskButton.click()
        }
        let workOrderId = await workOrderPage.labelDisplayText.getAttribute("value")
        console.log(".......................... " + workOrderId)
        return {
            page: nwoPage,
            workOrderId: workOrderId
        }
    }

    async uploadWODocument(page: Page, workOrderId: string, _class: string, repository: string, fileName: string) {
        const workOrderPage = new WorkOrderPage(page)
        await workOrderPage.woDocumentNavLink.click()
        const [newDocPage] = await Promise.all([
            page.waitForEvent('popup'),
            await page.getByText("New").first().click()
        ])
        const workOrderNewDocumentPage  = new WorkOrderNewDocumentPage(newDocPage)
        await workOrderNewDocumentPage.docRefInput.fill(workOrderId)
        await workOrderNewDocumentPage.classInput.fill(_class.split(" ")[0])
        await newDocPage.getByText(_class).click()
        await workOrderNewDocumentPage.repositoryInput.fill(repository.split(" ")[0])
        await newDocPage.getByText(repository).click()
        await workOrderNewDocumentPage.fileInput.setInputFiles(fileName)
        console.log(".............................................. Page 1 " + page.url());
        await newDocPage.getByText("Save and Close").click()
    }

    async closeWindow(page: Page){
        await page.close()
    }

    async clickLognoteTab(){
        await this.page.getByText("Lognotes").first().click()
    }

    async searchForWorkOrderById(tabName: string, workOrderId: string | null) {
        await this.page.waitForLoadState()
        let workOrderIdSubString = workOrderId!.split(" ")[0]
        if (tabName === "WO") {
            await expect(this.woProcessSpinner).toHaveCount(0)
            await this.workOrderIdWOSearchField.fill(workOrderIdSubString)
            await this.page.getByText(workOrderIdSubString).click()
        } else if (tabName === "LN") {
            await this.clickLognoteTab()
            let tableDataText
            do
            {
                tableDataText = await this.lnTableData.nth(4).innerText()
                console.log("Waiting for spinner to disappear" );
            } while(tableDataText.length < 2);
            await this.workOrderIdLNSearchField.fill(workOrderIdSubString)
            await this.page.getByText(workOrderId!).click()
        }

    }
}
