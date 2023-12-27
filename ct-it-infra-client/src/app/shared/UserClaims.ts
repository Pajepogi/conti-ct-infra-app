export class UserClaims {
    private _userId: string;
    private _surname: string;
    private _givenname: string;
    private _emailAddress: string;

    get UserId() {
        return this._userId;
    }

    get GiveName() {
        return this._givenname;
    }

    get SurName() {
        return this._surname;
    }

    get EmailAddress() {
        return this._emailAddress;
    }

    private readonly upn_claim_type = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/upn";
    private readonly givenname_claim_type = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname";
    private readonly surnname_claim_type = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname";
    private readonly emailAddress_claim_type = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress";

    /**
     *
     */
    constructor(authenticationResponse : any) {
        
        this.Initialize(authenticationResponse);
    }

    

    private Initialize(authenticationResponse: any) {

        authenticationResponse[0].user_claims.forEach((user_claim: any) => {
            switch (user_claim.typ) {
                case this.upn_claim_type:
                    this._userId = user_claim.val.split('@')[0];
                    break;

                case this.givenname_claim_type:
                    this._givenname = user_claim.val;
                    break;

                case this.surnname_claim_type:
                    this._surname = user_claim.val;
                    break;

                case this.emailAddress_claim_type:
                    this._emailAddress = user_claim.val;
                    break;
            }
        });

    }
}