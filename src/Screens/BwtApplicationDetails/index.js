import React, { Component } from "react";
import { Details } from "modules/common";
import { ComplaintTimeLine } from "modules/common";
import { Comments } from "modules/common";
import { ActionButton } from "modules/common";
import { Icon, MapLocation, ShareButton } from "components";
import CommonShare from "egov-ui-kit/components/CommonShare";
import { Screen } from "modules/common";
import pinIcon from "egov-ui-kit/assets/Location_pin.svg";
import { resetFiles } from "egov-ui-kit/redux/form/actions";
import Button from "@material-ui/core/Button";
import ShareIcon from "@material-ui/icons/Share";
import get from "lodash/get";
import isEqual from "lodash/isEqual";
import { prepareFormData } from "egov-ui-kit/redux/common/actions";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import OSMCCBookingDetails from "../AllApplications/components/OSMCCBookingDetails"
import BwtApplicantDetails from "../AllApplications/components/BwtApplicantDetails"
import BookingDetails from "../AllApplications/components/BookingDetails"
import DocumentPreview from "../AllApplications/components/DocumentPreview"
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import DialogContainer from "../../modules/DialogContainer"
import PaymentDetails from "../AllApplications/components/PaymentDetails"
import Footer from "../../modules/footer"
import ActionButtonDropdown from '../../modules/ActionButtonDropdown'
import BwtApplicationDriverDetailsfrom from "../AllApplications/components/BwtApplicationDriverDetails"


import jp from "jsonpath";
import {
	getQueryArg,
	setBusinessServiceDataToLocalStorage,
	getFileUrlFromAPI,
	setDocuments
} from "egov-ui-framework/ui-utils/commons";
import {
	getDateFromEpoch,
	mapCompIDToName,
	isImage,
	fetchImages,
	returnSLAStatus,
	getPropertyFromObj,
	findLatestAssignee,
	getTranslatedLabel
} from "egov-ui-kit/utils/commons";
import {
	fetchApplications, fetchPayment, fetchHistory, fetchDataAfterPayment,
	sendMessage,
	sendMessageMedia,downloadReceiptforCG,downloadBWTApplication
} from "egov-ui-kit/redux/complaints/actions";
import { connect } from "react-redux";

import "./index.css";
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import AssignTODriver from "../AssignToDriver";
import RejectBWTBooking from "../RejectBWTBooking";
import DeliveredBWTBooking from "../DeliveredBWTBooking";



const styles = (theme) => ({

});

const DialogTitle = withStyles(styles)((props) => {
	const { children, classes, onClose, ...other } = props;
	return (
		<MuiDialogTitle disableTypography className={classes.root} {...other}>
			<Typography variant="h6">{children}</Typography>
			{onClose ? (
				<IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
					<CloseIcon />
				</IconButton>
			) : null}
		</MuiDialogTitle>
	);
});


class BwtApplicationDetails extends Component {
	constructor(props) {
		super(props);
		this.state = {
			openMap: false,
			docFileData: [],
			bookingType: '',
			open: false,
			setOpen: false,
			togglepopup: false,
			actionOnApplication: '',
			actionTittle: '',
		};
	};
	componentDidMount = async () => {
		let {
			fetchApplications,
			fetchHistory, fetchDataAfterPayment,
			fetchPayment,
			match,
			resetFiles,
			transformedComplaint,
			prepareFormData,
			userInfo,
			documentMap,
			prepareFinalObject,
			downloadReceiptforCG,downloadBWTApplication
		} = this.props;

	

		prepareFormData("complaints", transformedComplaint);

		const { complaint } = transformedComplaint;
		fetchApplications(
			{
				"applicationNumber": match.params.applicationId, 'uuid': userInfo.uuid,
				"applicationStatus": "",
				"mobileNumber": "", "bookingType": ""
			}
		);
		fetchHistory([
			{ key: "businessIds", value: match.params.applicationId }, { key: "history", value: true }, { key: "tenantId", value: userInfo.tenantId }])

		fetchPayment(
			[{ key: "consumerCode", value: match.params.applicationId }, { key: "businessService", value: "BWT" }, { key: "tenantId", value: userInfo.tenantId }
			])

		fetchDataAfterPayment(
			[{ key: "consumerCodes", value: match.params.applicationId }, { key: "tenantId", value: userInfo.tenantId }
			])

		let { details } = this.state;

	}

