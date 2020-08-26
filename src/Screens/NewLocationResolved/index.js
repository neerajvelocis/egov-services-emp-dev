import React, { Component } from "react";
import { connect } from "react-redux";
import formHOC from "egov-ui-kit/hocs/form";
import { Screen } from "modules/common";
import NewLocationResolvedForm from "./components/NewLocationResolvedForm";
import { fetchMccApplications } from "egov-ui-kit/redux/complaints/actions";
import Label from "egov-ui-kit/utils/translationNode";
import { toggleSnackbarAndSetText } from "egov-ui-kit/redux/app/actions";
import { handleFieldChange } from "egov-ui-kit/redux/form/actions";
import "./index.css";
import { httpRequest } from "egov-ui-kit/utils/api";

const NewLocationResolvedHOC = formHOC({
  formKey: "approveLocation",
  isCoreConfiguration: true,
  path: "pgr/pgr-employee"
})(NewLocationResolvedForm);


class NewLocationResolved extends Component {
  state = {
    valueSelected: "",
    commentValue: "",
    assignee:"",
    assignToMe:[],
    setOpen: false
  };
  async componentDidMount() {
    let { fetchMccApplications, match, userInfo,applicationNumber,trasformData } = this.props;
    
    fetchMccApplications(
      { 'uuid': userInfo.uuid, "applicationNumber": applicationNumber,
      "applicationStatus":"",
      "mobileNumber":"","bookingType":"" }
    );
    let requestbody=[{key: "applicationNumber",value: applicationNumber},{key: "tenantId",value:userInfo.tenantId},{key: "action",value:trasformData.action}]
    let AssigneeFromAPI = await httpRequest(
			"bookings/api/employee/assignee/_search",
			"_search",
			requestbody
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

  handleChangeAssigneeData= (e, value) => {
    this.setState({
      assignee: e.target.value
    });

  }
  handleClose = () => {
    this.setState({
      setOpen: false
    })
  };

  handleOpen = () => {
    this.setState({
      setOpen: true
    })
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
    this.props.handleFieldChange("approveLocation", "comments", concatvalue);
  };

  onSubmit = e => {
    const { valueSelected, commentValue } = this.state;
    
    const { toggleSnackbarAndSetText } = this.props;
    
  };

  render() {
    let { match, userInfo } = this.props;

    const { handleCommentsChange, handleOptionsChange, onSubmit,handleChangeAssigneeData ,handleOpen,handleClose} = this;
    const { valueSelected, commentValue ,assignee} = this.state;
    const { trasformData, businessServiceData,applicationNumber } = this.props;
   
    return (
      
        <NewLocationResolvedHOC
          // options={this.options}
          handleOpen={handleOpen}
          handleClose={handleClose}
          handleChangeAssignee={handleChangeAssigneeData}
          ontextAreaChange={handleCommentsChange}
          handleOptionChange={handleOptionsChange}
          // optionSelected={valueSelected}
          commentValue={commentValue}
          assignee={assignee}
          applicationNumber={applicationNumber}
          createdBy={userInfo.name}
          tenantId={userInfo.tenantId}
          onSubmit={onSubmit}
          userInfo={userInfo}
          // bookingtype={trasformData.bkBookingType}
          bookingservice={businessServiceData?businessServiceData:''}
          setOpen={this.state.setOpen}
        />
      
    );
  }
}

const mapStateToProps = state => {
  const { complaints = {} } = state || {};
  const { MccApplicationData } = complaints;
 
  let trasformData = MccApplicationData?MccApplicationData.osujmNewLocationModelList[0]:'';
  let businessServiceData = MccApplicationData.businessService;
  return { trasformData, businessServiceData };
}


const mapDispatchToProps = dispatch => {
  return {
    fetchMccApplications: criteria => dispatch(fetchMccApplications(criteria)),
    handleFieldChange: (formKey, fieldKey, value) =>
      dispatch(handleFieldChange(formKey, fieldKey, value)),
    toggleSnackbarAndSetText: (open, message, error) =>
      dispatch(toggleSnackbarAndSetText(open, message, error))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewLocationResolved);
