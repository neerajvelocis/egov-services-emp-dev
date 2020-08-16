import React, { Component } from "react";
import { Button, Icon } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import SuccessMessage from "../../modules/SuccessMessage";
import { connect } from "react-redux";
import { createWaterTankerApplication, downloadBWTApplication } from "egov-ui-kit/redux/complaints/actions";
import jp from "jsonpath";
import {
	getQueryArg,
	setBusinessServiceDataToLocalStorage,
	getFileUrlFromAPI,
	setDocuments
} from "egov-ui-framework/ui-utils/commons";
//import "modules/common/common/SuccessMessage/components/successmessage/index.css";
import "./index.css";

class CreateWBTApplicationSuccess extends Component {
  continueComplaintSubmit = () => {
    this.props.history.push("/egov-services/all-applications");
  };
  componentDidMount = async () => {
    console.log('summary create success details', this.props);
  }


  downloadApplicationFunction = async (e) => {
    console.log('this.props in success message form', this.props)
    const { createWaterTankerApplicationData,downloadBWTApplication,userInfo } = this.props;
    let applicationDetails = createWaterTankerApplicationData ? createWaterTankerApplicationData.data : '';
    console.log('applicationDetails in function',applicationDetails)
    let BookingInfo = [
      {
        "applicantDetail": {
          "name":applicationDetails.bkApplicantName,
          "mobileNumber":applicationDetails.bkMobileNumber,
          "houseNo":applicationDetails.bkHouseNo,
          "permanentAddress":applicationDetails.bkCompleteAddress,
          "permanentCity":applicationDetails.bkVillCity,
          "sector":applicationDetails.bkSector,
          "fatherName":applicationDetails.bkFatherName,
          "DOB":applicationDetails.bkDate,
          "email":applicationDetails.bkEmail
        },
        "bookingDetail": {
          "applicationNumber": applicationDetails.bkApplicationNumber,
          "name": applicationDetails.bkApplicantName,
          "mobileNumber":applicationDetails.bkMobileNumber,
          "email": applicationDetails.bkEmail,
          "houseNo":applicationDetails.bkHouseNo,
          "locality": applicationDetails.bkSector,
          "completeAddress": applicationDetails.bkCompleteAddress,
          "applicationDate": applicationDetails.bkDateCreated,
          "applicationDate": applicationDetails.bkDateCreated,
          "propertyType": applicationDetails.bkType,
          "date": applicationDetails.bkDate,
          "time": applicationDetails.bkTime,
          "applicationStatus": "Driver Assigned",
          "applicationType": applicationDetails.bkStatus
        },
        "feeDetail": {
          "baseCharge": 'NA',
          "taxes": 'NA',
          "totalAmount": 'NA'
        },
        "generatedBy": {
          "generatedBy": userInfo.name
        }
      }
    ]

    downloadBWTApplication({ BookingInfo: BookingInfo })

  };

  downloadApplicationButton = async (e) => {
   await this.downloadApplicationFunction();
    const {DownloadBWTApplicationDetails}=this.props;
  //  let fileStoreId=DownloadBWTApplicationDetails&&DownloadBWTApplicationDetails.filestoreIds[0];
    console.log('downloadApplicationButton this.DownloadApplicationDetails',DownloadBWTApplicationDetails)
		var documentsPreview = [];
		let documentsPreviewData;
		if (DownloadBWTApplicationDetails && DownloadBWTApplicationDetails.filestoreIds.length > 0) {	
			documentsPreviewData = DownloadBWTApplicationDetails.filestoreIds[0];
				documentsPreview.push({
					title: "DOC_DOC_PICTURE",
					fileStoreId: documentsPreviewData,
					linkText: "View",
				});
				let fileStoreIds = jp.query(documentsPreview, "$.*.fileStoreId");
				let fileUrls =
					fileStoreIds.length > 0 ? await getFileUrlFromAPI(fileStoreIds) : {};
				console.log("fileUrls", fileUrls);
	
				documentsPreview = documentsPreview.map(function (doc, index) {
					doc["link"] =
						(fileUrls &&
							fileUrls[doc.fileStoreId] &&
							fileUrls[doc.fileStoreId].split(",")[0]) ||
						"";
					//doc["name"] = doc.fileStoreId;
					doc["name"] =
						(fileUrls[doc.fileStoreId] &&
							decodeURIComponent(
								fileUrls[doc.fileStoreId]
									.split(",")[0]
									.split("?")[0]
									.split("/")
									.pop()
									.slice(13)
							)) ||
						`Document - ${index + 1}`;
					return doc;
				});
				console.log('documentsPreview', documentsPreview)
				setTimeout(() => {
					window.open(documentsPreview[0].link);
				}, 100);
				// prepareFinalObject('documentsPreview', documentsPreview)
			}
  
  
  
  }
  render() {
    const { createWaterTankerApplicationData,downloadBWTApplication } = this.props;

    return (
      <div className="success-message-main-screen resolve-success">
        <SuccessMessage
         headermessage="ES_CREATE_WBT_HEADER_MESSAGE"
          successmessage="ES_APPLICATION_CREATED_SUCCESS_MESSAGE"
          secondaryLabel="CS_COMMON_SEND_MESSAGE"
          containerStyle={{ display: "inline-block" }}
          icon={<Icon action="navigation" name="check" />}
          backgroundColor={"#22b25f"}
          applicationNumber={createWaterTankerApplicationData&&createWaterTankerApplicationData.data?createWaterTankerApplicationData.data.bkApplicationNumber:''}
        />
        <div className="responsive-action-button-cont">

          <Button
            className="responsive-action-button"
            primary={true}
            label={<Label buttonLabel={true} label="CORE_COMMON_DOWNLOAD" />}
            fullWidth={true}
            onClick={this.downloadApplicationButton}
            style={{ marginRight: 18 }}
          />


          <Button
            id="resolve-success-continue"
            primary={true}
            label={<Label buttonLabel={true} label="CORE_COMMON_GOTOHOME" />}
            fullWidth={true}
            onClick={this.continueComplaintSubmit}
            className="responsive-action-button"
          />
        </div>
      </div>
    );
  }
}


const mapStateToProps = state => {

  const { complaints, common, auth, form } = state;
  console.log('state in summary', state)
  const { createWaterTankerApplicationData, DownloadBWTApplicationDetails } = complaints;
  console.log('createWaterTankerApplicationData IN SUCESS', createWaterTankerApplicationData, 'DownloadBWTApplicationDetails', DownloadBWTApplicationDetails)
  return {
    createWaterTankerApplicationData, DownloadBWTApplicationDetails
  }

}


const mapDispatchToProps = dispatch => {
  return {
    downloadBWTApplication: criteria => dispatch(downloadBWTApplication(criteria)),
    createWaterTankerApplication: criteria => dispatch(createWaterTankerApplication(criteria)),
    toggleSnackbarAndSetText: (open, message, error) =>
      dispatch(toggleSnackbarAndSetText(open, message, error)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateWBTApplicationSuccess);