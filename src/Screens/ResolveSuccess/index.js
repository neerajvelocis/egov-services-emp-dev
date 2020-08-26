import React, { Component } from "react";
import { Button, Icon } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import CommonSuccessMessage from "../../modules/CommonSuccessMessage";
import "./index.css";
import { connect } from "react-redux";

class ResolveSuccess extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bkData: {}
    }
  };

  continueComplaintSubmit = () => {
    
    this.props.history.push("/egov-services/all-applications");
  
  };

  render() {
   
    return (
      <div className="success-message-main-screen resolve-success">
        <CommonSuccessMessage
          headermessage="ES_APPLICATION_HEADER_MESSAGE"
          successmessage="ES_APPLICATION_RESOLVED_SUCCESS_MESSAGE"
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
)(ResolveSuccess);