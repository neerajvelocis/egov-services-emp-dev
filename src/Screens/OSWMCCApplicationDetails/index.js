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
import OSMCCAppDetails from "../AllComplaints/components/OSMCCAppDetails"
import OSMCCBookingDetails from "../AllComplaints/components/OSMCCBookingDetails"
import DocumentPreview from "../AllComplaints/components/DocumentPreview"
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
// import DialogContainer from "../../modules/DialogContainer"
import PaymentDetails from "../AllComplaints/components/PaymentDetails"
import ApproveBooking from "../ComplaintResolved";
import RejectBooking from "../RejectComplaint";

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
	sendMessageMedia
} from "egov-ui-kit/redux/complaints/actions";
import { connect } from "react-redux";
import DialogContainer from '../../modules/DialogContainer';
import Footer from "../../modules/footer"
import ActionButtonDropdown from '../../modules/ActionButtonDropdown'
import "./index.css";
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';



const styles = (theme) => ({

});
const dosalogStyle = {
	flex: '1 1 auto',
	padding: '0 24px 24px',
	overflowY: 'auto',
	overflowScrolling: 'touch',
	zIndex: '2000',
}

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

const DialogContent = withStyles((theme) => ({

}))(MuiDialogContent);

class ApplicationDetails extends Component {
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
			actionOpen: false
		};
	};

	handleActionButtonClose = () => {
		this.setState({
			actionOpen: false
		})
	};

	handleActionButtonOpen = () => {
		this.setState({
			actionOpen: true
		})
	};


	componentDidMount = async () => {
		let {
			fetchApplications,
			fetchHistory,
			fetchPayment,
			fetchDataAfterPayment, 
			match,
			resetFiles,
			transformedComplaint,
			prepareFormData,
			userInfo,
			documentMap,
			prepareFinalObject
		} = this.props;

		console.log('match.params.serviceRequestId---', this.props)
		console.log('AfterPaymentAmount--',this.props.fetchDataAfterPayment)

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
		//complaint.businessService
		fetchPayment(
			[{ key: "consumerCode", value: match.params.applicationId }, { key: "businessService", value: "OSBM" }, { key: "tenantId", value: userInfo.tenantId }
			])
		fetchDataAfterPayment(
			[{ key: "consumerCodes", value: match.params.applicationId }, { key: "tenantId", value: userInfo.tenantId }
			])

		// let BookingInfo = [];
		// let applicantDetail = {
		// 	"name": 'sonu kumar',//complaint&&complaint.applicantName?complaint.applicantName:'',
		// 	"mobileNumber": '9809090909',//complaint&&complaint.bkMobileNumber?complaint.bkMobileNumber:'',
		// 	"houseNo": '23',//complaint&&complaint.houseNo?complaint.houseNo:'',
		// 	"permanentAddress": 'new delhi',//complaint&&complaint.address?complaint.address:'',
		// 	"permanentCity": 'delhi',//complaint&&complaint.villageCity?complaint.villageCity:'',
		// 	"sector": '4',//complaint&&complaint.sector?complaint.sector:''
		// };
		// let booking = {
		// 	"bkApplicationNumber": 'CH-BK-000000879',//complaint&&complaint.applicationNo?complaint.applicationNo:''
		// };
		// let paymentInfo = {
		// 	"paymentDate": "13th Augest 2020",//paymentDetails[0].billDate,
		// 	"transactionId": "EDR654GF35",//paymentDetails[0].id,
		// 	"bookingPeriod": "13th Aug 2020 to 12th Sep 2020",
		// 	"bookingItem": "Online Payment Against Booking of Open Space for Building Material",
		// 	"amount": '3000',//paymentDetails && paymentDetails.billDetails[0] && paymentDetails.billDetails[0].billAccountDetails[1].amount,
		// 	"tax": '540',//paymentDetails && paymentDetails.billDetails[0] && paymentDetails.billDetails[0].billAccountDetails[0].amount,
		// 	"grandTotal": "2340",
		// 	"amountInWords": "Three Thousands Five Hundred Fourty Rupees"
		// };
		// await BookingInfo.push(applicantDetail);
		// await BookingInfo.push(booking);
		// await BookingInfo.push(paymentInfo);
		// console.log('BookingInfo===>>>', BookingInfo)
		// // return BookingInfo;

		// await downloadPaymentReceipt({ BookingInfo: BookingInfo })




		let { details } = this.state;

	}

	componentWillReceiveProps = async (nextProps) => {
		console.log('this.props123', this.props)
		const { transformedComplaint, prepareFormData } = this.props;
		if (!isEqual(transformedComplaint, nextProps.transformedComplaint)) {
			prepareFormData("complaints", nextProps.transformedComplaint);
		}
	}

	actionButtonOnClick = (e, complaintNo, label) => {
		if (label == 'APPROVED') {
			this.setState({
				actionTittle: "Approve Application"
			})
		} else {
			this.setState({
				actionTittle: "Reject Application"
			})
		}
		this.setState({
			togglepopup: !this.state.togglepopup,
			actionOnApplication: label
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
			openPopup: false
		})
	};

	// downloadPaymentReceiptFunction = async (e) => {
	// 	const { transformedComplaint, paymentDetails, downloadPaymentReceipt } = this.props;
	// 	const { complaint } = transformedComplaint;
	// 	console.log('compalint in downloadpayament', complaint, paymentDetails)

	// 	let BookingInfo = [];
	// 	let applicantDetail = {
	// 		"name": 'sonu kumar',//complaint&&complaint.applicantName?complaint.applicantName:'',
	// 		"mobileNumber": '9809090909',//complaint&&complaint.bkMobileNumber?complaint.bkMobileNumber:'',
	// 		"houseNo": '23',//complaint&&complaint.houseNo?complaint.houseNo:'',
	// 		"permanentAddress": 'new delhi',//complaint&&complaint.address?complaint.address:'',
	// 		"permanentCity": 'delhi',//complaint&&complaint.villageCity?complaint.villageCity:'',
	// 		"sector": '4',//complaint&&complaint.sector?complaint.sector:''
	// 	};
	// 	let booking = {
	// 		"bkApplicationNumber": 'CH-BK-000000879',//complaint&&complaint.applicationNo?complaint.applicationNo:''
	// 	};
	// 	let paymentInfo = {
	// 		"paymentDate": "13th Augest 2020",//paymentDetails[0].billDate,
	// 		"transactionId": "EDR654GF35",//paymentDetails[0].id,
	// 		"bookingPeriod": "13th Aug 2020 to 12th Sep 2020",
	// 		"bookingItem": "Online Payment Against Booking of Open Space for Building Material",
	// 		"amount": '3000',//paymentDetails && paymentDetails.billDetails[0] && paymentDetails.billDetails[0].billAccountDetails[1].amount,
	// 		"tax": '540',//paymentDetails && paymentDetails.billDetails[0] && paymentDetails.billDetails[0].billAccountDetails[0].amount,
	// 		"grandTotal": "2340",
	// 		"amountInWords": "Three Thousands Five Hundred Fourty Rupees"
	// 	};
	// 	BookingInfo.push(applicantDetail);
	// 	BookingInfo.push(booking);
	// 	BookingInfo.push(paymentInfo);
	// 	console.log('BookingInfo===>>>', BookingInfo)
	// 	// return BookingInfo;
	// 	downloadPaymentReceipt({ BookingInfo: BookingInfo })
	// }

	// downloadApplicationButton = async (e) => {

	// }

	// downloadPaymentReceiptButton = async (e) => {
	// 	//  await this.downloadPaymentReceiptFunction();

	// 	console.log('DownloadPaymentReceiptDetails this.props', this.props)
	// 	let documentsPreviewData;
	// 	const { DownloadPaymentReceiptDetails } = this.props;

	// 	var documentsPreview = [];
	// 	if (DownloadPaymentReceiptDetails && DownloadPaymentReceiptDetails.filestoreIds.length > 0) {

	// 		console.log('DownloadPaymentReceiptDetails', DownloadPaymentReceiptDetails.filestoreIds[0])
	// 		documentsPreviewData = DownloadPaymentReceiptDetails.filestoreIds[0];

	// 		// let keys = Object.keys(documentMap);
	// 		// let values = Object.values(documentMap);
	// 		// let id = keys[0], fileName = values[0];

	// 		documentsPreview.push({
	// 			title: "DOC_DOC_PICTURE",
	// 			fileStoreId: documentsPreviewData,
	// 			linkText: "View",
	// 		});
	// 		let fileStoreIds = jp.query(documentsPreview, "$.*.fileStoreId");
	// 		let fileUrls =
	// 			fileStoreIds.length > 0 ? await getFileUrlFromAPI(fileStoreIds) : {};
	// 		console.log("fileUrls", fileUrls);

	// 		documentsPreview = documentsPreview.map(function (doc, index) {
	// 			doc["link"] =
	// 				(fileUrls &&
	// 					fileUrls[doc.fileStoreId] &&
	// 					fileUrls[doc.fileStoreId].split(",")[0]) ||
	// 				"";
	// 			//doc["name"] = doc.fileStoreId;
	// 			doc["name"] =
	// 				(fileUrls[doc.fileStoreId] &&
	// 					decodeURIComponent(
	// 						fileUrls[doc.fileStoreId]
	// 							.split(",")[0]
	// 							.split("?")[0]
	// 							.split("/")
	// 							.pop()
	// 							.slice(13)
	// 					)) ||
	// 				`Document - ${index + 1}`;
	// 			return doc;
	// 		});
	// 		console.log('documentsPreview', documentsPreview)
	// 		setTimeout(() => {
	// 			window.open(documentsPreview[0].link);
	// 		}, 100);
	// 		prepareFinalObject('documentsPreview', documentsPreview)
	// 	}



	// }


	callApiForDocumentData = async (e) => {
		const { documentMap } = this.props;
		var documentsPreview = [];
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
		console.log('props in render123==', this.props)

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
				console.log('complaint in role', typeof (complaint.status))
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
										<div className="col-12 col-md-6" style={{fontSize: 'x-large'}}>
											
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
									menu: [{
										label: {
											labelName: "Receipt",
											labelKey: "MYBK_DOWNLOAD_RECEIPT"
										},

										link: () => this.downloadPaymentReceiptButton('Receipt')
									},
									{
										label: {
											labelName: "Application",
											labelKey: "MYBK_DOWNLOAD_APPLICATION"
										},
										 link: () => this.downloadApplicationButton('Application')
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
									menu: [{
										label: {
											labelName: "Receipt",
											labelKey: "MYBK_PRINT_RECEIPT"
										},

										link: () => this.downloadPaymentReceiptButton('Receipt')
									},
									{
										label: {
											labelName: "Application",
											labelKey: "MYBK_PRINT_APPLICATION"
										},
										// link: () => this.actionButtonOnClick('state', "dispatch", 'REJECT')
									}]
								}} />

</div>
										</div>
									</div>
								</div>
					
								

								<OSMCCBookingDetails
									{...complaint}
									historyApiData={historyApiData && historyApiData}
								/>
								<OSMCCAppDetails
									{...complaint}
								// role={role}
								// history={history}
								// mapAction={true}
								// redirectToMap={this.redirectToMap}
								// action={action}
								// complaintLoc={complaintLoc}
								/>

								<PaymentDetails
									paymentDetails={paymentDetails && paymentDetails}
								/>
								{/* {documentMap && (
									<DownloadFileContainer
									
									/> */}
								{/* )} */}
								<div style={{
									height: "100px",
									width: "100",
									backgroundColor: "white",
									border: "2px solid white",
									boxShadow: "0 0 2px 2px #e7dcdc", paddingLeft: "30px", paddingTop: "10px"
								}}><b>Documents</b><br></br>

									{documentMap && Object.values(documentMap) ? Object.values(documentMap) : "Not found"}
									<button className="ViewDetailButton" data-doc={documentMap} onClick={(e) => { this.callApiForDocumentData(e) }}>VIEW</button>
								</div>

								<Comments
									comments={comments}
									role={role}
									isAssignedToEmployee={isAssignedToEmployee}
								/>
							</div>
							<div style={{
								paddingTop: "30px",
								paddingRight: "30px", float: "right",
							}}>
								{(role === "ao" &&
									complaint.complaintStatus.toLowerCase() !== "closed") ||
									(role === "eo" &&
										(complaint.status.toLowerCase() === "escalatedlevel1pending" ||
											complaint.status.toLowerCase() === "escalatedlevel2pending" ||
											complaint.status.toLowerCase() === "assigned")) ||
									(role === "employee" &&
										(
											(complaint.status == "PENDINGAPPROVAL" &&
												// <ActionButtonDropdown

												// />

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
															labelKey: "MYBK_APPROVE_ACTION_BUTTON"
														},

														link: () => this.actionButtonOnClick('state', "dispatch", 'APPROVED')
													},
													{
														label: {
															labelName: "Reject",
															labelKey: "MYBK_REJECT_ACTION_BUTTON"
														},
														link: () => this.actionButtonOnClick('state', "dispatch", 'REJECT')
													}]
												}} />}></Footer>

												// 	<FormControl style={{width: '100%'}}>
												// 	<Select 
												// 	  labelId="demo-controlled-open-select-label-button"
												// 	  id="demo-controlled-open-select"
												// 	  open={this.state.actionOpen}
												// 	  displayEmpty
												// 	  onClose={() => this.handleActionButtonClose()}
												// 	  onOpen={() => this.handleActionButtonOpen()}
												// 	  value={this.state.bookingType}
												// 	  onChange={(e, value) => this.actionButtonOnClick(e, serviceRequestId, btnOneLabel)}
												// 		style={{
												// 			backgroundColor: "#FE7A51",
												// 			width: "200px",
												// 			textAlign: "center",
												// 		}}
												// 	>
												// 	  <MenuItem value="" disabled>Take Action </MenuItem>
												// 	  <MenuItem value="APPROVED">Approve</MenuItem>
												// 	  <MenuItem value='REJECT'>Reject</MenuItem>
												// 	</Select>
												//   </FormControl>


												// <select
												// 	value={this.state.bookingType}
												// 	onChange={(e, value) => this.actionButtonOnClick(e, serviceRequestId, btnOneLabel)}
												// 	style={{
												// 		marginRight: "15",
												// 		backgroundColor: "#FE7A51",
												// 		color: "#fff",
												// 		border: "none",
												// 		height: "60px",
												// 		width: "200px",
												// 		float: "right", paddingLeft: "50px"

												// 	}}

												// >
												// 	<option style={{
												// 		background: "white",
												// 		color: "gray"
												// 	}} value="">Take Action</option>
												// 	<option style={{
												// 		background: "white",
												// 		color: "gray"
												// 	}} value="APPROVED">Approve</option>
												// 	<option style={{
												// 		background: "white",
												// 		color: "gray"
												// 	}} value="REJECTED">Reject</option>
												// </select>
											)

										)
									)}

								<DialogContainer
									toggle={this.state.togglepopup}
									actionTittle={this.state.actionTittle}
									togglepopup={this.actionButtonOnClick}
									children={this.state.actionOnApplication == 'APPROVED' ? <ApproveBooking
										applicationNumber={match.params.applicationId}
										userInfo={userInfo}
									/> : <RejectBooking
											applicationNumber={match.params.applicationId}
											userInfo={userInfo}
										/>}
								/>

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
	const { DownloadPaymentReceiptDetails } = complaints;
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
	let businessService = applicationData ? applicationData.businessService : "";
	let bookingDocs;

	console.log('businessService=====', businessService)
	// if (Object.keys(state.complaints.applicationData.documentMap).length != 0) {
	// 	state.complaints.applicationData.documentMap = state.complaints.applicationData.documentMap
	// 	console.log('hel1')
	// }
	let documentMap = applicationData && applicationData.documentMap ? applicationData.documentMap : '';

	const { HistoryData } = complaints;
	let temp;
	// if(applicationData && applicationData.documentMap){
	// 	temp=applicationData;
	// }
	console.log('temp===', temp)
	let historyObject = HistoryData ? HistoryData : ''
	const { paymentData } = complaints;
	const { fetchPaymentAfterPayment } = complaints;

	// console.log('fetchPaymentAfterPayment in map state to props', fetchPaymentAfterPayment)


	let paymentDetails;
	if (selectedComplaint && selectedComplaint.bkApplicationStatus == "APPROVED") {
		paymentDetails = fetchPaymentAfterPayment && fetchPaymentAfterPayment.Payments[0] && fetchPaymentAfterPayment.Payments[0].paymentDetails[0].bill;
	} else {
		paymentDetails = paymentData ? paymentData.Bill[0] : '';
	}

	// let paymentDetails = paymentData ? paymentData.Bill[0] : ''
	let historyApiData = {}
	if (historyObject) {
		historyApiData = historyObject;
	}
	console.log('paymentDetails in map state to props', paymentDetails)
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
	if (selectedComplaint && businessService) {

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
			businessService: businessService,
			bkConstructionType: selectedComplaint.bkConstructionType

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
		// let documentMapDataValues = [];
		return {
			paymentDetails,
			historyApiData,
			DownloadPaymentReceiptDetails,
			// documentMapDataValues,
			documentMap,
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
			DownloadPaymentReceiptDetails,
			// documentMapDataValues,
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

		// downloadPaymentReceipt: criteria => dispatch(downloadPaymentReceipt(criteria)),
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
)(ApplicationDetails);