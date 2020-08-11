import React, { Component } from 'react';
import { Tabs, Card, TextField, Icon, Button } from "components";
import Label from "egov-ui-kit/utils/translationNode";

class SummaryDetails extends Component {

    submit=e=>{

        console.log('this.props',this.props)
    }

    back = e => {
        e.preventDefault();
        this.props.prevStep();
    }
    render(){
        const { firstName, lastName, jobTitle, jobCompany, email,mobileNo, jobLocation,houseNo,address,locality,residenials } = this.props;
        return(
            <div>
                {/* <h2>Here is the information you entered:</h2> */}
                First Name: <b>{firstName}</b><br />
                Last Name: <b>{email}</b><br />
                Job: <b>{mobileNo}</b><br />
                Company: <b>{houseNo}</b><br />
                Location: <b>{address}</b><br />
                <button className="Back" onClick={this.back}>
                    « Back
                </button>
                <button className="Back" onClick={this.submit}>
                    « Submit
                </button>

            </div>
        );
    }
}

export default SummaryDetails;