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
import { fetchApplicaionSector } from "egov-ui-kit/redux/complaints/actions";
import BookingMedia from "../BookingMedia";
import BookingCalendar from "../BookingCalendar"
import { httpRequest } from "egov-ui-kit/utils/api";
import get from "lodash/get";
import set from "lodash/set";
import BookingTimeSlot from "../BookingTimeSlot";
import SelectedTimeSlotInfo  from "../SelectedTimeSlotInfo"

class CheckAvailability extends Component {
  state = {
    vanueType: "Parks",
    open: false, setOpen: false, locality: '', masterDataPCC: [], availabilityCheckData: { bkBookingType: 'Parks' },
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
    console.log('event.target.value in radio', event.target.value)
    this.setState({ vanueType: event.target.value });
    this.setState({ availabilityCheckData: { bkBookingType: event.target.value } })
  };

  getSectorDataFromAPI = async (availabilityCheck) => {
    let venueType = availabilityCheck.bkBookingType;
    let sector = availabilityCheck.bkSector.toUpperCase()
    console.log('hello in sector getSectorDataFromAPI', availabilityCheck, this.props);
    let { userInfo } = this.props;
    let requestbody = {
      "venueType": venueType,
      "tenantId": userInfo.tenantId,
      "sector": sector
    };

    let sectorDataFromMaster = await httpRequest(
      "bookings/park/community/master/_fetch?",
      "_search", [],
      requestbody
    );
    this.setState({ masterDataPCC: sectorDataFromMaster.data })

  }


  sectorHandleChange = input => e => {
    // let sector= e.target.value.toUpperCase();
    let availabilityCheck = { "bkSector": e.target.value, bkBookingType: this.state.vanueType };
    this.setState({ availabilityCheckData: availabilityCheck })
    this.getSectorDataFromAPI(availabilityCheck);

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
    const { firstName, email, mobileNo, lastName, stateData,handleChange,sImageUrl, complaintSector } = this.props;
    let sectorData = [];
console.log('this.props in check avail render availabilityCheckData',this.state.availabilityCheckData)
let vanueData=this.props.stateData.screenConfiguration.preparedFinalObject.bkBookingData;
console.log('vanueData in render check vail---',vanueData)
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
            <div style={{ paddingBottom: '5px', marginLeft: '15px' }}>
              <Label label="BK_MYBK_CHECK_AVAILABILITY" labelClassName="dark-heading" />
            </div>
            <div className="col-sm-6 col-xs-6">
              <FormControl component="fieldset">
                <FormLabel component="legend"><Label label="BK_MYBK_BOOKING_TYPE" /></FormLabel>
                <RadioGroup row aria-label="position" name="gender1" value={this.state.vanueType} onChange={this.handleChange}>
                  <FormControlLabel value="Community Center" control={<Radio color="primary" />} label="Commuunity Center" />
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
 
          {this.state.availabilityCheckData&&this.state.availabilityCheckData.bkSector &&(
          <BookingMedia
            masterDataPCC={this.state.masterDataPCC}
            availabilityCheckData={this.state.availabilityCheckData}
            pacc_image_initial_path ={sImageUrl&&sImageUrl[0].Value}
          />
            )} 

      
	{this.state.availabilityCheckData && this.state.availabilityCheckData.bkBookingType=='Community Center' &&(vanueData&&vanueData.bookingAllowedFor!='')&&(
          <BookingTimeSlot
            masterDataPCC={this.state.masterDataPCC}
            availabilityCheckData={this.state.availabilityCheckData}
          />

  )}
 {this.state.availabilityCheckData && this.state.availabilityCheckData.bkBookingType=='Community Center' &&(vanueData&&vanueData.bookingAllowedFor!='')&&(
  <SelectedTimeSlotInfo
          masterDataPCC={this.state.masterDataPCC}
          availabilityCheckData={this.state.availabilityCheckData}
          />
          )}

  {this.state.availabilityCheckData && this.state.availabilityCheckData.bkSector &&vanueData!=undefined&& vanueData.bookingAllowedFor==''&&(
      <BookingCalendar
            masterDataPCC={this.state.masterDataPCC}
            availabilityCheckData={this.state.availabilityCheckData}
            bookingVenue={this.props && this.props.bookingVenue}
          />
          )}
          {/* <Footer className="apply-wizard-footer" style={{ display: 'flex', justifyContent: 'flex-end' }} children={ */}
          {this.state.availabilityCheckData && this.state.availabilityCheckData.bkSector &&vanueData!=undefined&&(
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
               )}
          {/* }></Footer> */}
        </div>
      </div>
    );
  }
}



const mapStateToProps = state => {
  const { complaints, common, auth, form } = state;
  console.log('state----', state)
  let stateData = state;
  const { complaintSector,sImageUrl } = complaints;
  // let bookingVenue=state&&state.screenConfiguration.preparedFinalObject.availabilityCheckData.bkLocation;
  var bookingVenueData = state && state.screenConfiguration.preparedFinalObject.availabilityCheckData;
  let bookingVenue = bookingVenueData && bookingVenueData.bkLocation ? bookingVenueData.bkLocation : '';
  return {
    complaintSector, bookingVenue,stateData,sImageUrl
  }
}
const mapDispatchToProps = dispatch => {
  return {
    toggleSnackbarAndSetText: (open, message, error) =>
      dispatch(toggleSnackbarAndSetText(open, message, error)),
    fetchApplicaionSector: () => dispatch(fetchApplicaionSector()),
  }
}


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CheckAvailability);