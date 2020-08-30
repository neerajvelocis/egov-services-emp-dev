import React, { Component } from "react";
import { Button, Icon } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import { SuccessMessage } from "modules/common";
import CommonSuccessMessage from "../../modules/CommonSuccessMessage";
import { connect } from "react-redux";

import "./index.css";

class AssignToDriverSuccess extends Component {
  continueComplaintSubmit = () => {
    this.props.history.push("/egov-services/all-applications");
  };
  render() {
    let {applicationNumber} = this.props;
    return (
      <div className="success-message-main-screen resolve-success">
        <CommonSuccessMessage
          headermessage="BK_ES_APPLICATION_HEADER_MESSAGE_ASSIGNED_DRIVER"
          successmessage="ES_ASSIGN_TO_DRIVER_SUCCESS_MESSAGE"
          secondaryLabel="BK_MYBK_SUCCESSFULLY_ASSIGNED_DRIVER_SEND_MESSAGE"
          containerStyle={{ display: "inline-block" }}
          icon={<Icon action="navigation" name="check" />}
          backgroundColor={"#22b25f"}
          applicationNumber={applicationNumber && applicationNumber}
        />
        <div className="responsive-action-button-cont">
          <Button
            id="resolve-success-continue"
            primary={true}
            label={<Label buttonLabel={true} label="CORE_COMMON_GOTOHOME" />}
            fullWidth={true}
            onClick={this.continueComplaintSubmit}
            className="responsive-action-button"
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { complaints, common, auth, form } = state;
  const { applicationData } = complaints;
  let bookingDetails = applicationData ? applicationData.bookingsModelList[0] : '';
  console.log("bookingDetailsinResolveSuccess--",bookingDetails)
  //bkApplicationNumber
  let applicationNumber = applicationData ? applicationData.bookingsModelList[0].bkApplicationNumber : '';
  console.log("applicationNumber--",applicationNumber)
  return {
    bookingDetails,
    applicationNumber
  }
}

const mapDispatchToProps = dispatch => {
  return {}
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AssignToDriverSuccess);
