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
import AppDetails from "../AllComplaints/components/AppDetails"
import BookingDetails from "../AllComplaints/components/BookingDetails"
import DocumentPreview from "../AllComplaints/components/DocumentPreview"
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import DialogContainer from "../../modules/DialogContainer"
import PaymentDetails from "../AllComplaints/components/PaymentDetails"

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
	fetchApplications, fetchPayment, fetchHistory,
	sendMessage,
	sendMessageMedia
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
			setOpen: false
		};
	};
	componentDidMount = async () => {
		let {
			fetchApplications,
			fetchHistory,
			fetchPayment,
			match,
			resetFiles,
			transformedComplaint,
			prepareFormData,
			userInfo,
			documentMap,
			prepareFinalObject
		} = this.props;

		console.log('match.params.serviceRequestId---', this.props)

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
		let { details } = this.state;

	}

	componentWillReceiveProps = async (nextProps) => {
		console.log('this.props123', this.props)
		const { transformedComplaint, prepareFormData } = this.props;
		if (!isEqual(transformedComplaint, nextProps.transformedComplaint)) {
			prepareFormData("complaints", nextProps.transformedComplaint);
		}
	}

	btnOneOnClick = (e, complaintNo, label) => {
		console.log('complaintNo in  btnone', e.target.value, complaintNo, label)
		//Action for first button
		let { history } = this.props;
		if (e.target.value == "REJECTED") {
			history.push(`/reject-bwt-booking/${complaintNo}`);
		} else if (e.target.value == 'APPROVED') {
			history.push(`/assignto-driver/${complaintNo}`);
		}
		else if (e.target.value == 'DELIVERED') {
			history.push(`/deliver-application/${complaintNo}`);
		}
		
		else if (e.target.value == 'NOTDELIVERED') {
			history.push(`/not-deliver-application/${complaintNo}`);
		}
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

	// ShareButtonOnClick = () => {
	//   const complaintData = this.props.transformedComplaint.complaint;
	//   const name = complaintData.filedBy ? complaintData.filedBy : "NA";
	//   const moblileNo = complaintData.filedUserMobileNumber
	//     ? complaintData.filedUserMobileNumber
	//     : "NA";
	//   const complaintNo = complaintData.applicationNo
	//     ? complaintData.applicationNo
	//     : "NA";
	//   const complaintType = this.props.complaintTypeLocalised
	//     ? this.props.complaintTypeLocalised
	//     : "NA";
	//   const address = complaintData.address ? complaintData.address : "NA";
	//   const { sendMessage } = this.props;

	//   const shareMetaData = {
	//     tenantId: getTenantId(),
	//     shareSource: "WEB",
	//     shareMedia: "SMS",
	//     shareContent: [
	//       {
	//         to: "",
	//         content: { name, moblileNo, complaintNo, complaintType, address },
	//         expiredIn: "",
	//         documents: []
	//       }
	//     ],
	//     shareTemplate: "complaintDetails"
	//   };
	//   sendMessage(shareMetaData);

	//   // const messageStr =
	//   //   "Name: " + name + "\nMobile: " + moblileNo + "\nComplaint No: " + complaintNo + "\nComplaint Type: " + complaintType + "\nAddress: " + address;
	// };

	// shareCallback = () => {
	//   let { complaint } = this.props.transformedComplaint;

	//   navigator
	//     .share({
	//       title: "Complaint Summary",
	//       text: `Dear Sir/Madam,\nPlease find complaint detail given below :\n${get(
	//         complaint,
	//         "filedBy",
	//         ""
	//       )}, ${get(complaint, "filedUserMobileNumber", "")},\n${get(
	//         complaint,
	//         "complaint",
	//         ""
	//       )}, ${get(complaint, "description", "")}\nAddress: ${get(
	//         complaint,
	//         "addressDetail.houseNoAndStreetName",
	//         ""
	//       )},\n${get(complaint, "addressDetail.locality", "")},\n${get(
	//         complaint,
	//         "addressDetail.landMark",
	//         ""
	//       )}\nSLA: ${get(
	//         complaint,
	//         "timelineSLAStatus.slaStatement",
	//         ""
	//       )}\nThanks`,
	//       url: ""
	//     })
	//     .then(() => console.log("Successful share"))
	//     .catch(error => console.log("Error sharing", error));
	// };
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

	assignToDiver = (e, complaintNo) => {
		let { history } = this.props;
		history.push(`/assignto-driver/${complaintNo}`);
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
			console.log("fileUrls", fileUrls);


			//  window.open(response.file);
			console.log("documentsPreview", documentsPreview);

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
				console.log('doc====', doc)
				return doc;
			});



			setTimeout(() => {
				window.open(documentsPreview[0].link);
			}, 100);
			console.log('documentsPreview1--', documentsPreview)
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
		let { historyApiData, paymentDetails } = this.props;
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
							<BookingDetails
									{...complaint}
									historyApiData={historyApiData && historyApiData}
								/>
								<AppDetails
									{...complaint}
								/>

								<PaymentDetails
									paymentDetails={paymentDetails && paymentDetails}
								/>
								

								<div style={{
									height: "100px",
									width: "100",
									backgroundColor: "white",
									border: "2px solid white",
									boxShadow: "0 0 2px 2px #e7dcdc", paddingLeft: "30px", paddingTop: "10px"
								}}><b>Document Deails</b><br></br>

									{documentMap && Object.values(documentMap) ? Object.values(documentMap) : "Not found"}
									<button className="ViewDetailButton" data-doc={documentMap} onClick={(e) => { this.callApiDorData(e) }}>VIEW</button>
								</div>



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
											(complaint.bkStatus == "Normal" &&complaint.status=="PENDINGASSIGNMENTDRIVER"&&
												<select
													value={this.state.bookingType}
													onChange={(e, value) => this.btnOneOnClick(e, serviceRequestId, btnOneLabel)}
													style={{
														marginRight: "15",
														backgroundColor: "#FE7A51",
														color: "#fff",
														border: "none",
														height: "60px",
														width: "200px",
														float: "right", paddingLeft: "50px"

													}}

												>
													<option style={{
														background: "white",
														color: "gray"
													}} value="">Take Action</option>
													<option style={{
														background: "white",
														color: "gray"
													}} value="APPROVED">ASSIGN TO DRIVER </option>
													<option style={{
														background: "white",
														color: "gray"
													}} value="REJECTED">REJECT</option>
												</select>
											)
										)
									)}

