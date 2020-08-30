import React, { Component } from "react";
import { Card, Image, Icon, Button } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import isEmpty from "lodash/isEmpty";
import "./index.css";



class PayDetails extends Component {

  render() {
    const { bkPaymentDate,paymentDetails, perDayRupees, bkPaymentReceiptNumber, bkPaymentStatus } = this.props;

   
   
    const label1 = `Base Charges@ Rs.${perDayRupees}/day`
    const perRates = perDayRupees;

    return (
      <div>
        <Card
          textChildren={ 
            <div>
              <div className="rainmaker-displayInline">
                <div className="col-md-4">
                  <Label label="BK_MYBK_FEE_ESTIMATE" containerStyle={{ marginLeft: "13px" }} labelClassName="dark-heading" />
                </div>
                <div className="col-md-4">
                </div>
                <div className="col-md-4">
                  <h5>Total Amount</h5>                
          <h3><b>Rs {paymentDetails?paymentDetails.totalAmount:'NA'}</b></h3>
                </div>
              </div>
                <div className="complaint-detail-detail-section-status row">
                  <div>
                    <div className="col-xs-12">
                      <div className="col-sm-4 col-xs-12">
                        <Label className="col-xs-12  col-sm-12 col-md-12 status-color" 
                        label={label1} />
                        <Label
                          className="col-xs-12 col-sm-12 col-md-12  status-result-color"

                          id="complaint-details-submission-date"
                          labelStyle={{ color: "inherit" }}
                      
                        />
                      </div>
                      <div className="col-sm-4 col-xs-12">
                        <div >
                     
                      <h5 style={{align : "right"}}>{paymentDetails && paymentDetails.billDetails[0] && paymentDetails.billDetails[0].billAccountDetails[1].amount}</h5>
                      </div>
                      </div>
                      <div className="col-sm-4 col-xs-12">
                      </div>
                    </div>
                    {/*second row */}
                   <div className="col-xs-12">
                      <div className="col-sm-4 col-xs-12">
                        <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_TAX_RENT" />
                        <Label
                          className="col-xs-12 col-sm-12 col-md-12  status-result-color"
                          id="complaint-details-submission-date"
                          labelStyle={{ color: "inherit" }}
                          label={bkPaymentStatus}
                        />
                      </div>
                      <div className="col-sm-4 col-xs-12">                      
                      <h5 style={{align : "right"}}>{paymentDetails && paymentDetails.billDetails[0] && paymentDetails.billDetails[0].billAccountDetails[0].amount}</h5>
                      </div>                  
                      <div className="col-sm-4 col-xs-12">
                      </div>
                    </div>
                    <hr class="MuiDivider" style={{marginbottom: "16px"}}></hr>
                    <div className="col-xs-12">
                      <div className="col-sm-4 col-xs-12">
                        <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_TOTAL_AMOUNT" />
                        <Label
                          className="col-xs-12 col-sm-12 col-md-12  status-result-color"

                          id="complaint-details-submission-date"
                          labelStyle={{ color: "inherit" }}
                         
                        />
                      </div>
                      <div className="col-sm-4 col-xs-12">
              <h5>{paymentDetails?paymentDetails.totalAmount:'NA'}</h5>
                      </div>
                      <div className="col-sm-4 col-xs-12">
                      </div>
                    </div>
                  </div>
                </div>
               
            </div>
          }
        />
      </div>
    );
  }
}

export default PayDetails;
