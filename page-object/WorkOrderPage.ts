import { Page, expect } from '@playwright/test'
import {WorkOrderNewDocumentPage} from "./WorkOrderNewDocumentPage";
import {IssuedQuotePage} from "./IssuedQuotePage"


export class WorkOrderPage {
    constructor(private page: Page) {}
    public reporterInput = this.page.locator('#ctl00_ctl00_contentPlaceHolderRoot_TaskSelectorsPlaceHolder_ctl00_autoCompleteReporter_comboBox_Input');
    public emailInput = this.page.locator('#ctl00_ctl00_contentPlaceHolderRoot_TaskSelectorsPlaceHolder_ctl00_txtMailto');
    public descriptionTextArea = this.page.locator('.textareaDescription');
    public phoneInput = this.page.locator('#ctl00_ctl00_contentPlaceHolderRoot_TaskSelectorsPlaceHolder_ctl00_txtPhone');
    public buildingInput = this.page.locator('#ctl00_ctl00_contentPlaceHolderRoot_TaskSelectorsPlaceHolder_ctl00_autoCompleteBuilding_comboBox_Input');
    public locationInput = this.page.locator('#ctl00_ctl00_contentPlaceHolderRoot_TaskSelectorsPlaceHolder_ctl00_autoCompleteLocation_comboBox_Input');
    public problemInput = this.page.locator('#ctl00_ctl00_contentPlaceHolderRoot_TaskSelectorsPlaceHolder_ctl00_autoCompleteProblem_comboBox_Input');
    public sourceInput = this.page.locator('#ctl00_ctl00_contentPlaceHolderRoot_contentPlaceHolder_F_TASKSEditor_ctl00_autoCompleteCallerSource_comboBox_Input');
    public userDefineInput = this.page.locator('#ctl00_ctl00_contentPlaceHolderRoot_contentPlaceHolder_F_TASKSEditor_ctl00_autoCompleteUserDefined_comboBox_Input');
    public woStatusInput = this.page.locator('#ctl00_ctl00_contentPlaceHolderRoot_TaskSelectorsPlaceHolder_ctl00_autoCompleteLoC_comboBox_Input');
    public labelDisplayText = this.page.locator('input[name="ctl00$ctl00$detailHeaderPlaceHolder$labelDisplayText"]');
    public saveTaskButton = this.page.locator('input[value="Save Task"]')
    public saveButton = this.page.locator('span[class="x-button x-button-text"]')
    public duplicateWOModal = this.page.locator('#ctl00_ctl00_ctl31_container')
    public processSpinner = this.page.locator('#ctl00_ctl00_updateProgress')
    public resourceProcessSpinner = this.page.locator('#ctl00_ctl00_contentPlaceHolderRoot_contentPlaceHolder_F_TASKSEditor_ctl00_fsiGridTaskResourcesCombinedUpdateProgress')
    public woDocumentNavLink = this.page.locator('a[title="Documents"]').first()
    public woFinancialsNavLink = this.page.locator('a[title="Financials"]')
    public woIssuedQuoteNavLink = this.page.locator('a[title="Issued Quote"]')
    public woResourceLink = this.page.locator('a[title="Resource"]').first()
    public refesh = this.page.locator('#ctl00_ctl00_ToolbarEx_Refresh .icon')
    public status = this.page.locator('#ctl00_ctl00_detailHeaderPlaceHolder_labelPageAdditionalInfo').first()
    public woDocumentTable = this.page.locator('#ctl00_ctl00_contentPlaceHolderRoot_contentPlaceHolder_editorDocumentAssignment_ctl00_gridDocumentAssignment_innerGrid_ctl00__0>td')
    public woLogNotesTable = this.page.locator('#ctl00_ctl00_contentPlaceHolderRoot_contentPlaceHolder_F_TASKSEditor_ctl00_fsiGridEvents_innerGrid_ctl00__2>td')

