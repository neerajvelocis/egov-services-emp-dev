import React, { Component } from "react";
import { Image, Card, Icon } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import FloatingActionButton from "material-ui/FloatingActionButton";
import "./index.css";

class SuccessMessage extends Component {
  render() {
    const { successmessage, employeeName, secondaryLabel,headermessage, applicationNumber, tertiaryLabel, icon, backgroundColor } = this.props;
    return (
      <div className="wt-app-details">
        <div className="container-fluid">
          <div className="row spl-application-header" style={{marginTop: '40px',marginBottom: '30px', marginLeft: '-6px'}}>
            <div className="col-sm-3 spl-app-header-text">  <Label label={headermessage} /></div>
            {/* <div class="col-sm-4" > <Label label= {applicationNumber}/></div> */}
            <div class="col-sm-5">  </div>
          </div>

        </div>
        <Card

          className="complaint-card" style={{margin: '0px 21px',padding: '30px 8px'}}
          textChildren={
            <div className="complaint-card-wrapper" style={{    paddingLeft: '20px',
              paddingBottom: '15px'}}>
          <div class="row">
            <div class="col-sm-1"> <FloatingActionButton className="floating-button" style={{ boxShadow: 0, marginTop: 15 }} backgroundColor={backgroundColor}>
                {icon}
              </FloatingActionButton></div>
            <div class="col-sm-8" >   
            <Label className="thankyou-text" style={{ fontSize: 30, fontWeight: 'bold' }} label={successmessage} color="#767676" />
            <Label className="thankyou-text-message" label={secondaryLabel} color="#767676" /></div>
            {/* <div class="col-sm-3">  <Label label={"BK_MYBK_WATER_TANKER_REQUESTNO"} /><Label label= {applicationNumber}/> </div> */}
          </div>
         
            </div>
          }
        />
       <style>{
          `
            .wt-app-details .label-container.thankyou-text div{
              letter-spacing: 0.7px;
              font-size:27px !important;
            }
            .wt-app-details .label-container.thankyou-text-message div{
              letter-spacing: 0.7px;
              font-size:14px !important;
            }
            .wt-app-details .spl-application-header .spl-app-header-text div.label-text{font-size: 24px !important;font-weight: 400;}
            `
        }
        </style>
      </div>

    );
  }
}

export default SuccessMessage;
