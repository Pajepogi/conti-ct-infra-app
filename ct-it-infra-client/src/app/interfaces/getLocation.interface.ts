export interface GetLocationInterface {
    data: Array<field>,
    totalPages: Number,
    totalCount: Number,
    previous: BigInteger,
    next: BigInteger,
    pageNumber: Number,
    pageSize: Number
}
export interface field{
    id: number,
    loc_Code: string,
    location_Name: string,
    location_Address: string,
    ldap_Domain: string,
    ldap_Container: string,
    region: string,
    country: string,
    architecture_Diagram: string,
    cU_Number: string,
    cC_Number: string,
    timezone: string,
    bmC_Group: string,
    isActive: boolean
}

export interface regions{
    id:number;
    name: string;
}

export interface users{
    userId:string;
    roleName: string;
    email:string;
}

export interface userLocationData{
    userId : string,
    locations : string[]
}

export interface roles{
    roleName: string;
    id: number;
}