    public newEntryIcon = this.page.locator('a[title="Open dialog to create a new entity"] .icon')
    public eventInput = this.page.locator('#ctl00_ctl00_contentPlaceHolderRoot_contentPlaceHolder_EventsEditor_ctl00_DropDownListEV_EVENT_comboBox_Input');
    public commentTextArea = this.page.locator('textarea.textBoxControl')
    public actMaterialInput = this.page.locator('#ctl00_ctl00_contentPlaceHolderRoot_contentPlaceHolder_F_TASKSFinancialsEditor_ctl00_FlexNumericTextBoxStockCostActual_NumericTextBox');
    public actLabourInput = this.page.locator('#ctl00_ctl00_contentPlaceHolderRoot_contentPlaceHolder_F_TASKSFinancialsEditor_ctl00_FlexNumericTextBoxLabourCostActual_NumericTextBox');

    public attendValue = this.page.locator('#ctl00_ctl00_contentPlaceHolderRoot_SlaTimeControl_progressAttend_TimeLabel')
    public headerCollapsIcon = this.page.locator('.fsiNavDetailHeaderCollapsIcon')
    public financialsHeaderCont = this.page.locator('div[id="ctl00_ctl00_fsiMenu_Fsi.Concept.Tasks.Entities.F_TASKS.Common.Edit_fsiNavDetailHeaderContainer_2"]')

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

    async checkWorkOrderCompletionTest(workOrderId: string, requestBy: string, estLabour: string | null, estMaterial: string | null, logNoteComment: string) {
        await this.page.waitForTimeout(2000)
        await this.woResourceLink.click()
        await this.changeWOStatus("Acknowledged")
        await this.checkForCollapsedHeader()
        await new IssuedQuotePage(this.page).createQuote(requestBy, estLabour, estMaterial)
        await this.addLognotes(logNoteComment)
        await this.woResourceLink.click()
        await this.page.waitForLoadState()
        await this.page.waitForTimeout(2000)
        await this.page.getByText("General").first().click()
        await this.page.waitForTimeout(3000)
        await this.page.getByText("General").first().click()
        await expect(this.woStatusInput).toHaveValue('WO Approved to Proceed')
        await this.changeWOStatus("Arrived")
        await this.page.getByText("General").first().click()
        await expect(this.woStatusInput).toHaveValue('Arrived')
        await expect(this.attendValue).not.toContainText('-')
        await this.changeWOStatus("Work Complete On Site")
        await this.uploadWODocument(workOrderId, "Completion Certificates",
            "Mitie FM (Manned Guarding)",
            "fixtures/files/25 Advanced Guitar Chords.pdf")
        await this.addActualCosts(estLabour, estMaterial)
        await this.changeWOStatus("Work Order Complete")
        await this.page.getByText("General").first().click()
        await this.page.waitForTimeout(3000)
        await this.page.getByText("General").first().click()


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

    async changeWOStatus(status: string){
        await this.page.getByText("General").first().click()
        await this.woStatusInput.clear()
        await this.woStatusInput.fill(status)
        await this.page.getByText(status).click()
        await this.saveButton.first().click()
    }

    async addLognotes(logNoteComment: string){
        await this.page.getByText("Lognotes").first().click()
        const [newLognoteEntryPage] = await Promise.all([
            this.page.waitForEvent('popup'),
            await this.newEntryIcon.click()
        ])
        const workOrderPage = new WorkOrderPage(newLognoteEntryPage)
        await workOrderPage.eventInput.fill(logNoteComment)
        await newLognoteEntryPage.waitForTimeout(2000)
        await workOrderPage.commentTextArea.click()
        await workOrderPage.commentTextArea.fill(logNoteComment)
        await newLognoteEntryPage.getByText("Save and Close").click()
    }

    async addActualCosts(actLabour: string | null, actMaterial: string | null) {
        await this.checkForCollapsedHeader()
        await this.page.getByText("Financials").last().click()
        if(actLabour!) {}
        {
            await this.actLabourInput.clear()
            await this.actLabourInput.fill(actLabour!)
        }
        if(actMaterial!) {}
        {
            await this.actMaterialInput.clear()
            await this.actMaterialInput.fill(actMaterial!)
        }
        await this.saveButton.first().click()
    }

    async checkForCollapsedHeader(){
        const headerCollapsedStatus = await this.financialsHeaderCont.getAttribute("data-collapsed")
        if (!headerCollapsedStatus || headerCollapsedStatus.includes("Yes")){
            await this.headerCollapsIcon.first().click()
        }
    }



}
