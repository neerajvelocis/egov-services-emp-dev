import React, { Component } from 'react';
import PersonalInfo from './components/ApplicatDetails';
import BookingDetails from './components/BookingDetails';
import SummaryInfo from './components/SummaryDetails';
import DocumentDetails from './components/DocumentsDetails';
import ParkPaymentDetails from './components/PaccPaymentDetails'
import { connect } from "react-redux";
import get from "lodash/get";
import moment from 'moment';

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
        toDate: '',transactionNumber:'',bankName:'',paymentMode:'',amount:'',transactionDate:'',discountType:''
,        childrenArray: [{ label: "APPLICANT DETAILS" }, { label: "BOOKING DETAILS" },{ label: "PAYMENT DETAILS" },{ label: "DOCUMENTS" }, { label: "SUMMARY" }]
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
    let fromDate = e.target.value;
    this.setState({
      fromDate
    })
  }
  handleChangeDiscount = (event) => {
    this.setState({ discountType: event.target.value });
  };

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
        let { step, firstName,transactionDate,transactionNumber,bankName,paymentMode,
             lastName,utGST,cGST,GSTnumber,type, jobTitle,facilitationCharges,surcharge,
              jobCompany, approverName,comment,jobLocation, mobileNo, email,
              dimension,cleaningCharges, houseNo,rent, purpose, locality, residenials,discountType } = this.state;
        let bookingData=this.props.stateData.screenConfiguration.preparedFinalObject.availabilityCheckData;
        let vanueData=this.props.stateData.screenConfiguration.preparedFinalObject.bkBookingData;
        let {fromDate,toDate,location,amount}=this.state;
        fromDate =moment(bookingData.bkFromDate).format("YYYY-MM-DD");
        toDate =moment(bookingData.bkToDate).format("YYYY-MM-DD");
        location =bookingData.bkLocation;
        amount=vanueData.amount;
        rent=vanueData.rent;
        utGST=vanueData.utgstRate
        cGST=vanueData.cgstRate
        locality=vanueData.sector;
        cleaningCharges=vanueData.cleaningCharges;
        surcharge=vanueData.surcharge;dimension=vanueData.dimensionSqrYards;
        console.log('fromDate in this.props',fromDate)
        let propsData =this.props
        if (step === 0)
            return (<PersonalInfo
                nextStep={this.nextStep}
                handleChange={this.handleChange}
                firstName={firstName}
                lastName={lastName}
                email={email}
                mobileNo={mobileNo}
                houseNo={houseNo}
            />);

       
        if (step === 1)
            return (<BookingDetails
                houseNo={houseNo}
                handleChangeDiscount={this.handleChangeDiscount}
                discountType={discountType}
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
            return (<ParkPaymentDetails
                nextStep={this.nextStep}
                prevStep={this.prevStep}
                handleChange={this.handleChange}
                transactionNumber={transactionNumber}
                bankName={bankName}
                paymentMode={paymentMode}
                amount={amount}
                transactionDate={transactionDate}
                discountType={discountType}
            />);

            if (step === 3)
            return (<DocumentDetails
                nextStep={this.nextStep}
                rent={rent}
                prevStep={this.prevStep}
                handleChange={this.handleChange}
                firstName={firstName}
                lastName={lastName}
                email={email}
                mobileNo={mobileNo}
            />);
        if (step === 4)
            return (<SummaryInfo
                discountType={discountType}
                approverName={approverName}
                amount={amount}
                bankName={bankName}
                transactionDate={transactionDate}
                transactionNumber={transactionNumber}
                paymentMode={paymentMode}
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


const mapStateToProps = state => {
    const { complaints, common, auth, form } = state;
    console.log('state--->>apply',state)
    let stateData = state;
  
    return {
      stateData
    }
  }
  export default connect(
    mapStateToProps,
    null
  )(StepForm);
