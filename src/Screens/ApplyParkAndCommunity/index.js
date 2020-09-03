import React, { Component } from 'react';
import PersonalInfo from './components/ApplicatDetails';
import BookingDetails from './components/BookingDetails';
import SummaryInfo from './components/SummaryDetails';
import DocumentDetails from './components/DocumentsDetails';
import { Box, Button, Card, CardContent, CircularProgress, Grid, Step, StepLabel, Stepper } from '@material-ui/core';

export class StepForm extends Component {
    state = {
        step: 0,

        
        firstName: '',
        lastName: '',
        email: '',
        mobileNo: '',
        jobTitle: '',
        jobCompany: '',
        jobLocation: '',
        houseNo: '',
        purpose: '',
        locality: '',
        residenials: '',
        approverName:'',
        comment:'',
        dimension:'',
        location:'',
        cleaningCharges:'',
        rent:'',
        facilitationCharges:'',
        surcharge:'',utGST:'',cGST:'',
        GSTnumber:'',type:'',
        fromDate: '',
        toDate: '',
        childrenArray: [{ label: "APPLICANT DETAILS" }, { label: "BOOKING DETAILS" },{ label: "DOCUMENTS" }, { label: "SUMMARY" }]

    }

    nextStep = () => {
        const { step } = this.state;

        this.setState({
            step: step + 1
        });
    }

    prevStep = () => {
        const { step } = this.state;
        this.setState({
            step: step - 1
        });
    }
  
    firstStep = () => {
        const { step } = this.state;
        this.setState({
            step: step - 3
        });
    }
    
 onFromDateChange = e => {
    const fromDate = e.target.value;
    this.setState({
      fromDate
    })
  }

  onToDateChange = e => {
    const toDate = e.target.value;
    this.setState({
      toDate: toDate
    })
  }
    handleChange = input => e => {
        this.setState({ [input]: e.target.value });
    }

    showStep = () => {
        const { step, firstName, fromDate, toDate, lastName,utGST,cGST,GSTnumber,type, jobTitle,facilitationCharges,surcharge, jobCompany, approverName,comment,jobLocation, mobileNo, email,location,dimension,cleaningCharges, houseNo,rent, purpose, locality, residenials } = this.state;
        let propsData =this.props
        if (step === 0)
            return (<PersonalInfo
                nextStep={this.nextStep}
                handleChange={this.handleChange}
                firstName={firstName}
                lastName={lastName}
                email={email}
                mobileNo={mobileNo}
            />);

       
        if (step === 1)
            return (<BookingDetails
                houseNo={houseNo}
                onFromDateChange={this.onFromDateChange}
                onToDateChange={this.onToDateChange}
                fromDate={fromDate}
                toDate={toDate}
                dimension={dimension}
                location={location}
                cleaningCharges={cleaningCharges}
                purpose={purpose}
                rent={rent}
                utGST={utGST}
                cGST={cGST}
                GSTnumber={GSTnumber}
                surcharge={surcharge}
                facilitationCharges={facilitationCharges}
                residenials={residenials}
                locality={locality}
                nextStep={this.nextStep}
                prevStep={this.prevStep}
                handleChange={this.handleChange}
                jobTitle={jobTitle}
                jobCompany={jobCompany}
                jobLocation={jobLocation}
                approverName={approverName}
                comment={comment}
                type={type}
            />);

            if (step === 2)
            return (<DocumentDetails
                nextStep={this.nextStep}
                handleChange={this.handleChange}
                firstName={firstName}
                lastName={lastName}
                email={email}
                mobileNo={mobileNo}
            />);
        if (step === 3)
            return (<SummaryInfo
                approverName={approverName}
                comment={comment}
                firstName={firstName}
                purpose={purpose}
                utGST={utGST}
                lastName={lastName}
                jobTitle={jobTitle}
                jobCompany={jobCompany}
                jobLocation={jobLocation}
                prevStep={this.prevStep}
                mobileNo={mobileNo}
                email={email}
                houseNo={houseNo}
                dimension={dimension}
                location={location}
                cleaningCharges={cleaningCharges}
                type={type}
                rent={rent}
                cGST={cGST}
                fromDate={fromDate}
                toDate={toDate}
                GSTnumber={GSTnumber}
                surcharge={surcharge}
                facilitationCharges={facilitationCharges}
                locality={locality}
                residenials={residenials}
                {...propsData}
                firstStep={this.firstStep}
            />);
    }

    render() {
        const { step } = this.state;

        return (
            <div>
            <div className="col-xs-12" style={{ padding: 0, float: 'left', width: '100%' }}>
              <div className="col-sm-12 col-xs-12">
                    <Stepper alternativeLabel activeStep={step}>
                        {this.state.childrenArray.map((child, index) => (
                            <Step key={child.label}>
                                <StepLabel>{child.label}</StepLabel>
                            </Step>
                        ))}

                    </Stepper>
                </div>
            </div>
                {this.showStep()}
            </div>
        );
    }
}

export default StepForm;