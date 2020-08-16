import React, { Component } from 'react';
import { Tabs, Card, TextField, Icon, Button } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { toggleSnackbarAndSetText } from "egov-ui-kit/redux/app/actions";
import { connect } from "react-redux";
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import { fetchApplicaionSector } from "egov-ui-kit/redux/complaints/actions";
import "./index.css";
class BookingsDetails extends Component {

  state = {
    open: false, setOpen: false
  }

  componentDidMount = async () => {
    let {fetchApplicaionSector}=this.props;
    fetchApplicaionSector();
  }
  continue = e => {
    e.preventDefault();
    const { jobTitle, jobCompany, toggleSnackbarAndSetText,jobLocation, handleChange, houseNo, address, locality, residenials } = this.props;

    if(houseNo==""||address==""||locality==""||residenials==""){

      toggleSnackbarAndSetText(
        true,
        {
          labelName: "Error_Message_For_Water_tanker_Application",
          labelKey: `Error_Message_For_Water_tanker_Application`
        },
        "warning"
      );
    }else{
      this.props.nextStep();

    }
  }

  back = e => {
    e.preventDefault();
    this.props.prevStep();
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
  render() {
    const { jobTitle, jobCompany, jobLocation,complaintSector, handleChange, houseNo, address, locality, residenials } = this.props;
    let sectorData=[];
    sectorData.push(complaintSector);

    let arrayData=[];
   
    let y=sectorData.forEach((item,index)=>{
    let finalValues=Object.values(item);
    finalValues.forEach((event)=>{
          arrayData.push(event);
      })
    })


    
    console.log('arrayData',arrayData,'complaintSector',complaintSector)
    const hintTextStyle = {
      letterSpacing: "0.7px",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      width: "90%",
      overflow: "hidden"
    };
    return (
      
      <div style={{float: 'left', width: '100%', padding: '36px 15px' }}>
      <div className="col-xs-12" style={{background:'#fff', padding: '15px 0'}}>
        
      <div className="col-sm-6 col-xs-6">
      
        <TextField
          id="houseNo"
          name="houseNo"
          type="text"
          
          value={houseNo}
          hintText={
            <Label
              label="MYBK_CITIZEN_HOUSE_NUMBER_PLACEHOLDER"
              color="rgba(0, 0, 0, 0.3799999952316284)"
              fontSize={16}
              labelStyle={hintTextStyle}
            />
          }
          floatingLabelText={
            <Label
              key={0}
              label="MYBK_CREATE_HOUSE_NUMBER"
              color="rgba(0,0,0,0.60)"
              fontSize="12px"
            />
          }
          onChange={handleChange('houseNo')}
          underlineStyle={{ bottom: 7 }}
          underlineFocusStyle={{ bottom: 7 }}
          hintStyle={{ width: "100%" }}
        />
        </div>
        
        <div className="col-sm-6 col-xs-6">
        <TextField
          id="address"
          name="address"
          type="text"
          value={address}
          hintText={
            <Label
              label="MYBK_NAME_CITIZEN_ADDRESS_PLACEHOLDER"
              color="rgba(0, 0, 0, 0.3799999952316284)"
              fontSize={16}
              labelStyle={hintTextStyle}
            />
          }
          floatingLabelText={
            <Label
              key={0}
              label="MYBK_CREATE_CITIZEN_ADDRESS"
              color="rgba(0,0,0,0.60)"
              fontSize="12px"
            />
          }
          onChange={handleChange('address')}
          underlineStyle={{ bottom: 7 }}
          underlineFocusStyle={{ bottom: 7 }}
          hintStyle={{ width: "100%" }}
        />
        </div>
        
        <div className="col-sm-6 col-xs-6">

        <FormControl style={{ width: '100%' }}>
          <InputLabel shrink style={{ width: '100%' }} id="demo-controlled-open-select-label">Locality</InputLabel>
          <Select
            maxWidth={false}
            labelId="demo-controlled-open-select-label-Locality"
            id="demo-controlled-open-select-locality"
            open={this.state.SetOpen}
            onClose={() => this.handleClose()}
            onOpen={() => this.handleOpen()}
            value={locality}
            displayEmpty
            onChange={handleChange('locality')}
          >
             {arrayData.map((child, index) => (

           
            <MenuItem value={child.name}>{child.name}</MenuItem>
            ))}
            {/* <MenuItem value='SECTOR-1'>Sector-1</MenuItem>
            <MenuItem value='SECTOR-2'>Sector-2</MenuItem>
            <MenuItem value='SECTOR-3'>Sector-3</MenuItem>
            <MenuItem value='SECTOR-4'>Sector-4</MenuItem> */}
          </Select>
        </FormControl>
        
        </div>
        
        <div className="col-sm-6 col-xs-6">
        <FormControl style={{ width: '100%' }}>
          <InputLabel shrink style={{ width: '100%' }} id="demo-controlled-open-select-label">Residentials/Commercials</InputLabel>
          <Select
            maxWidth={false}
            labelId="demo-controlled-open-select-label"
            id="demo-controlled-open-select"
            open={this.state.SetOpen}
            displayEmpty
            onClose={() => this.handleClose()}
            onOpen={() => this.handleOpen()}
            value={residenials}
            onChange={handleChange('residenials')}
          >
            <MenuItem value="" disabled>Residential/Commercial</MenuItem>
            <MenuItem value='Residential'>Residential</MenuItem>
            <MenuItem value='Commercial'>Commercial</MenuItem>
          </Select>
        </FormControl>

        
        </div>
        
        
        
      <div className="col-sm-12 col-xs-12" style={{textAlign: 'right'}}>

        <Button
            className="responsive-action-button"
            primary={true}
            label={<Label buttonLabel={true} label="CORE_COMMON_GOBACK" />}
            fullWidth={true}
            onClick={this.back}
            style={{marginRight:18}}
            startIcon={<ArrowBackIosIcon />}
          />
          <Button
            className="responsive-action-button"
            primary={true}
            label={<Label buttonLabel={true} label="CORE_COMMON_GONEXT" />}
            fullWidth={true}
            onClick={this.continue}
            startIcon={<ArrowForwardIosIcon />}
          />
        </div>

        {/* <button className="Back" onClick={this.back}>
          « Previous
                </button> */}
        {/* <button className="Next" onClick={this.continue}>
          Next »
                </button> */}
      </div>
    </div>
    );
  }
}
const mapStateToProps = state => {

  console.log('state======>>>>>', state)
  const { complaints, common, auth, form } = state;
  const { complaintSector } = complaints;
  console.log('complaintSector', complaintSector)
  

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
)(BookingsDetails);
