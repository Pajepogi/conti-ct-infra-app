export interface VirtualServerInterface {
    id: number,
    loC_ID: number,
    categoryID: number,
    operatingSystemId: number,
    patchingDayId: number,
    virtualServerTypeID: number,
    technicalContactID: number,
    name: string,
    purpose: string,
    ipAddress: string,
    hdd: number,
    ram: number,
    cpu: string,
    isActive: true,
    pending_Approval: boolean,
    category: {
        id: number,
        name: string,
        details: string
    },
    operatingSystem: {
        id: number,
        osName: string,
        osVersion: string
    },
    patchingDay: {
        id: number,
        dayOfWeek: number,
        timeOfDay: string,
        timeZone: string
    },
    type: {
        id: number,
        name: string
    },
    technicalContact: {
        id: number,
        techContactResponsibilityID: number,
        ldaP_UID: string,
        email: string,
        techContactResponsibility: {
            id: number,
            name: string
        }
    }
}
