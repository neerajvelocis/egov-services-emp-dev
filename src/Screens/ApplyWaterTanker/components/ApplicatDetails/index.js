import React, { Component } from 'react';
import { Tabs, Card, TextField, Icon, Button } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import { toggleSnackbarAndSetText } from "egov-ui-kit/redux/app/actions";
import { connect } from "react-redux";
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';


class ApplicatInfo extends Component {
  continue = e => {
    e.preventDefault();
    console.log('vlue of e',this.props,'e.target.value',e.target.value)
    if(this.props.firstName==""||this.props.email==""||this.props.mobileNo==""){

      this.props.toggleSnackbarAndSetText(
        true,
        {
          labelName: "Error_Message_For_Water_tanker_Application",
          labelKey: `Error_Message_For_Water_tanker_Application`
        },
        "warning"
      );
    }
    else{this.props.nextStep();}
    
  }
  onCitizenNameChange = e => {

  }

  render() {
    const { firstName, email, mobileNo, lastName, handleChange } = this.props;
    const hintTextStyle = {
      letterSpacing: "0.7px",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      width: "90%",
      overflow: "hidden"
    };
    return (
      <div className="col-xs-12">
        <div ClassName="row" style={{paddingTop:35}}>
      <div className="col-sm-6 col-xs-12">
        
          <TextField
            id="name"
            name="name"
            type="text"
            value={firstName}
            hintText={
              <Label
                label="MYBK_NAME_CITIZEN_PLACEHOLDER"
                color="rgba(0, 0, 0, 0.3799999952316284)"
                fontSize={16}
                labelStyle={hintTextStyle}
              />
            }
            floatingLabelText={
              <Label
                key={0}
                label="MYBK_CREATE_CITIZEN_NAME"
                color="rgba(0,0,0,0.60)"
                fontSize="12px"
              />
            }
            onChange={handleChange('firstName')}
            underlineStyle={{ bottom: 7 }}
            underlineFocusStyle={{ bottom: 7 }}
            hintStyle={{ width: "100%" }}
          />
          </div>
          <div className="col-sm-6 col-xs-12">
          <TextField
            id="email"
            name="email"
            type="string"
            value={email}
            hintText={
              <Label
                label="MYBK_CITIZEN_EMAIL_PLACEHOLDER"
                color="rgba(0, 0, 0, 0.3799999952316284)"
                fontSize={16}
                labelStyle={hintTextStyle}
              />
            }
            floatingLabelText={
              <Label
                key={0}
                label="MYBK_CREATE_CITIZEN_EMAIL"
                color="rgba(0,0,0,0.60)"
                fontSize="12px"
              />
            }
            onChange={handleChange('email')}
            underlineStyle={{ bottom: 7 }}
            underlineFocusStyle={{ bottom: 7 }}
            hintStyle={{ width: "100%" }}
          />
          </div>
          <div className="col-sm-6 col-xs-12" style={{marginTop: 20}}>
          <TextField
            id="mobile-no"
            name="mobile-no"
            type="text"
            value={mobileNo}
            hintText={
              <Label
                label="MYBK_CITIZEN_MOBILENO_PLACEHOLDER"
                color="rgba(0, 0, 0, 0.3799999952316284)"
                fontSize={16}
                labelStyle={hintTextStyle}
              />
            }
            floatingLabelText={
              <Label
                key={0}
                label="MYBK_CREATE_CITIZEN_MOBILENO"
                color="rgba(0,0,0,0.60)"
                fontSize="12px"
              />
            }
            onChange={handleChange('mobileNo')}
            underlineStyle={{ bottom: 7 }}
            underlineFocusStyle={{ bottom: 7 }}
            hintStyle={{ width: "100%" }}
          />
        </div>
        </div>
        <div className="responsive-action-button-cont">
          <Button
            className="responsive-action-button"
            primary={true}
            label={<Label buttonLabel={true} label="CORE_COMMON_GONEXT" />}
            fullWidth={true}
            onClick={this.continue}
            startIcon={<ArrowForwardIosIcon />}
          />
        </div>
      </div>
    );
  }
}



const mapStateToProps = state => {
  const { complaints, common, auth, form } = state;
  return {
    
  }
}
const mapDispatchToProps = dispatch => {
  return {
      toggleSnackbarAndSetText: (open, message, error) =>
      dispatch(toggleSnackbarAndSetText(open, message, error)),
  }
}


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ApplicatInfo);