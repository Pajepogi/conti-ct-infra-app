export interface SwitchesInterface {
        id: number,
        id_location: number,
        name: string,
        purpose: string,
        connectionTypeId: number;
        model: string,
        pn: string,
        sn: string,
        carePackSAID: string,
        validContractThru: Date,
        ipAddress: string,
        ipAddress2: string,
        pending_Approval: boolean,
        connectionType: {
          id: number,
          name: string,
        }
}
