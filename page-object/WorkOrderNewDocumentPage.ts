import { Page } from '@playwright/test'

export class WorkOrderNewDocumentPage {
    constructor(private page: Page) {}

    public docRefInput = this.page.locator('#ctl00_ctl00_contentPlaceHolderRoot_contentPlaceHolder_ConceptDocumentEditor_ctl00_TextBoxDocumentRef');
    public classInput = this.page.locator('#ctl00_ctl00_contentPlaceHolderRoot_contentPlaceHolder_ConceptDocumentEditor_ctl00_autoCompleteDocumentClass_comboBox_Input');
    public repositoryInput = this.page.locator('#ctl00_ctl00_contentPlaceHolderRoot_contentPlaceHolder_ConceptDocumentEditor_ctl00_DropDownEnumListRepository_comboBox_Input');
    public fileInput = this.page.locator('input[type="file"]')

}
