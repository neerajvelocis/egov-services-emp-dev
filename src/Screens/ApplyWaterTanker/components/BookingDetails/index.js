import React, { Component } from 'react';
import { Tabs, Card, TextField, Icon, Button } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

class BookingsDetails extends Component {

  state = {
    open: false, setOpen: false
  }
  continue = e => {
    e.preventDefault();
    this.props.nextStep();
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
    const { jobTitle, jobCompany, jobLocation, handleChange, houseNo, address, locality, residenials } = this.props;
    const hintTextStyle = {
      letterSpacing: "0.7px",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      width: "90%",
      overflow: "hidden"
    };
    return (
      <div>
        {/* <h2>Enter your job information:</h2> */}

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
        {/* <TextField
          id="locality"
          name="locality"
          type="text"
          value={locality}
          hintText={
            <Label
              label="MYBK_NAME_CITIZEN_LOCALITY_PLACEHOLDER"
              color="rgba(0, 0, 0, 0.3799999952316284)"
              fontSize={16}
              labelStyle={hintTextStyle}
            />
          }
          floatingLabelText={
            <Label
              key={0}
              label="MYBK_CREATE_CITIZEN_LAOCACITY"
              color="rgba(0,0,0,0.60)"
              fontSize="12px"
            />
          }
          onChange={handleChange('locality')}
          underlineStyle={{ bottom: 7 }}
          underlineFocusStyle={{ bottom: 7 }}
          hintStyle={{ width: "100%" }}
        /> */}

        <FormControl style={{ width: '100%' }}>
          <InputLabel shrink style={{ width: '100%' }} id="demo-controlled-open-select-label">Application Status</InputLabel>
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
            <MenuItem value="" disabled>Locality</MenuItem>
            <MenuItem value='SECTOR-1'>Sector-1</MenuItem>
            <MenuItem value='SECTOR-2'>Sector-2</MenuItem>
            <MenuItem value='SECTOR-3'>Sector-3</MenuItem>
            <MenuItem value='SECTOR-4'>Sector-4</MenuItem>
          </Select>
        </FormControl>
        <FormControl style={{ width: '100%' }}>
          <InputLabel shrink style={{ width: '100%' }} id="demo-controlled-open-select-label">Booking Type</InputLabel>
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
            <MenuItem value="" disabled>Residentials/Commercial</MenuItem>
            <MenuItem value='OSBM'>Residentials</MenuItem>
            <MenuItem value='WATER_TANKERS'>Commercial</MenuItem>
          </Select>
        </FormControl>






        {/* <TextField
          id="residenials"
          name="residenials"
          type="text"
          value={residenials}
          hintText={
            <Label
              label="MYBK_CITIZEN_RESIDENTIALS_PLACEHOLDER"
              color="rgba(0, 0, 0, 0.3799999952316284)"
              fontSize={16}
              labelStyle={hintTextStyle}
            />
          }
          floatingLabelText={
            <Label
              key={0}
              label="MYBK_CREATE_CITIZEN_RESIDENTIALS"
              color="rgba(0,0,0,0.60)"
              fontSize="12px"
            />
          }
          onChange={handleChange('residenials')}
          underlineStyle={{ bottom: 7 }}
          underlineFocusStyle={{ bottom: 7 }}
          hintStyle={{ width: "100%" }}
        /> */}


        {/*                
               
                <label>
                    <input 
                        type="text"
                        name="jobTitle"
                        value={jobTitle}
                        onChange={handleChange('jobTitle')}
                        placeholder="Job Title"
                    />
                </label>
                <label>
                    <input 
                        type="text"
                        name="jobCompany"
                        value={jobCompany}
                        onChange={handleChange('jobCompany')}
                        placeholder="Company"
                    />
                </label>
                <label>
                    <input 
                        type="text"
                        name="jobCompany"
                        value={jobLocation}
                        onChange={handleChange('jobLocation')}
                        placeholder="Location"
                    />
                </label>
              
              
               */}

        <button className="Back" onClick={this.back}>
          « Back
                </button>
        <button className="Next" onClick={this.continue}>
          Next »
                </button>
      </div>
    );
  }
}

export default BookingsDetails;