	componentWillReceiveProps = async (nextProps) => {
	
		const { transformedComplaint, prepareFormData } = this.props;
		if (!isEqual(transformedComplaint, nextProps.transformedComplaint)) {
			prepareFormData("complaints", nextProps.transformedComplaint);
		}
	}

//Payment Receipt
downloadReceiptButton = async (e) => {
	
	await this.downloadReceiptFunction();

	
	let documentsPreviewData;
	const { DownloadReceiptDetailsforCG } = this.props;
	
	var documentsPreview = [];
	if (DownloadReceiptDetailsforCG && DownloadReceiptDetailsforCG.filestoreIds.length > 0) {

	
		 documentsPreviewData=DownloadReceiptDetailsforCG.filestoreIds[0];
		
		// let keys = Object.keys(documentMap);
		// let values = Object.values(documentMap);
		// let id = keys[0], fileName = values[0];

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
	
		setTimeout(() => {
			window.open(documentsPreview[0].link);
		}, 100);
		prepareFinalObject('documentsPreview', documentsPreview)
	}
}

downloadReceiptFunction = async (e) => {
	const { transformedComplaint, paymentDetailsForReceipt, downloadPaymentReceiptforCG,downloadReceiptforCG, userInfo, paymentDetails } = this.props;
	const { complaint } = transformedComplaint;

	let BookingInfo = [{
		"applicantDetail": {
			"name": complaint && complaint.applicantName ? complaint.applicantName : 'NA',
			"mobileNumber": complaint && complaint.bkMobileNumber ? complaint.bkMobileNumber : '',
			"houseNo": complaint && complaint.houseNo ? complaint.houseNo : '',
			"permanentAddress": complaint && complaint.address ? complaint.address : '',
			"permanentCity": complaint && complaint.villageCity ? complaint.villageCity : '',
			"sector": complaint && complaint.sector ? complaint.sector : ''
		},
		"booking": {
			"bkApplicationNumber": complaint && complaint.applicationNo ? complaint.applicationNo : ''
		},
		"paymentInfo": {
			"paymentDate": paymentDetailsForReceipt && convertEpochToDate(paymentDetailsForReceipt.Payments[0].transactionDate, "dayend"),
			"transactionId": paymentDetailsForReceipt && paymentDetailsForReceipt.Payments[0].transactionNumber,
			"bookingPeriod": getDurationDate(
				complaint.bkFromDate,
				complaint.bkToDate
			),
			"bookingItem": "Online Payment Against Booking of Open Space WithIn MCC",
			"amount": paymentDetailsForReceipt.Payments[0].paymentDetails[0].bill.billDetails[0].billAccountDetails.filter(
				(el) => !el.taxHeadCode.includes("TAX")
			)[0].amount,
			"tax": paymentDetailsForReceipt.Payments[0].paymentDetails[0].bill.billDetails[0].billAccountDetails.filter(
				(el) => el.taxHeadCode.includes("TAX")
			)[0].amount,
			"grandTotal": paymentDetailsForReceipt.Payments[0].totalAmountPaid,
			"amountInWords": this.NumInWords(
				paymentDetailsForReceipt.Payments[0].totalAmountPaid
			),
			paymentItemExtraColumnLabel: "Booking Period",
			paymentMode:
				paymentDetailsForReceipt.Payments[0].paymentMode,
			receiptNo:
				paymentDetailsForReceipt.Payments[0].paymentDetails[0]
					.receiptNumber,
			// name: paymentDetailsForReceipt.Payments[0].payerName,
			//     mobileNumber:
			//         paymentDetailsForReceipt.Payments[0].mobileNumber,
		},
		payerInfo: {
			payerName: paymentDetailsForReceipt.Payments[0].payerName,
			payerMobile:
				paymentDetailsForReceipt.Payments[0].mobileNumber,
		},
		generatedBy: {
			generatedBy: userInfo.name,
		},
	}
	]
	downloadReceiptforCG({BookingInfo: BookingInfo})
}
//Payment Receipt

//ApplicationDownload
downloadApplicationMCCButton = async (e) => {
	await this.downloadApplicationFunction();
	
	 const {DownloadBWTApplicationDetails}=this.props;
   //  let fileStoreId=DownloadBWTApplicationDetails&&DownloadBWTApplicationDetails.filestoreIds[0];
	
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
				
				 setTimeout(() => {
					 window.open(documentsPreview[0].link);
				 }, 100);
				 // prepareFinalObject('documentsPreview', documentsPreview)
			 } 
   }

   downloadApplicationFunction = async (e) => {
 
    const { createWaterTankerApplicationData,downloadBWTApplication,userInfo } = this.props;
    let applicationDetails = createWaterTankerApplicationData ? createWaterTankerApplicationData.data : '';
  
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
          "applicationStatus": applicationDetails.bkApplicationStatus,
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
    console.log('hello2 in success')
  };
