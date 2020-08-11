import React, { Component } from 'react';
import { Tabs, Card, TextField, Icon, Button } from "components";
import Label from "egov-ui-kit/utils/translationNode";

class SummaryDetails extends Component {

    submit=e=>{
        console.log('this.props',this.props)
       let Booking= {
            "bkApplicationNumber": "CH-BK-2020-08-11-000753",
            "bookingsRemarks": null,
            "bkHouseNo": "43",
            "bkAddress": null,
            "bkSector": this.props,
            "bkVillCity": null,
            "bkAreaRequired": null,
            "bkDuration": null,
            "bkCategory": null,
            "bkEmail": this.props,
            "bkContactNo": null,
            "bkDocumentUploadedUrl": null,
            "bkDateCreated": "2020-08-11",
            "bkCreatedBy": null,
            "bkWfStatus": null,
            "bkAmount": null,
            "bkPaymentStatus": null,
            "bkPaymentDate": null,
            "bkBookingType": "WATER_TANKERS",
            "bkFromDate": null,
            "bkToDate": null,
            "bkApplicantName": this.props,
            "bkBookingPurpose": null,
            "bkVillage": null,
            "bkDimension": null,
            "bkLocation": null,
            "bkStartingDate": null,
            "bkEndingDate": null,
            "bkType": "Residential",
            "bkResidenceProof": null,
            "bkCleansingCharges": null,
            "bkRent": null,
            "bkSurchargeRent": null,
            "bkFacilitationCharges": null,
            "bkUtgst": null,
            "bkCgst": null,
            "bkMobileNumber":this.props,
            "bkCustomerGstNo": null,
            "bkCurrentCharges": null,
            "bkLocationChangeAmount": null,
            "bkVenue": null,
            "bkDate": null,
            "bkFatherName": null,
            "bkBookingVenue": null,
            "bkBookingDuration": null,
            "bkIdProof": null,
            "bkApplicantContact": null,
            "bkOpenSpaceLocation": null,
            "bkLandmark": null,
            "bkRequirementArea": null,
            "bkLocationPictures": null,
            "bkBookingReferenceNumber": null,
            "bkPaymentReceiptNumber": null,
            "bkParkOrCommunityCenter": null,
            "bkRefundAmount": null,
            "bkBankAccountNumber": null,
            "bkBankName": null,
            "bkIfscCode": null,
            "bkAccountType": null,
            "bkPropertyOwnerName": null,
            "bkCompleteAddress": this.props,
            "bkResidentialOrCommercial": null,
            "bkMaterialStorageArea": null,
            "bkPlotSketch": null,
            "bkApplicationStatus": "INITIATED",
            "bkTime": "",
            "bkStatusUpdateRequest": null,
            "bkStatus": "Request due to water supply failure",
            "bkDriverName": null,
            "bkVehicleNumber": null,
            "bkEstimatedDeliveryTime": null,
            "bkActualDeliveryTime": null,
            "bkNormalWaterFailureRequest": null,
            "bkUpdateStatusOption": null,
            "bkAddSpecialRequestDetails": null,
            "bkBookingTime": null,
            "bkApprovedBy": null,
            "bkModuleType": null,
            "uuid": "70b08649-c409-423b-853c-fd1a0ce697de",
            "tenantId": "ch",
            "bkAction": "FAILUREAPPLY",
            "bkConstructionType": null,
            "businessService": "BWT",
            "bkApproverName": null,
            "assignee": null,
            "wfDocuments": null
        }
    }

    back = e => {
        e.preventDefault();
        this.props.prevStep();
    }
    render(){
        const { firstName, lastName, jobTitle, jobCompany, email,mobileNo, jobLocation,houseNo,address,locality,residenials } = this.props;
        return(
            <div>
                {/* <h2>Here is the information you entered:</h2> */}
                First Name: <b>{firstName}</b><br />
                Last Name: <b>{email}</b><br />
                Job: <b>{mobileNo}</b><br />
                Company: <b>{houseNo}</b><br />
                Location: <b>{address}</b><br />
                <button className="Back" onClick={this.back}>
                    « Back
                </button>
                <button className="Back" onClick={this.submit}>
                    « Submit
                </button>

            </div>
        );
    }
}

export default SummaryDetails;