import React, { Component } from "react";
import { Button, Icon } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import CommonSuccessMessage from "../../modules/CommonSuccessMessage";

import "./index.css";

class DeliveredBWTApplicationSuccess extends Component {
  continueComplaintSubmit = () => {
    this.props.history.push("/egov-services/all-applications");
  };
  render() {
    return (
      <div className="success-message-main-screen resolve-success">
        <CommonSuccessMessage
        headermessage="ES_APPLICATION_HEADER_MESSAGE_DELIVERED"
          successmessage="ES_APPLICATION_DELIVERED_SUCCESS_MESSAGE"
          secondaryLabel="BK_MYBK_SUCCESSFULLY_DELIVERED_SEND_MESSAGE"
          containerStyle={{ display: "inline-block" }}
          icon={<Icon action="navigation" name="check" />}
          backgroundColor={"#22b25f"}
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

export default DeliveredBWTApplicationSuccess;
