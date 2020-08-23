import React, { Component } from "react";
import { connect } from "react-redux";
import formHOC from "egov-ui-kit/hocs/form";
import { Screen } from "modules/common";
import AssignToDriverForm from "./components/AssignToDriverForm";
import { fetchApplications } from "egov-ui-kit/redux/complaints/actions";
import Label from "egov-ui-kit/utils/translationNode";
import { toggleSnackbarAndSetText } from "egov-ui-kit/redux/app/actions";
import { handleFieldChange } from "egov-ui-kit/redux/form/actions";
import "./index.css";

const RejectComplaintHOC = formHOC({
  formKey: "approveWBTBooking",
  isCoreConfiguration: true,
  path: "pgr/pgr-employee"
})(AssignToDriverForm);


class RejectComplaint extends Component {
  state = {
    valueSelected: "",
    commentValue: "",
    mobileNo: "",
    driverFullName: '',
    approverName: ''

  };
  componentDidMount() {

    let { fetchApplications, match, userInfo,applicationNumber } = this.props;
    fetchApplications(
      {
        'uuid': userInfo.uuid, "applicationNumber": applicationNumber,
        "applicationStatus": "",
        "mobileNumber": "", "bookingType": ""
        
      }
    );
  }

  options = [
    {
      value: "Not a valid application",
      label: <Label label="ES_REASSIGN_OPTION_ONE" />
    },
    {
      value: "Out of operational scope",
      label: <Label label="ES_REJECT_OPTION_TWO" />
    },
    { value: "Operation already underway", label: <Label label="ES_REJECT_OPTION_THREE" /> },
    { value: "Other", label: <Label label="ES_REJECT_OPTION_FOUR" /> }
  ];

  commentsValue = {};

  handleCommentsChange = (e, value) => {
    this.commentsValue.textVal = e.target.value;
    this.setState({
      commentValue: e.target.value
    });
    this.concatComments(this.commentsValue);
  };
  handleOptionsChange = (event, value) => {
    this.setState({ valueSelected: value });
    this.commentsValue.radioValue = value;
    this.concatComments(this.commentsValue);
  };
  concatComments = val => {
    let com1 = "";
    let com2 = "";
    if (val.radioValue) {
      com1 = val.radioValue + ";";
    }
    if (val.textVal) {
      com2 = val.textVal;
    }
    let concatvalue = com1 + com2;
    this.props.handleFieldChange("approveWBTBooking", "comments", concatvalue);
  };

  onMobileChange = (e) => {
    const inputValue = e.target.value;
    this.setState({ mobileNo: inputValue });
  };

  onDriverNameChange = (e) => {
    const driverName = e.target.value;
    this.setState({ driverFullName: driverName });

  }
  onApproverNameChange = (e) => {
    const approverName = e.target.value;
    this.setState({ approverName: approverName });

  }
  handleValidation = e => {
    
    console.log('is valid---  ',this.state)
    const { valueSelected, commentValue, mobileNo, driverFullName, approverName } = this.state;
    if (driverFullName != '' && mobileNo != '' && approverName != '') {
    //  return this.onSubmit()
    }
    return false;
  }
  onSubmit = e => {

    // console.log('this.stat in on submite', this.state)
// return 0
    // const { valueSelected, commentValue } = this.state;
    // console.log('this.stat in on submite', this.state)
    // const { toggleSnackbarAndSetText } = this.props;
  };

  render() {
    let { match, userInfo } = this.props;

    const { handleCommentsChange, handleOptionsChange, onSubmit,handleValidation, onMobileChange, onDriverNameChange, onApproverNameChange } = this;
    const { valueSelected, commentValue, mobileNo, driverFullName, approverName } = this.state;
    const { trasformData, businessServiceData,applicationNumber } = this.props;
    // console.log('this in render', trasformData)
    return (
      // <Screen className="background-white">
        <RejectComplaintHOC
          ontextAreaChange={handleCommentsChange}
          handleOptionChange={handleOptionsChange}
          commentValue={commentValue}
          mobileNumber={mobileNo}
          driverFullName={driverFullName}
          applicationNumber={applicationNumber}
          createdBy={userInfo.name}
          tenantId={userInfo.tenantId}
          onSubmit={onSubmit}
          handleValidation={handleValidation}
          bookingtype={trasformData.bkBookingType}
          bkStatus={trasformData.bkStatus}
          bookingservice={businessServiceData ? businessServiceData : ''}
          onMobileChange={onMobileChange}
          onDriverNameChange={onDriverNameChange}
          onApproverNameChange={onApproverNameChange}
          approverName={approverName}
        />
      // </Screen>
    );
  }
}

const mapStateToProps = state => {
  const { complaints = {} } = state || {};
  const { applicationData } = complaints;
  let trasformData = applicationData.bookingsModelList[0];
  let businessServiceData = applicationData.businessService;
  return { trasformData, businessServiceData };
}


const mapDispatchToProps = dispatch => {
  return {
    fetchApplications: criteria => dispatch(fetchApplications(criteria)),
    handleFieldChange: (formKey, fieldKey, value) =>
      dispatch(handleFieldChange(formKey, fieldKey, value)),
    toggleSnackbarAndSetText: (open, message, error) =>
      dispatch(toggleSnackbarAndSetText(open, message, error))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RejectComplaint);
