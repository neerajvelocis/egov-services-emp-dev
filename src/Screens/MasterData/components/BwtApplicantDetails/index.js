import React, { Component } from "react";
import { Card, Image, Icon, Button } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import isEmpty from "lodash/isEmpty";
import "./index.css";

const iconStyle = {
  marginRight: "13px",
  height: "24px",
  width: "24px",
};

const imageStyles = {
  maxHeight: "100px",
  minHeight: "100px",
};

const mapIconStyle = {
  marginRight: "7px",
  height: "12px",
  width: "14px",
  borderRadius: "50%",
};

class BwtApplicantDetails extends Component {
  navigateToComplaintType = () => {
    this.props.history.push("/complaint-type");
  };
  getImageSource = (imageSource, size) => {
    const images = imageSource.split(",");
    if (!images.length) {
      return null;
    }
    switch (size) {
      case "small":
        imageSource = images[2];
        break;
      case "medium":
        imageSource = images[1];
        break;
      case "large":
      default:
        imageSource = images[0];
    }
    return imageSource || images[0];
  };
  onImageClick = (source) => {
    window.open(this.getImageSource(source, "large"), 'Image');
  };

  render() {
    const { status, applicantName, applicationNo, bkEmail, bkConstructionType, areaRequired, bkDuration, bkCategory, submittedDate, bkMobileNumber, dateCreated, address, sector, houseNo, bookingType, mapAction, images, action, role } = this.props;

    const titleKey = applicationNo.toUpperCase();

    return (
      <div>
        <Card
          textChildren={
            <div>
              <div className="rainmaker-displayInline">
                <Label label="MYBK_APPLICANT_DETAILS" containerStyle={{ marginLeft: "13px" }} labelClassName="dark-heading" />
              </div>
              <div key={10} className="complaint-detail-full-width">
                <div className="complaint-detail-detail-section-status row">
                  <div className="col-md-4">
                    <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="MYBK_APPLICANT_NAME" />
                    <Label
                      className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                      label={applicantName}
                      id="complaint-details-submission-date"
                      labelStyle={{ color: "inherit" }}
                    />
                  </div>
                  <div className="col-md-4">
                    <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="MYBK_APPLICANT_DETAILS_EMAIL" />
                    <Label
                      className="col-xs-6  col-sm-8 col-md-10  status-result-color"
                      id="complaint-details-current-status"
                      labelStyle={{ color: "inherit" }}
                      label={bkEmail}
                    />
                  </div>
                  <div className="col-md-4">
                    <Label className="col-xs-112  col-sm-12 col-md-12 status-color" label="MYBK_APPLICANT_MOBILENUMBER" />
                    <Label
                      className="col-xs-12 col-sm-12 col-md-12  status-result-color"

                      id="complaint-details-submission-date"
                      labelStyle={{ color: "inherit" }}
                      label={bkMobileNumber}
                    />
                  </div>
                  <div className="col-md-4">
                    <Label className="col-xs-112  col-sm-12 col-md-12 status-color" label="MYBK_APPLICANT_ADDRESS" />
                    <Label
                      className="col-xs-12 col-sm-12 col-md-12  status-result-color"

                      id="complaint-details-submission-date"
                      labelStyle={{ color: "inherit" }}
                      label={address}
                    />
                  </div>
                  <div className="col-md-4">
                    <Label className="col-xs-112  col-sm-12 col-md-12 status-color" label="MYBK_APPLICANT_HOUSENO" />
                    <Label
                      className="col-xs-12 col-sm-12 col-md-12  status-result-color"

                      id="complaint-details-submission-date"
                      labelStyle={{ color: "inherit" }}
                      label={houseNo}
                    />
                  </div>
                  <div className="col-md-4">
                    <Label className="col-xs-112  col-sm-12 col-md-12 status-color" label="MYBK_APPLICANT_SECTOR" />
                    <Label
                      className="col-xs-12 col-sm-12 col-md-12  status-result-color"

                      id="complaint-details-submission-date"
                      labelStyle={{ color: "inherit" }}
                      label={sector}
                    />
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

export default BwtApplicantDetails;
