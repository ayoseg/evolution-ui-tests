import { expect, Page } from '@playwright/test'

export class IssuedQuotePage {
    constructor(private page: Page) {}

    public newEntryIcon = this.page.locator('a[title="Open dialog to create a new entity"] .icon');
    public newLognotesEntryIcon = this.page.locator('a[title="Open dialog to create a new event"] .icon');
    public requestByInput = this.page.locator('#ctl00_ctl00_contentPlaceHolderRoot_contentPlaceHolder_IssuedQuoteEditor_TabContainer_TabPanel0_IssuedQuoteDetails_Editor_autoCompleteRequestedBy_comboBox_Input');
    public estLabourInput = this.page.locator('#ctl00_ctl00_contentPlaceHolderRoot_contentPlaceHolder_IssueQuoteItemEditor_ctl00_textBoxEstimatedLabour_NumericTextBox');
    public estMaterialInput = this.page.locator('#ctl00_ctl00_contentPlaceHolderRoot_contentPlaceHolder_IssueQuoteItemEditor_ctl00_textBoxEstimatedMaterial_NumericTextBox');


    public saveButton = this.page.locator('span[class="x-button x-button-text"]').first()
    public saveDropButton = this.page.locator('.x-button-drop').first()
    public issueButton = this.page.locator('span[class="x-button x-button-text"]').last()
    public addNewItemButton = this.page.locator('a[title="Add Item"]>.icon')
    public spinner = this.page.locator('#ctl00_ctl00_contentPlaceHolderRoot_contentPlaceHolder_IssuedQuoteEditor_TabContainer_TabPanel0_IssuedQuoteDetails_Editor_fsiGridQuoteItemsUpdateProgress')
    async createQuote(requestBy: string, estLabour: string | null, estMaterial: string | null) {
        await this.page.getByText("Issued Quote").click()
        const [newQuotePage] = await Promise.all([
            this.page.waitForEvent('popup'),
            await this.newEntryIcon.click()
        ])
        // create new object KBR Incidents Mailbox
        const issueQuotePage = new IssuedQuotePage(newQuotePage)

        await issueQuotePage.requestByInput.fill(requestBy.split(" ")[0])
        await newQuotePage.getByText(" "+requestBy).last().click()
        await issueQuotePage.saveButton.click()

        await this.addEstimatedValue(newQuotePage, estLabour!, estMaterial!)
        await newQuotePage.getByText("General").first().click()
        const estimatedValueSum = Number(estLabour!) + Number(estMaterial)
        if (estimatedValueSum >= 150) {
            await issueQuotePage.issueButton.click()
        }
        await issueQuotePage.saveDropButton.click()
        await newQuotePage.getByText("Save and Close").click()
    }

    async addEstimatedValue(page: Page, estLabour: string | null, estMaterial: string | null) {
        const issueQuotePage = new IssuedQuotePage(page)
        const [newQuoteItemPage] = await Promise.all([
            page.waitForEvent('popup'),
            await issueQuotePage.addNewItemButton.click()
        ])

        const issueQuoteItemPage = new IssuedQuotePage(newQuoteItemPage)
        if(estLabour!) {}
        {
            await issueQuoteItemPage.estLabourInput.clear()
            await issueQuoteItemPage.estLabourInput.fill(estLabour!)
        }
        if(estMaterial!) {}
        {
            await issueQuoteItemPage.estMaterialInput.clear()
            await issueQuoteItemPage.estMaterialInput.fill(estMaterial!)
        }
        await newQuoteItemPage.getByText("Save and Close").click()
    }

}
