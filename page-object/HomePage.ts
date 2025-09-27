import {expect, Page} from '@playwright/test'

export function setNWOFieldLocator(page) {
    let buildingInput = page.locator('input[name="ctl00$ctl00$contentPlaceHolderRoot$TaskSelectorsPlaceHolder$ctl00$autoCompleteBuilding$comboBox"]');
    let locationInput = page.locator('input[name="ctl00$ctl00$contentPlaceHolderRoot$TaskSelectorsPlaceHolder$ctl00$autoCompleteLocation$comboBox"]');
    let problemInput = page.locator('input[name="ctl00$ctl00$contentPlaceHolderRoot$TaskSelectorsPlaceHolder$ctl00$autoCompleteProblem$comboBox"]');
    let sourceInput = page.locator('input[name="ctl00$ctl00$contentPlaceHolderRoot$contentPlaceHolder$F_TASKSEditor$ctl00$autoCompleteCallerSource$comboBox"]');
    let userDefineInput = page.locator('input[id="ctl00_ctl00_contentPlaceHolderRoot_contentPlaceHolder_F_TASKSEditor_ctl00_autoCompleteUserDefined_comboBox_Input"]');
    let labelDisplayText = page.locator('input[name="ctl00$ctl00$detailHeaderPlaceHolder$labelDisplayText"]');
    let saveTaskButton = page.locator('input[value="Save Task"]')
    let saveDropButton = page.locator('div[class="x-button x-button-drop"]')


    return {
        buildingInput: buildingInput,
        locationInput: locationInput,
        problemInput: problemInput,
        sourceInput: sourceInput,
        userDefineInput: userDefineInput,
        labelDisplayText: labelDisplayText,
        saveTaskButton: saveTaskButton,
        saveDropButton: saveDropButton
    }
}

export class HomePage {
    constructor(private page: Page) {}


    public wom = this.page.locator('a[title="Work Order Management"]');
    public helpDesk = this.page.locator('a[title="HelpDesk"]');
    public workOrders = this.page.locator('div[id="ctl00_FsiNavigator1_ctl106"] a[title="Work Orders"]');
    public newWorkOrders = this.page.locator('span[class="x-button x-button-text RightFloat"]');
    public worKOrderIDField = this.page.locator('input[name="ctl00$contentPlaceHolder$fsiGridTasks$innerGrid$ctl00$ctl02$ctl02$ctl01$listF_TASKS_TA_TASK_ID_3"]')
    public woSearchResultRowData = this.page.locator('#ctl00_contentPlaceHolder_fsiGridTasks_innerGrid_ctl00__0>td')
    public processSpinner = this.page.locator('#ctl00_contentPlaceHolder_fsiGridTasksUpdateProgress .progressPanel span')

    async selectPopUp() {
        this.page.on('dialog', async dialog => {
            console.log(dialog.message());
            await dialog.accept();
        });
    }
    async createNewWorkOrder(building, location, problem, source, userDefine) {
        await this.wom.click();
        await this.workOrders.click();
        const [nwoPage] = await Promise.all([
            this.page.waitForEvent('popup'),
            await this.newWorkOrders.click()
        ])

        const title = await nwoPage.title()
        expect(title).toBe('New Entity')
        const newOrderPageObjs = setNWOFieldLocator(nwoPage)
        await newOrderPageObjs.buildingInput.fill(building.split(" ")[0])
        await nwoPage.getByText(building).click()
        await newOrderPageObjs.locationInput.fill(location.split(" ")[0])
        await nwoPage.getByText(location).click()
        await newOrderPageObjs.problemInput.fill(problem.split(" ")[0])
        await nwoPage.getByText(problem).click()
        await newOrderPageObjs.sourceInput.fill(source)
        await nwoPage.getByText(source).click()
        await newOrderPageObjs.userDefineInput.click()
        await nwoPage.getByText(userDefine).click()
        await newOrderPageObjs.saveDropButton.click()
        await nwoPage.getByText("Save and Close").click()
        await newOrderPageObjs.saveTaskButton.click()
        let workOrderId = await newOrderPageObjs.labelDisplayText.getAttribute("value")
        console.log(".......................... " + workOrderId)
        await nwoPage.close()
        return workOrderId.split(" ")[0]
    }

    async searchForWorkOrderById(workOrderId) {
        this.worKOrderIDField.fill(workOrderId)
        this.page.getByText(workOrderId).click()
    }
}