{
									(role === "employee" &&
										(
											(complaint.status=="PENDINGUPDATE"&&
												<select
													value={this.state.bookingType}
													onChange={(e, value) => this.btnOneOnClick(e, serviceRequestId, btnOneLabel)}
													style={{
														marginRight: "15",
														backgroundColor: "#FE7A51",
														color: "#fff",
														border: "none",
														height: "60px",
														width: "200px",
														float: "right", paddingLeft: "50px"

													}}

												>
													<option style={{
														background: "white",
														color: "gray"
													}} value="">Take Action</option>
													<option style={{
														background: "white",
														color: "gray"
													}} value="DELIVERED">DELIVERED </option>
													<option style={{
														background: "white",
														color: "gray"
													}} value="NOTDELIVERED">NOT DELIVERED</option>
												</select>
											)
										)
									)}

								{

									(role === "employee" &&
										(
											complaint.bkStatus == "Paid" && complaint.status=="PENDINGASSIGNMENTDRIVER"&&
												<button className="ViewDetailButton"	style={{
													marginRight: "15",
													backgroundColor: "#FE7A51",
													color: "#fff",
													border: "none",
													height: "60px",
													width: "200px",
													float: "right"

												}} onClick={(e) => { this.assignToDiver(e, serviceRequestId) }}>ASSIGN TO DRIVER</button>
												
										)
									)}




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
	const { documentMap } = state.complaints.applicationData;
	const { HistoryData } = complaints;

	let historyObject = HistoryData ? HistoryData : ''
	const { paymentData } = complaints;

	let paymentDetails = paymentData ? paymentData.Bill[0] : ''
	let historyApiData = {}
	if (historyObject) {
		historyApiData = historyObject;
	}
	console.log('HistoryData in map state to props', historyApiData)
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
			bkStatus:selectedComplaint.bkStatus,
			businessService: businessService
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
		console.log('documentMap before return', documentMap)
		return {
			paymentDetails,
			historyApiData,
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
