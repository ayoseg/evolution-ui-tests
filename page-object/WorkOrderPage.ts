import { Page } from '@playwright/test'

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
    public woDocumentNavLink = this.page.locator('a[title="Documents"]').first()
    public woDocumentTable = this.page.locator('#ctl00_ctl00_contentPlaceHolderRoot_contentPlaceHolder_editorDocumentAssignment_ctl00_gridDocumentAssignment_innerGrid_ctl00__0>td')
}
