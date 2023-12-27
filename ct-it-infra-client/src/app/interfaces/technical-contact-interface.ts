export interface TechnicalContactInterface {
    id: number,
    locationsId: number,
    techContactResponsibilityID: number,
    ldaP_UID: string,
    email: string,
    pending_Approval: boolean,
    techContactResponsibility: {
        id: number,
        name: string
    }
}