//ApplicationDownload

	btnOneOnClick = (value, complaintNo) => {
	
		if (value == 'APPROVED') {
			this.setState({
				actionTittle: "Assign To Driver"
			})
		} else if (value == 'REJECTED') {
			this.setState({
				actionTittle: "Reject Application"
			})
		} else if (value == 'DELIVERED') {
			this.setState({
				actionTittle: "Deliver Application"
			})
		}
		this.setState({
			togglepopup: !this.state.togglepopup,
			actionOnApplication: value
		})
	};
	btnTwoOnClick = (complaintNo, label) => {
		//Action for second button
		let { history } = this.props;
		switch (label) {
			case "ES_COMMON_ASSIGN":
				history.push(`/assign-complaint/${complaintNo}`);
				break;
			case "ES_COMMON_REASSIGN":
				history.push(`/reassign-complaint/${complaintNo}`);
				break;
			case "MYBK_RESOLVE_MARK_RESOLVED":
				history.push(`/booking-resolved/${complaintNo}`);
				break;
		}
	};



	handleClickOpen = () => {
		this.setState({
			open: true
		})

	};
	handleClose = () => {
		this.setState({
			open: false
		})
	};

	assignToDiver = (value) => {
		this.setState({
			togglepopup: !this.state.togglepopup,
			actionOnApplication: value
		})
		let { history } = this.props;
		// history.push(`/egov-services/assignto-driver/${complaintNo}`);
	}
	callApiDorData = async (e) => {
		const { documentMap } = this.props;
		var documentsPreview = [];
		// const {documentMap}=this.props;
		if (documentMap && Object.keys(documentMap).length > 0) {
			let keys = Object.keys(documentMap);
			let values = Object.values(documentMap);
			let id = keys[0],
				fileName = values[0];

			documentsPreview.push({
				title: "DOC_DOC_PICTURE",
				fileStoreId: id,
				linkText: "View",
			});
			let fileStoreIds = jp.query(documentsPreview, "$.*.fileStoreId");
			let fileUrls =
				fileStoreIds.length > 0 ? await getFileUrlFromAPI(fileStoreIds) : {};
		


			//  window.open(response.file);
		

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



			setTimeout(() => {
				window.open(documentsPreview[0].link);
			}, 100);
			
			prepareFinalObject('documentsPreview', documentsPreview)
		}



	}
	render() {
		const dropbordernone = {
			float: "right",
			paddingRight: "20px"

		};
		let { shareCallback } = this;
		let { comments, openMap } = this.state;
		let { complaint, timeLine } = this.props.transformedComplaint;
		let { documentMap } = this.props;
		let { historyApiData, paymentDetails, match, userInfo } = this.props;
		

		let {
			role,
			serviceRequestId,
			history,
			isAssignedToEmployee,
			reopenValidChecker
		} = this.props;
		let btnOneLabel = "";
		let btnTwoLabel = "";
		let action;
		let complaintLoc = {};
		// if (complaint && complaint.latitude) {
		//   complaintLoc = { lat: complaint.latitude, lng: complaint.longitude };
		// }
		if (complaint) {
			if (role === "ao") {
				if (complaint.complaintStatus.toLowerCase() === "unassigned") {
					btnOneLabel = "ES_REJECT_BUTTON";
					btnTwoLabel = "ES_COMMON_ASSIGN";
				} else if (complaint.complaintStatus.toLowerCase() === "reassign") {
					btnOneLabel = "ES_REJECT_BUTTON";
					btnTwoLabel = "ES_COMMON_REASSIGN";
				} else if (complaint.complaintStatus.toLowerCase() === "assigned") {
					btnTwoLabel = "ES_COMMON_REASSIGN";
				}
				else if (complaint.complaintStatus.toLowerCase() === "escalated") {
					btnOneLabel = "ES_REJECT_BUTTON";
					btnTwoLabel = "ES_RESOLVE_MARK_RESOLVED";
				}
			} else if (role == "eo") {
				if (complaint.status.toLowerCase() === "escalatedlevel1pending" ||
					complaint.status.toLowerCase() === "escalatedlevel2pending") {
					btnOneLabel = "ES_REJECT_BUTTON";
					btnTwoLabel = "ES_RESOLVE_MARK_RESOLVED";
				}
				else if (complaint.status.toLowerCase() === "assigned") {
					btnOneLabel = "ES_REQUEST_REQUEST_RE_ASSIGN";
					btnTwoLabel = "ES_RESOLVE_MARK_RESOLVED";
				}
			}
			else if (role === "employee") {
				
				//  if () {
				btnOneLabel = "MYBK_REJECT_BUTTON";
				btnTwoLabel = "MYBK_RESOLVE_MARK_RESOLVED";
				//  }
			}
		}
		if (timeLine && timeLine[0]) {
			action = timeLine[0].action;
		}
		return (
			<div>
				<Screen>
					{complaint && !openMap && (
						<div>
							<div className="form-without-button-cont-generic">

							<div className="container" >
									<div className="row">
										<div className="col-12 col-md-6" style={{ fontSize: 'x-large' }}>

											Application Details
										</div>
										<div className="col-12 col-md-6 row">
											<div class="col-12 col-md-6 col-sm-3" >
												<ActionButtonDropdown data={{
													label: { labelName: "Download ", labelKey: "COMMON_DOWNLOAD_ACTION" },
													rightIcon: "arrow_drop_down",
													leftIcon: "cloud_download",
													props: {
														variant: "outlined",
														style: { marginLeft: 5, marginRight: 15, color: "#FE7A51", height: "60px" }, className: "tl-download-button"
													},
													menu:[{
														label: {
															labelName: "Receipt",
															labelKey: "MYBK_DOWNLOAD_RECEIPT"
														},
														leftIcon: "receipt",

														link: () => this.downloadReceiptButton('Receipt'),
				
													},
													// {
													// 	label: {
													// 		labelName: "PermissionLetter",
													// 		labelKey: "MYBK_DOWNLOAD_PERMISSION_LETTER"
													// 	},
													// 	leftIcon: "book",
													// 	link: () => this.downloadPLButton('PermissionLetter'),
													// },
													{
														label: {
															labelName: "Application",
															labelKey: "MYBK_PRINT_APPLICATION"
														},
														link: () => this.downloadApplicationMCCButton('state', "dispatch", 'REJECT'),
														leftIcon: "assignment"
													}]
													[{
														label: {
															labelName: "Application",
															labelKey: "MYBK_DOWNLOAD_APPLICATION"
														},
														link: () => this.downloadApplicationMCCButton('Application'),
														leftIcon: "assignment"
													}]
												}} />
											</div>
											<div class="col-12 col-md-6 col-sm-3" >
												<ActionButtonDropdown data={{
													label: { labelName: "Print", labelKey: "COMMON_PRINT_ACTION" },
													rightIcon: "arrow_drop_down",
													leftIcon: "print",
													props: {
														variant: "outlined",
														style: { marginLeft: 5, marginRight: 15, color: "#FE7A51", height: "60px" }, className: "tl-download-button"
													},
													menu:[{
														label: {
															labelName: "Receipt",
															labelKey: "MYBK_PRINT_RECEIPT"
														},

														link: () => this.downloadReceiptButton('Receipt'),
														leftIcon: "receipt"
													},
													// {
													// 	label: {
													// 		labelName: "PermissionLetter",
													// 		labelKey: "MYBK_DOWNLOAD_PERMISSION_LETTER"
													// 	},
													// 	 link: () => this.downloadPLButton('state', "dispatch", 'REJECT'),
													// 	 leftIcon: "book"
													// },
													{
														label: {
															labelName: "Application",
															labelKey: "MYBK_PRINT_APPLICATION"
														},
														link: () => this.downloadApplicationMCCButton('state', "dispatch", 'REJECT'),
														leftIcon: "assignment"
													}]
													// [{
													// 	label: {
													// 		labelName: "Application",
													// 		labelKey: "MYBK_PRINT_APPLICATION"
													// 	},
													// 	link: () => this.downloadApplicationMCCButton('state', "dispatch", 'REJECT'),
													// 	leftIcon: "assignment"
													// }]
												}} />

											</div>
										</div>
									</div>
								</div>


							<OSMCCBookingDetails
									{...complaint}
									historyApiData={historyApiData && historyApiData}
								/>

                                <BwtApplicantDetails
									{...complaint}
								/>

								<BookingDetails
									{...complaint}
									historyApiData={historyApiData && historyApiData}
								/>
								
								{(complaint.bkStatus).includes("Paid") &&
									<PaymentDetails
										paymentDetails={paymentDetails && paymentDetails}
									/>

								}
								{complaint && (complaint.status != 'PENDINGASSIGNMENTDRIVER' || complaint.status != 'REJECTED') &&
									<BwtApplicationDriverDetailsfrom
										{...complaint}

									/>
								}

								{/* <div style={{
									height: "100px",
									width: "100",
									backgroundColor: "white",
									border: "2px solid white",
									boxShadow: "0 0 2px 2px #e7dcdc", paddingLeft: "30px", paddingTop: "10px"
								}}><b>Documents</b><br></br>

									{documentMap && Object.values(documentMap) ? Object.values(documentMap) : "Not found"}
									<button className="ViewDetailButton" data-doc={documentMap} onClick={(e) => { this.callApiDorData(e) }}>VIEW</button>
								</div> */}
								<Comments
									comments={comments}
									role={role}
									isAssignedToEmployee={isAssignedToEmployee}
								/>
							</div>
							<div style={{
								paddingTop: "30px",
								paddingRight: "30px"
							}}>
								{
									(role === "employee" &&
										(
											(complaint.status == "PENDINGASSIGNMENTDRIVER" &&

												<Footer className="apply-wizard-footer" style={{ display: 'flex', justifyContent: 'flex-end' }} children={<ActionButtonDropdown data={{
													label: { labelName: "TAKE ACTION ", labelKey: "COMMON_TAKE_ACTION" },
													rightIcon: "arrow_drop_down",
													props: {
														variant: "outlined",
														style: { marginLeft: 5, marginRight: 15, backgroundColor: "#FE7A51", color: "#fff", border: "none", height: "60px", width: "250px" }
													},

													menu: !(complaint.bkStatus).includes("Paid") ? [{
														label: {
															labelName: "Approve",
															labelKey: "MYBK_ASSIGN_TO_DRIVER_ACTION_BUTTON"
														},

														link: () => this.btnOneOnClick('APPROVED', serviceRequestId)
													},
													{
														label: {
															labelName: "REJECT",
															labelKey: "MYBK_REJECT_ACTION_BUTTON"
														},

														link: () => this.btnOneOnClick('REJECTED', serviceRequestId)
													}] : [{
														label: {
															labelName: "Approve",
															labelKey: "MYBK_ASSIGN_TO_DRIVER_ACTION_BUTTON"
														},

														link: () => this.btnOneOnClick('APPROVED', serviceRequestId)
													}]
												}} />}></Footer>


											)
										)
									)}

								{(role === "employee" &&
									(
										(complaint.status == "PENDINGUPDATE" &&

											<Footer className="apply-wizard-footer" style={{ display: 'flex', justifyContent: 'flex-end' }} children={<ActionButtonDropdown data={{
												label: { labelName: "TAKE ACTION ", labelKey: "COMMON_TAKE_ACTION" },
												rightIcon: "arrow_drop_down",
												props: {
													variant: "outlined",
													style: { marginLeft: 5, marginRight: 15, backgroundColor: "#FE7A51", color: "#fff", border: "none", height: "60px", width: "250px" }
												},
												menu: [{
													label: {
														labelName: "Approve",
														labelKey: "MYBK_DELIVERED_ACTION_BUTTON"
													},

													link: () => this.btnOneOnClick('DELIVERED', serviceRequestId)
												}]
											}} />}></Footer>

										)
									)
								)}

								{/* {

									(role === "employee" &&
										(
											complaint.bkStatus.includes("Paid")  && complaint.status=="PENDINGASSIGNMENTDRIVER"&&
												
												<Footer className="apply-wizard-footer" style={{ display: 'flex', justifyContent: 'flex-end' }} children={<ActionButtonDropdown data={{
													label: { labelName: "TAKE ACTION ", labelKey: "COMMON_TAKE_ACTION" },
													rightIcon: "arrow_drop_down",
													props: {
														variant: "outlined",
														style: { marginLeft: 5, marginRight: 15, backgroundColor: "#FE7A51", color: "#fff", border: "none", height: "60px", width: "250px" }
													},
													menu: [{
														label: {
															labelName: "Approve",
															labelKey: "MYBK_ASSIGN_TO_DRIVER_ACTION_BUTTON"
														},

														link: () => this.assignToDiver(serviceRequestId)
													}]
												}} />}></Footer>

										)
									)} */}


								<DialogContainer
									toggle={this.state.togglepopup}
									actionTittle={this.state.actionTittle}
									togglepopup={this.btnOneOnClick}
									maxWidth={'md'}
									children={this.state.actionOnApplication == 'APPROVED' ? <AssignTODriver
										applicationNumber={match.params.applicationId}
										userInfo={userInfo}
									/> : this.state.actionOnApplication == 'REJECTED' ? <RejectBWTBooking
										applicationNumber={match.params.applicationId}
										userInfo={userInfo}
									/> : this.state.actionOnApplication == 'DELIVERED' ? <DeliveredBWTBooking
										applicationNumber={match.params.applicationId}
										userInfo={userInfo}
									/> : ''}
								/>


								{/* <DialogContainer
									toggle={this.state.togglepopup}
									actionTittle={this.state.actionTittle}
									togglepopup={this.assignToDiver}
									children={<AssignTODriver
										applicationNumber={match.params.applicationId}
										userInfo={userInfo}
									/>}
								/> */}


							</div>
						</div>
					)}
				</Screen>
			</div>
		);
	}
}

