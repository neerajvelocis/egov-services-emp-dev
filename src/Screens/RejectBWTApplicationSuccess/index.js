import React, { Component } from "react";
import { Button, Icon } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import { SuccessMessage } from "modules/common";
//import "modules/common/common/SuccessMessage/components/successmessage/index.css";
import "./index.css";

class RejectBWTApplicationSuccess extends Component {
  continueComplaintSubmit = () => {
    console.log('on go to home')
    this.props.history.push("/egov-services/all-applications");
  };
  render() {
    return (
      <div className="success-message-main-screen">
        <SuccessMessage
          successmessage="ES_COMPLAINT_REJECT_SUCCESS_MESSAGE"
          icon={<Icon action="navigation" name="close" />}
          backgroundColor={"#e74c3c"}
        />

        <div className="responsive-action-button-cont">
          <Button
            className="responsive-action-button"
            primary={true}
            label={<Label buttonLabel={true} label="CORE_COMMON_GOTOHOME" />}
            fullWidth={true}
            onClick={this.handleComplaintReassigned}
          />
        </div>
      </div>
    );
  }
}

export default RejectBWTApplicationSuccess;