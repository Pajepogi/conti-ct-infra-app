export interface TapeUnitInterface {
  id: number,
  id_location: number,
  name: string,
  connectionTypeId: number,
  firmware_Version: string,
  model: string,
  pn: string,
  sn: string,
  carePackSAID: string,
  validContractThru: Date,
  ipAddress: string,
  iloip: number,
  drivers: number,
  pending_Approval: boolean,
  connectionType: {
    id: number,
    name: string,
  }
}
