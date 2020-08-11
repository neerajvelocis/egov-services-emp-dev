import React, { Component } from 'react';
import { Tabs, Card, TextField, Icon, Button } from "components";
import Label from "egov-ui-kit/utils/translationNode";



import { fetchComplaintSector } from "egov-ui-kit/redux/complaints/actions";


class BookingsDetails extends Component {
	constructor(props) {
		super(props);
		this.state = {
    sectorData:[]

    }}

    componentDidMount = async () => {

      let {fetchComplaintSector}=this.props;
      fetchComplaintSector();
    }
  continue = e => {
    e.preventDefault();
    this.props.nextStep();
  }

  back = e => {
    e.preventDefault();
    this.props.prevStep();
  }

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
        <TextField
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
        />
        <TextField
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
        />


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
const mapStateToProps = (state, ownProps) => {

  const { complaints, common, auth, form } = state;
  const { complaintSector } = complaints;
  console.log('complaintSector', complaintSector)
  return {
    complaintSector
  }

}
const mapDispatchToProps = dispatch => {
  return {

    fetchComplaintSector: criteria => dispatch(fetchComplaintSector(criteria)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BookingsDetails);