const roleFromUserInfo = (roles = [], role) => {
	const roleCodes = roles.map((role, index) => {
		return role.code;
	});
	return roleCodes && roleCodes.length && roleCodes.indexOf(role) > -1
		? true
		: false;
};


//Don't Delete this
const getLatestStatus = status => {
	let transformedStatus = "";
	switch (status.toLowerCase()) {
		case "open":
		case "new":
			transformedStatus = "UNASSIGNED";
			break;
		case "resolved":
		case "rejected":
		case "closed":
			transformedStatus = "CLOSED";
			break;
		case "assigned":
			transformedStatus = "ASSIGNED";
			break;
		case "reassignrequested":
			transformedStatus = "REASSIGN";
			break;
		case "escalatedlevel1pending":
			transformedStatus = "ESCALATED";
			break;
		case "escalatedlevel2pending":
			transformedStatus = "ESCALATED";
			break;
		default:
			transformedStatus = "CLOSED";
			break;
	}
	return transformedStatus;
};
const mapCitizenIdToName = (citizenObjById, id) => {
	return citizenObjById && citizenObjById[id] ? citizenObjById[id].name : "";
};
const mapCitizenIdToMobileNumber = (citizenObjById, id) => {
	return citizenObjById && citizenObjById[id]
		? citizenObjById[id].mobileNumber
		: "";
};
let gro = "";

