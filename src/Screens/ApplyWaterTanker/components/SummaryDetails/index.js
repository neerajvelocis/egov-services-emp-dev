import React, { Component } from 'react';
import { Tabs, Card, TextField, Icon, Button } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import { createWaterTankerApplication } from "egov-ui-kit/redux/complaints/actions";
import { connect } from "react-redux";
class SummaryDetails extends Component {



    componentDidMount = async () => {
        console.log('summary details',this.props);
    }

    submit = e => {
        let { createWaterTankerApplication } = this.props;
        const { firstName, email, mobileNo, houseNo, address, locality, residenials } = this.props;
        let Booking= {
            "bkApplicantName":firstName,
            "bkMobileNumber": mobileNo,
            "bkEmail": email,
            "bkHouseNo":houseNo,
            "bkCompleteAddress": address,
            "bkSector": locality,
            "bkType": residenials,
            "bkDate": "",
            "bkTime": "",
            "bkStatus": "Request due to water supply failure",
            "bkBookingType": "WATER_TANKERS",
            "tenantId": "ch",
            "bkAction": "SPECIALAPPLY",
            "businessService": "BWT"
        }
        createWaterTankerApplication(
        {"applicationType": "BWT",
        "applicationStatus": "",
        "applicationId": null,
        "tenantId": "ch",
       "Booking": Booking });

       this.props.history.push("/egov-services/create-success");
    }

    back = e => {
        e.preventDefault();
        this.props.prevStep();
    }
    render() {
        const { firstName, email, mobileNo, houseNo, address, locality, residenials,propsData } = this.props;
        return (
            <div>
  <div>
             
                <Label label="MYBK_APPLICANT_DETAILS" containerStyle={{ marginLeft: "13px" }} labelClassName="dark-heading" />
              </div>
<div className="col-xs-12" style={{ padding: 0 }}>
              <div className="col-sm-12 col-xs-12">
            
              <div className="complaint-detail-detail-section-status row">
                  <div className="col-md-4">
                    <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="MYBK_APPLICANT_NAME" />
                    <Label
                      labelStyle={{ color: "inherit" }}
                      className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                      id="complaint-details-complaint-number"
                      label={firstName}
                    />
                  </div>
                  <div className="col-md-4">
                    <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="MYBK_APPLICANT_DETAILS_EMAIL" />
                    <Label
                      className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                      id="complaint-details-current-status"
                      labelStyle={{ color: "inherit" }}
                      label={email}
                    />
                  </div>
                  <div className="col-md-4">
                    <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="MYBK_APPLICANT_MOBILENUMBER" />
                    <Label
                      className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                      id="complaint-details-current-status"
                      labelStyle={{ color: "inherit" }}
                      label={mobileNo}
                    />
                  </div>
                  <div className="col-md-4">
                    <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="MYBK_APPLICANT_HOUSENO" />
                    <Label
                      className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                      id="complaint-details-current-status"
                      labelStyle={{ color: "inherit" }}
                      label={houseNo}
                    />
                  </div>
                  
                  <div className="col-md-4">
                    <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="MYBK_APPLICANT_ADDRESS" />
                    <Label
                      className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                      id="complaint-details-current-status"
                      labelStyle={{ color: "inherit" }}
                      label={address}
                    />
                  </div>

                  <div className="col-md-4">
                    <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="MYBK_APPLICANT_SECTOR" />
                    <Label
                      className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                      id="complaint-details-current-status"
                      labelStyle={{ color: "inherit" }}
                      label={locality}
                    />
                  </div>
                  <div className="col-md-4">
                    <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="MYBK_APPLICANT_RESIDENTAILSTYPE" />
                    <Label
                      className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                      id="complaint-details-current-status"
                      labelStyle={{ color: "inherit" }}
                      label={residenials}
                    />
                  </div>
                  </div>
                 {/* Name: <b>{firstName}</b><br />
                Email: <b>{email}</b><br />
                Mobile number: <b>{mobileNo}</b><br />
                houseNo: <b>{houseNo}</b><br />
                address: <b>{address}</b><br />
                locality: <b>{locality}</b><br />
                residenials: <b>{residenials}</b><br /> */}

                <div className="responsive-action-button-cont">
                <Button
                        className="responsive-action-button"
                        primary={true}
                        label={<Label buttonLabel={true} label="CORE_COMMON_GOBACK" />}
                        fullWidth={true}
                        onClick={this.back}
                        style={{marginRight:18}}
                    />

            
                    <Button
                        className="responsive-action-button"
                        primary={true}
                        label={<Label buttonLabel={true} label="CORE_COMMON_SUBMIT" />}
                        fullWidth={true}
                        onClick={this.submit}
                    />
                </div>
                {/* <button className="Back" onClick={this.submit}>
                     Submit
                </button> */}

            </div>
            </div></div>
        );
    }
}

const mapStateToProps = state => {

    const { complaints, common, auth, form } = state;
    const { createWaterTankerApplication } = complaints;
    console.log('createWaterTankerApplication', createWaterTankerApplication)
    return {
        createWaterTankerApplication
    }

}
const mapDispatchToProps = dispatch => {
    return {

        createWaterTankerApplication: criteria => dispatch(createWaterTankerApplication(criteria)),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SummaryDetails);