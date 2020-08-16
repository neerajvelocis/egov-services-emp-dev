import React, { Component } from "react";
import { Button, Icon } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import CommonSuccessMessage from "../../modules/CommonSuccessMessage";
//import "modules/common/common/SuccessMessage/components/successmessage/index.css";
import "./index.css";
import { connect } from "react-redux";

class PublishSuccess extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bkData: {}
    }
  };
  continueComplaintSubmit = () => {
    this.props.history.push("/egov-services/all-MccApplications");
  };
  render() {
   
    return (
      <div className="success-message-main-screen resolve-success">
        <CommonSuccessMessage
          headermessage="ES_APPLICATION_HEADER_PUBLISH_MESSAGE"
          successmessage="ES_APPLICATION_PUBLISH_SUCCESS_MESSAGE"
          secondaryLabel="CS_COMMON_SEND_MESSAGE_APPROVAL"
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
const mapStateToProps = state => {
  console.log('state in resolve success', state);
  const { complaints, common, auth, form } = state;
  const { applicationData } = complaints;
  let bookingDetails = applicationData ? applicationData.bookingsModelList[0] : '';
  return {
    bookingDetails
  }
}

const mapDispatchToProps = dispatch => {
  return {}
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PublishSuccess);