const mapStateToProps = (state, ownProps) => {
	const { complaints, common, auth, form } = state;
	const { applicationData } = complaints;
	const { DownloadReceiptDetailsforCG,DownloadBWTApplicationDetails } = complaints;
	// complaint=applicationData?applicationData.bookingsModelList:'';
	console.log('state---in app Details', state, 'ownProps', ownProps, 'applicationData', applicationData)
	const { id } = auth.userInfo;
	const { citizenById } = common || {};

	const { employeeById, departmentById, designationsById, cities } =
		common || {};
	const { categoriesById } = complaints;
	const { userInfo } = state.auth;


	const serviceRequestId = ownProps.match.params.applicationId;
	let selectedComplaint = applicationData ? applicationData.bookingsModelList[0] : ''
	let businessService = applicationData ? applicationData.businessService : '';
	let bookingDocs;


	// if (Object.keys(state.complaints.applicationData.documentMap).length != 0) {
	// 	state.complaints.applicationData.documentMap = state.complaints.applicationData.documentMap
	// 	console.log('hel1')
	// }

	let documentMap = applicationData && applicationData.documentMap ? applicationData.documentMap : '';
	const { HistoryData } = complaints;

	let historyObject = HistoryData ? HistoryData : ''
	const { paymentData } = complaints;
	const { fetchPaymentAfterPayment } = complaints;

	let paymentDetails;
	// if (selectedComplaint && selectedComplaint.bkApplicationStatus!= "PENDINGASSIGNMENTDRIVER") {
	paymentDetails = fetchPaymentAfterPayment && fetchPaymentAfterPayment.Payments[0] && fetchPaymentAfterPayment.Payments[0].paymentDetails[0].bill;
	// } else {
	// 	paymentDetails = paymentData ? paymentData.Bill[0] : '';
	// }

	// let paymentDetails = paymentData ? paymentData.Bill[0] : ''
	let historyApiData = {}
	if (historyObject) {
		historyApiData = historyObject;
	}

	const role =
		roleFromUserInfo(userInfo.roles, "GRO") ||
			roleFromUserInfo(userInfo.roles, "DGRO")
			? "ao"
			: roleFromUserInfo(userInfo.roles, "ESCALATION_OFFICER1") ||
				roleFromUserInfo(userInfo.roles, "ESCALATION_OFFICER2")
				? "eo"
				: roleFromUserInfo(userInfo.roles, "CSR")
					? "csr"
					: "employee";

	let isAssignedToEmployee = true;
	if (selectedComplaint) {

		let details = {
			applicantName: selectedComplaint.bkApplicantName,
			status: selectedComplaint.bkApplicationStatus,
			applicationNo: selectedComplaint.bkApplicationNumber,
			address: selectedComplaint.bkCompleteAddress,
			bookingType: selectedComplaint.bkBookingType,
			sector: selectedComplaint.bkSector,
			bkEmail: selectedComplaint.bkEmail,
			bkMobileNumber: selectedComplaint.bkMobileNumber,
			houseNo: selectedComplaint.bkHouseNo,
			dateCreated: selectedComplaint.bkDateCreated,
			areaRequired: selectedComplaint.bkAreaRequired,
			bkDuration: selectedComplaint.bkDuration,
			bkCategory: selectedComplaint.bkCategory,
			constructionType: selectedComplaint.bkConstructionType,
			villageCity: selectedComplaint.bkVillCity,
			residentialCommercial: selectedComplaint.bkType,
			bkStatus: selectedComplaint.bkStatus,
			businessService: businessService,
			driverName: selectedComplaint ? selectedComplaint.bkDriverName : "NA",
			driverMobileNumber: selectedComplaint ? selectedComplaint.bkContactNo : 'NA',
			approverName: selectedComplaint ? selectedComplaint.bkApproverName : 'NA'
		}



		let transformedComplaint;
		if (applicationData != null && applicationData != undefined) {

			transformedComplaint = {
				complaint: details,//applicationData?applicationData.bookingsModelList[0]:'',
			};
		}

		const { localizationLabels } = state.app;
		const complaintTypeLocalised = getTranslatedLabel(
			`SERVICEDEFS.${transformedComplaint.complaint.complaint}`.toUpperCase(),
			localizationLabels
		);
		return {
			paymentDetails,
			historyApiData,
			DownloadReceiptDetailsforCG,
			documentMap,
			DownloadBWTApplicationDetails,
			form,
			transformedComplaint,
			role,
			serviceRequestId,
			isAssignedToEmployee,
			complaintTypeLocalised,
			// reopenValidChecker
		};
	} else {
		return {
			paymentDetails,
			historyApiData,
			DownloadReceiptDetailsforCG,
			DownloadBWTApplicationDetails,
			documentMap,
			form,
			transformedComplaint: {},
			role,
			serviceRequestId,
			isAssignedToEmployee,
			// reopenValidChecker
		};
	}
};

const mapDispatchToProps = dispatch => {
	return {
		fetchApplications: criteria => dispatch(fetchApplications(criteria)),
		fetchPayment: criteria => dispatch(fetchPayment(criteria)),
		fetchDataAfterPayment: criteria => dispatch(fetchDataAfterPayment(criteria)),
		downloadReceiptforCG: criteria => dispatch(downloadReceiptforCG(criteria)),
		downloadBWTApplication: criteria => dispatch(downloadBWTApplication(criteria)),
		fetchHistory: criteria => dispatch(fetchHistory(criteria)),
		resetFiles: formKey => dispatch(resetFiles(formKey)),
		sendMessage: message => dispatch(sendMessage(message)),
		sendMessageMedia: message => dispatch(sendMessageMedia(message)),
		prepareFormData: (jsonPath, value) =>
			dispatch(prepareFormData(jsonPath, value)),
		prepareFinalObject: (jsonPath, value) =>
			dispatch(prepareFinalObject(jsonPath, value))
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(BwtApplicationDetails);
