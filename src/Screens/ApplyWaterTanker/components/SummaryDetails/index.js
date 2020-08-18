import React, { Component } from 'react';
import { Tabs, Card, TextField, Icon, Button } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import { createWaterTankerApplication } from "egov-ui-kit/redux/complaints/actions";
import { connect } from "react-redux";
import { toggleSnackbarAndSetText } from "egov-ui-kit/redux/app/actions";
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import "./index.css";
class SummaryDetails extends Component {



    componentDidMount = async () => {
        console.log('summary details', this.props);
    }

    submit = e => {
       
        let { createWaterTankerApplication } = this.props;
        const { firstName, email, mobileNo, houseNo, address, locality, residenials } = this.props;
        let Booking = {
            "bkApplicantName": firstName,
            "bkMobileNumber": mobileNo,
            "bkEmail": email,
            "bkHouseNo": houseNo,
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
            {
                "applicationType": "BWT",
                "applicationStatus": "",
                "applicationId": null,
                "tenantId": "ch",
                "Booking": Booking
            });
        	// setTimeout(() => {
                // console.log('summary props in time', this.props);
            this.props.history.push("/egov-services/create-success");
        // }, 100);
        console.log('summary props', this.props);

    }

    firstStep = e => {
        e.preventDefault();
        this.props.firstStep();

    }


    back = e => {
        e.preventDefault();
        this.props.prevStep();
    }
    render() {
        const { firstName, email, mobileNo, houseNo, address, locality, residenials, propsData } = this.props;
        console.log('propsData', propsData)
        // let typeOfRequest=
        return (
            <div>
                <div className="col-xs-12">
                    <button
                        style={{ float: 'right', marginRight: '50px', marginTop: '40px' }}
                        primary={true}
                        onClick={this.firstStep}
                        className="ViewDetailButton"
                    >EDIT</button>
                </div>

                <div style={{
                    marginLeft: "45px", paddingBottom: '5px'
                }}>
                    <Label label="MYBK_APPLICANT_DETAILS" labelClassName="dark-heading" />
                </div>

                <div className="col-xs-12" style={{ paddingBottom: '50px' }}>
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
                        </div>
                    </div>
                </div>




                <div style={{ marginLeft: "45px", paddingBottom: '5px', marginTop: 10 }} >
                    <Label label="MYBK_APPLICANTION_DETAILS" labelClassName="dark-heading" />
                </div>
                <div className="col-xs-12" style={{marginLeft: '10px'}}>
                    <div className="col-sm-12 col-xs-12" style={{ marginBottom: '90px' }}>

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
                            <div className="col-md-4">
                                <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="MYBK_TYPE_OF_REQUEST" />
                                <Label
                                    className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                                    id="complaint-details-current-status"
                                    labelStyle={{ color: "inherit" }}
                                    label="MYBK_WATER_TANKER_REQUEST"
                                />
                            </div>
                        </div>
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
                        style={{ marginRight: 18 }}
                        startIcon={<ArrowBackIosIcon />}
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
        );
    }
}

const mapStateToProps = state => {

    const { complaints, common, auth, form } = state;
    console.log('state in summary',state)
    const { createWaterTankerApplicationData } = complaints;
    console.log('createWaterTankerApplicationData in summary', createWaterTankerApplicationData)
    return {
        createWaterTankerApplicationData
    }

}
const mapDispatchToProps = dispatch => {
    return {

        createWaterTankerApplication: criteria => dispatch(createWaterTankerApplication(criteria)),
        toggleSnackbarAndSetText: (open, message, error) =>
            dispatch(toggleSnackbarAndSetText(open, message, error)),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SummaryDetails);