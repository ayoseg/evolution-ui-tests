import { Page, expect } from '@playwright/test'
import {WorkOrderNewDocumentPage} from "./WorkOrderNewDocumentPage";


export class WorkOrderPage {
    constructor(private page: Page) {}
    public buildingInput = this.page.locator('#ctl00_ctl00_contentPlaceHolderRoot_TaskSelectorsPlaceHolder_ctl00_autoCompleteBuilding_comboBox_Input');
    public locationInput = this.page.locator('#ctl00_ctl00_contentPlaceHolderRoot_TaskSelectorsPlaceHolder_ctl00_autoCompleteLocation_comboBox_Input');
    public problemInput = this.page.locator('#ctl00_ctl00_contentPlaceHolderRoot_TaskSelectorsPlaceHolder_ctl00_autoCompleteProblem_comboBox_Input');
    public sourceInput = this.page.locator('#ctl00_ctl00_contentPlaceHolderRoot_contentPlaceHolder_F_TASKSEditor_ctl00_autoCompleteCallerSource_comboBox_Input');
    public userDefineInput = this.page.locator('#ctl00_ctl00_contentPlaceHolderRoot_contentPlaceHolder_F_TASKSEditor_ctl00_autoCompleteUserDefined_comboBox_Input');
    public labelDisplayText = this.page.locator('input[name="ctl00$ctl00$detailHeaderPlaceHolder$labelDisplayText"]');
    public saveTaskButton = this.page.locator('input[value="Save Task"]')
    public saveButton = this.page.locator('span[class="x-button x-button-text"]')
    public duplicateWOModal = this.page.locator('#ctl00_ctl00_ctl31_container')
    public processSpinner = this.page.locator('#ctl00_ctl00_updateProgress')
    public resourceProcessSpinner = this.page.locator('#ctl00_ctl00_contentPlaceHolderRoot_contentPlaceHolder_F_TASKSEditor_ctl00_fsiGridTaskResourcesCombinedUpdateProgress')
    public woDocumentNavLink = this.page.locator('a[title="Documents"]').first()
    public woResourceLink = this.page.locator('a[title="Resource"]').first()
    public refesh = this.page.locator('#ctl00_ctl00_ToolbarEx_Refresh .icon')
    public status = this.page.locator('#ctl00_ctl00_detailHeaderPlaceHolder_labelPageAdditionalInfo').first()
    public woDocumentTable = this.page.locator('#ctl00_ctl00_contentPlaceHolderRoot_contentPlaceHolder_editorDocumentAssignment_ctl00_gridDocumentAssignment_innerGrid_ctl00__0>td')
    public woLogNotesTable = this.page.locator('#ctl00_ctl00_contentPlaceHolderRoot_contentPlaceHolder_F_TASKSEditor_ctl00_fsiGridEvents_innerGrid_ctl00__2>td')


    async checkWOStatusAndLogNotes(status: string, lognoteText: string) {
        await this.page.getByText("General").first().click()
        await this.woResourceLink.click()
        await expect(this.resourceProcessSpinner).toHaveCount(0)
        await this.page.getByText("Lognotes").first().click()
        await this.refesh.click()
        await this.refesh.click()
        await expect(this.status).toContainText(status)
        await expect(this.woLogNotesTable.nth(1)).toHaveText(lognoteText)
        await this.page.close()
    }

    async uploadWODocument(workOrderId: string, _class: string, repository: string, fileName: string) {
        await this.woDocumentNavLink.click()
        const [newDocPage] = await Promise.all([
            this.page.waitForEvent('popup'),
            await this.page.getByText("New").first().click()
        ])
        const workOrderNewDocumentPage  = new WorkOrderNewDocumentPage(newDocPage)
        await workOrderNewDocumentPage.docRefInput.fill(workOrderId)
        await workOrderNewDocumentPage.classInput.fill(_class.split(" ")[0])
        await newDocPage.getByText(_class).click()
        await workOrderNewDocumentPage.repositoryInput.fill(repository.split(" ")[0])
        await newDocPage.getByText(repository).click()
        await workOrderNewDocumentPage.fileInput.setInputFiles(fileName)
        await newDocPage.getByText("Save and Close").click()
    }

    async checkForUploadedDocument(documentText: string) {
        await expect(this.woDocumentTable.nth(4)).toContainText('Document')
        await this.page.close()
    }

}
