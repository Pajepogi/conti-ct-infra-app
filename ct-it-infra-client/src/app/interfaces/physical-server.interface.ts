export interface PhysicalServerInterface {
        loC_ID: number,
        category_ID: number,
        oS_ID: number,
        patchingDay_ID: number,
        name: string,
        purpose: string,
        pn: string,
        sn: string,
        model: string,
        carePackSAID: string,
        validContractThru: string,
        ipAddress: string,
        iloip: string,
        ccServerUser: boolean,
        hdd: number,
        ram: number,
        cpu: string,
        pending_Approval: boolean,
        category: {
            id: number,
            name: string,
            details: string
        },
        operatingSystem: {
            id: number,
            osName: string,
            osVersion: string,
        },
        patchingDay: {
            id: number,
            dayOfWeek: number,
            timeOfDay: string,
            timeZone: string
        }
}
