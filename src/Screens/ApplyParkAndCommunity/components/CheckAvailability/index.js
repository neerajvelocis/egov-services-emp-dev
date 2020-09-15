import React, { Component } from 'react';
import { Tabs, Card, TextField, Icon, Button } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import { toggleSnackbarAndSetText } from "egov-ui-kit/redux/app/actions";
import { connect } from "react-redux";
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import Grid from '@material-ui/core/Grid';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import Footer from "../../../../modules/footer"

import FormControl from '@material-ui/core/FormControl';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { fetchApplicaionSector } from "../../../../redux/bookings/actions";
import BookingMedia from "../BookingMedia";
import BookingCalendar from "../BookingCalendar"
import { httpRequest } from "egov-ui-kit/utils/api";
import get from "lodash/get";
import set from "lodash/set";
class CheckAvailability extends Component {
  state = {
    genderValue: "Park",
    open: false, setOpen: false, locality: '', masterDataPCC: [], availabilityCheckData: {},
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
  handleChange = (event) => {
    console.log('event.target.value', event.target.value)
    this.setState({ genderValue: event.target.value });
  };

  getSectorDataFromAPI = async () => {
    console.log('hello in sector getSectorDataFromAPI')
    let requestbody = {
      "venueType": "Parks",
      "sector": "SECTOR-11",
      "tenantId": "ch"
    }

    let sectorDataFromMaster = await httpRequest(
      "bookings/park/community/master/_fetch?",
      "_search", [],
      requestbody
    );
    this.setState({ masterDataPCC: sectorDataFromMaster.data })

  }


  sectorHandleChange = input => e => {
    let availabilityCheck = { "bkSector": e.target.value, bkBookingType: this.state.genderValue };
    this.setState({ availabilityCheckData: availabilityCheck })
    this.getSectorDataFromAPI();
    console.log('hello in sector chnage')
    this.setState({ [input]: e.target.value });
  }
  componentDidMount = async () => {
    let { fetchApplicaionSector } = this.props;
    fetchApplicaionSector();
  }
  continue = e => {
    this.props.history.push(`/egov-services/applyPark-community-center`);
    // let re = /\S+@\S+\.\S+/;
    // let mb=/^\d{10}$/;
    // e.preventDefault();
    // if(this.props.firstName==""||this.props.email==""||this.props.mobileNo==""){

    //   this.props.toggleSnackbarAndSetText(
    //     true,
    //     {
    //       labelName: "Error_Message_For_Water_tanker_Application",
    //       labelKey: `BK_ERROR_MESSAGE_EMAIL_VALIDATION`
    //     },
    //     "warning"
    //   );
    // }else if(!re.test(this.props.email)){
    //   this.props.toggleSnackbarAndSetText(
    //     true,
    //     {
    //       labelName: "Please enter valid email address",
    //       labelKey: `BK_ERROR_MESSAGE_EMAIL_VALIDATION`
    //     },
    //     "warning"
    //   );
    // }else if(!mb.test(this.props.mobileNo)){
    //   this.props.toggleSnackbarAndSetText(
    //     true,
    //     {
    //       labelName: "Please enter valid mobile number",
    //       labelKey: `BK_ERROR_MESSAGE_FOR_MOBILE_VALIDATION`
    //     },
    //     "warning"
    //   );

    // }
    // else{this.props.nextStep();}

  }
  
  render() {
    const { firstName, email, mobileNo, lastName, handleChange, complaintSector } = this.props;
    let sectorData = [];

    sectorData.push(complaintSector);

    let arrayData = [];

    let y = sectorData.forEach((item, index) => {
      let finalValues = Object.values(item);
      finalValues.forEach((event) => {
        arrayData.push(event);
      })
    })
    const hintTextStyle = {
      letterSpacing: "0.7px",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      width: "90%",
      overflow: "hidden"
    };
    return (
      <div style={{ float: 'left', width: '100%', padding: '36px 15px' }}>
        <div className="col-xs-12" style={{ background: '#fff', padding: '15px 0' }}>
          <div>
            <div style={{ paddingBottom: '5px',marginLeft: '15px'}}>
              <Label label="BK_MYBK_CHECK_AVAILABILITY" labelClassName="dark-heading" />
            </div>
            <div className="col-sm-6 col-xs-6">
              <FormControl component="fieldset">
                <FormLabel component="legend"><Label label="BK_MYBK_BOOKING_TYPE" /></FormLabel>
                <RadioGroup aria-label="gender" name="gender1" value={this.state.genderValue} onChange={this.handleChange}>
                  <FormControlLabel value="General" control={<Radio color="primary" />} label="Commuunity" />
                  <FormControlLabel value="Parks" control={<Radio color="primary" />} label="Park" />
                </RadioGroup>
              </FormControl>

            </div>

          </div>

          <div className="col-sm-6 col-xs-6">
            <FormControl style={{ width: '100%' }}>
              <InputLabel shrink style={{ width: '100%' }} id="demo-controlled-open-select-label"><Label label="Locality" /></InputLabel>
              <Select
                maxWidth={false}
                labelId="demo-controlled-open-select-label-Locality"
                id="demo-controlled-open-select-locality"
                open={this.state.SetOpen}
                onClose={() => this.handleClose()}
                onOpen={() => this.handleOpen()}
                value={this.state.locality}
                displayEmpty
                onChange={this.sectorHandleChange('locality')}
              >
                {arrayData.map((child, index) => (
                  <MenuItem value={child.name}>{child.name}</MenuItem>
                ))}

              </Select>
            </FormControl>

          </div>
          <BookingMedia
            masterDataPCC={this.state.masterDataPCC}
            availabilityCheckData={this.state.availabilityCheckData}

          />


          <BookingCalendar
            masterDataPCC={this.state.masterDataPCC}
            availabilityCheckData={this.state.availabilityCheckData}
          />

          {/* <Footer className="apply-wizard-footer" style={{ display: 'flex', justifyContent: 'flex-end' }} children={ */}
          <div className="col-sm-12 col-xs-12" style={{ textAlign: 'right' }}>

            <Button
              className="responsive-action-button"
              primary={true}
              label={<Label buttonLabel={true} label="BK_PARKCC_COMMON_BOOK" />}
              fullWidth={true}
              onClick={this.continue}
              startIcon={<ArrowForwardIosIcon />}
            />

          </div>
          {/* }></Footer> */}
        </div>
      </div>
    );
  }
}



const mapStateToProps = state => {
  const { complaints, common, auth, form } = state;
  console.log('state----',state)
  const { complaintSector } = complaints;

  return {
    complaintSector
  }
}
const mapDispatchToProps = dispatch => {
  return {
    toggleSnackbarAndSetText: (open, message, error) =>
      dispatch(toggleSnackbarAndSetText(open, message, error)),
    fetchApplicaionSector: criteria => dispatch(fetchApplicaionSector(criteria)),
  }
}


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CheckAvailability);