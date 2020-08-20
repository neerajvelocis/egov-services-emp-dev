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
import OSMCCMainBookingDetails from "../AllComplaints/components/OSMCCMainBookingDetails"
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
	fetchApplications, fetchPayment, fetchHistory, fetchDataAfterPayment, downloadPaymentReceipt, downloadApplication,
	sendMessage,downloadPermissionLetter,downloadMccPL,downloadReceiptforCG,
	sendMessageMedia,downloadMccApp
} from "egov-ui-kit/redux/complaints/actions";
import { connect } from "react-redux";
import DialogContainer from '../../modules/DialogContainer';
import Footer from "../../modules/footer"
import ActionButtonDropdown from '../../modules/ActionButtonDropdown'
import { convertEpochToDate, getDurationDate } from '../../modules/commonFunction'
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
			fetchDataAfterPayment, downloadPaymentReceipt,downloadMccApp,downloadMccPL,downloadReceiptforCG,
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
		//complaint.businessService
		fetchPayment(
			[{ key: "consumerCode", value: match.params.applicationId }, { key: "businessService", value: "OSUJM" }, { key: "tenantId", value: userInfo.tenantId }
			])
		fetchDataAfterPayment(
			[{ key: "consumerCodes", value: match.params.applicationId }, { key: "tenantId", value: userInfo.tenantId }
			])

		let BookingInfo = [{
			"applicantDetail": {
				"name": complaint && complaint.applicantName ? complaint.applicantName : 'NA',
				"mobileNumber": "9138912806",
				"houseNo": "555",
				"permanentAddress": null,
				"permanentCity": "ch.chandigarh",
				"sector": "7"
			},
			"booking": {
				"bkApplicationNumber": "CH-BK-2020-07-25-000183"
			},
			"paymentInfo": {
				"paymentDate": "13th Augest 2020",
				"transactionId": "EDR654GF35",
				"bookingPeriod": "13th Aug 2020 to 12th Sep 2020",
				"bookingItem": "Online Payment Against Booking of Open Space for Building Material",
				"amount": 3000,
				"tax": 540,
				"grandTotal": 3540,
				"amountInWords": "Three Thousands Five Hundred Fourty Rupees"
			}
		}
		]
		//  downloadPaymentReceipt({ BookingInfo: BookingInfo })
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

	NumInWords = (number) => {
		const first = [
			"",
			"One ",
			"Two ",
			"Three ",
			"Four ",
			"Five ",
			"Six ",
			"Seven ",
			"Eight ",
			"Nine ",
			"Ten ",
			"Eleven ",
			"Twelve ",
			"Thirteen ",
			"Fourteen ",
			"Fifteen ",
			"Sixteen ",
			"Seventeen ",
			"Eighteen ",
			"Nineteen ",
		];
		const tens = [
			"",
			"",
			"Twenty",
			"Thirty",
			"Forty",
			"Fifty",
			"Sixty",
			"Seventy",
			"Eighty",
			"Ninety",
		];
		const mad = ["", "Thousand", "Million", "Billion", "Trillion"];
		let word = "";

		for (let i = 0; i < mad.length; i++) {
			let tempNumber = number % (100 * Math.pow(1000, i));
			if (Math.floor(tempNumber / Math.pow(1000, i)) !== 0) {
				if (Math.floor(tempNumber / Math.pow(1000, i)) < 20) {
					word =
						first[Math.floor(tempNumber / Math.pow(1000, i))] +
						mad[i] +
						" " +
						word;
				} else {
					word =
						tens[Math.floor(tempNumber / (10 * Math.pow(1000, i)))] +
						first[Math.floor(tempNumber / Math.pow(1000, i)) % 10] +
						mad[i] +
						" " +
						word;
				}
			}

			tempNumber = number % Math.pow(1000, i + 1);
			if (Math.floor(tempNumber / (100 * Math.pow(1000, i))) !== 0)
				word =
					first[Math.floor(tempNumber / (100 * Math.pow(1000, i)))] +
					"Hunderd " +
					word;
		}
		return word + "Rupees Only";
	};

	//PaymentReceipt
	downloadReceiptButton = async (e) => {
	
		await this.downloadReceiptFunction();
	
		console.log('DownloadReceiptDetailsforCG this.props',this.props)
		let documentsPreviewData;
		const { DownloadReceiptDetailsforCG } = this.props;
		
		var documentsPreview = [];
		if (DownloadReceiptDetailsforCG && DownloadReceiptDetailsforCG.filestoreIds.length > 0) {
	
			console.log('DownloadReceiptDetailsforCG',DownloadReceiptDetailsforCG.filestoreIds[0])
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
			console.log('documentsPreview',documentsPreview)
			setTimeout(() => {
				window.open(documentsPreview[0].link);
			}, 100);
			prepareFinalObject('documentsPreview', documentsPreview)
		}
	}

	downloadReceiptFunction = async (e) => {
		const { transformedComplaint, paymentDetailsForReceipt, downloadPaymentReceiptforCG,downloadReceiptforCG, userInfo, paymentDetails } = this.props;
		const { complaint } = transformedComplaint;
		console.log('compalint in downloadpayament', complaint, paymentDetailsForReceipt)
		console.log("bkApplicationNumberPayment ",complaint.applicationNo)
			console.log('compalint in downloadpayament',complaint,paymentDetails)
	
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

//Application
	downloadApplicationMCCButton = async (e) => {
	
		await this.downloadApplicationFunction();
	
		console.log('DownloadMccAppp this.props',this.props)
		let documentsPreviewData;
		const { DownloadMccAppp } = this.props;
		
		var documentsPreview = [];
		if (DownloadMccAppp && DownloadMccAppp.filestoreIds.length > 0) {
	
			console.log('DownloadMccAppp',DownloadMccAppp.filestoreIds[0])
			 documentsPreviewData=DownloadMccAppp.filestoreIds[0];
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
			console.log('documentsPreview',documentsPreview)
			setTimeout(() => {
				window.open(documentsPreview[0].link);
			}, 100);
			prepareFinalObject('documentsPreview', documentsPreview)
		}
	
	
	
	}
	downloadApplicationFunction = async (e) => {
		const { transformedComplaint,paymentDetailsForReceipt,paymentDetails,downloadPermissionLetter, downloadMccApp, userInfo} = this.props;
		const {complaint} = transformedComplaint;
		let receiptData = [
			{
				applicantDetail: {
					name: complaint.applicantName,
					mobileNumber: complaint.bkMobileNumber,
					email: complaint.bkEmail,
					permanentAddress: complaint.address,
					permanentCity: "Chandigarh",
					sector: complaint.sector,
					fatherName: complaint.bkFatherName
				},
				bookingDetail: {
					applicationNumber:
					complaint.applicationNo,
					applicationDate: convertEpochToDate(
						complaint.dateCreated,"dayend"
					),
					bookingPeriod: getDurationDate(
						complaint.bkFromDate,
						complaint.bkToDate
					),
					venueName : complaint.bkBookingVenue,
					sector: complaint.sector,
					bookingPurpose : complaint.bkBookingPurpose,
				},
				feeDetail: {
                    baseCharge:
                        paymentDetails === undefined
                            ? null
                            : paymentDetails.billDetails[0].billAccountDetails.filter(el => !el.taxHeadCode.includes("TAX"))[0].amount,
                    taxes:
                        paymentDetails === undefined
                            ? null
                            : paymentDetails.billDetails[0].billAccountDetails.filter(el => el.taxHeadCode.includes("TAX"))[0].amount,
                    totalAmount:
                        paymentDetails === undefined
                            ? null
                            : paymentDetails.totalAmount,
				},
				generatedBy: {
					generatedBy: userInfo.name,
				},
			}]
	
			downloadMccApp({BookingInfo:receiptData})
	}

//permissionLeter	
	downloadPLButton = async (e) => {
	
		await this.downloadPLFunction();
	
		console.log('DownloadMccPermissionLetter this.props',this.props)
		let documentsPreviewData;
		const { DownloadMccPermissionLetter } = this.props;
		
		var documentsPreview = [];
		if (DownloadMccPermissionLetter && DownloadMccPermissionLetter.filestoreIds.length > 0) {
	
			console.log('DownloadMccPermissionLetter',DownloadMccPermissionLetter.filestoreIds[0])
			 documentsPreviewData=DownloadMccPermissionLetter.filestoreIds[0];
			
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
			console.log('documentsPreview',documentsPreview)
			setTimeout(() => {
				window.open(documentsPreview[0].link);
			}, 100);
			prepareFinalObject('documentsPreview', documentsPreview)
		}
	}
	downloadPLFunction = async (e) => {
		const { transformedComplaint, paymentDetailsForReceipt,downloadMccPL,downloadPaymentReceiptforCG, userInfo, paymentDetails } = this.props;
		const { complaint } = transformedComplaint;
		console.log('compalint in downloadpayament', complaint, paymentDetailsForReceipt)
		console.log("bkApplicationNumberPayment ",complaint.applicationNo)
			console.log('compalint in downloadpayament',complaint,paymentDetails)
	console.log("cgappno--",complaint.applicationNo,complaint.sector,complaint.dateCreated,complaint.bkFromDate,
	complaint.bkToDate)
	
	let receiptData = [
		{
			applicantDetail: {
				name: complaint.applicantName,
				mobileNumber: complaint.bkMobileNumber,
				email: complaint.bkEmail,
				permanentAddress: complaint.address,
				permanentCity: "Chandigarh",
				sector: complaint.sector,
				fatherName: complaint.bkFatherName
			},
			bookingDetail: {
				applicationNumber:
				complaint.applicationNo,
				applicationDate: convertEpochToDate(
					complaint.dateCreated,"dayend"
				),
				bookingPeriod: getDurationDate(
					complaint.bkFromDate,
					complaint.bkToDate
				),
				venueName : complaint.bkBookingVenue,
				sector: complaint.sector,
				bookingPurpose : complaint.bkBookingPurpose,
			},
			generatedBy: {
				generatedBy: userInfo.name,
			},
			approvedBy: {
				approvedBy: "Renil Commissioner",
				role: "Additional Commissioner"
			  },
			  tenantInfo: {
				municipalityName: "Municipal Corporation Chandigarh",
				address: "New Deluxe Building, Sector 17, Chandigarh",
				contactNumber: "+91-172-2541002, 0172-2541003",
				logoUrl: "https://chstage.blob.core.windows.net/fileshare/logo.png",
				webSite: "http://mcchandigarh.gov.in"
			  }
		}]
		downloadMccPL({BookingInfo:receiptData})
	}

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
													menu: (complaint.status=='APPROVED')?[{
														label: {
															labelName: "Receipt",
															labelKey: "MYBK_DOWNLOAD_RECEIPT"
														},
														leftIcon: "receipt",

														link: () => this.downloadReceiptButton('Receipt'),
				
													},
													{
														label: {
															labelName: "PermissionLetter",
															labelKey: "MYBK_DOWNLOAD_PERMISSION_LETTER"
														},
														leftIcon: "book",
														link: () => this.downloadPLButton('PermissionLetter'),
													},{
														label: {
															labelName: "Application",
															labelKey: "MYBK_PRINT_APPLICATION"
														},
														link: () => this.downloadApplicationMCCButton('state', "dispatch", 'REJECT'),
														leftIcon: "assignment"
													}]:
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
													menu:  (complaint.status=='APPROVED')?[{
														label: {
															labelName: "Receipt",
															labelKey: "MYBK_PRINT_RECEIPT"
														},

														link: () => this.downloadReceiptButton('Receipt'),
														leftIcon: "receipt"
													},
													{
														label: {
															labelName: "PermissionLetter",
															labelKey: "MYBK_DOWNLOAD_PERMISSION_LETTER"
														},
														 link: () => this.downloadPLButton('state', "dispatch", 'REJECT'),
														 leftIcon: "book"
													},{
														label: {
															labelName: "Application",
															labelKey: "MYBK_PRINT_APPLICATION"
														},
														link: () => this.downloadApplicationMCCButton('state', "dispatch", 'REJECT'),
														leftIcon: "assignment"
													}]:[{
														label: {
															labelName: "Application",
															labelKey: "MYBK_PRINT_APPLICATION"
														},
														link: () => this.downloadApplicationMCCButton('state', "dispatch", 'REJECT'),
														leftIcon: "assignment"
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

								<OSMCCMainBookingDetails 
								{...complaint}
								historyApiData={historyApiData && historyApiData}
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
									maxWidth={'md'}
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
	const { applicationData,DownloadMccAppp,DownloadReceiptDetailsforCG } = complaints;
	const { DownloadPaymentReceiptDetails,DownloadApplicationDetails,DownloadPermissionLetterDetails,DownloadMccPermissionLetter } = complaints;
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

	//console.log('businessService=====', businessService)
	// if (Object.keys(state.complaints.applicationData.documentMap).length != 0) {
	// 	state.complaints.applicationData.documentMap = state.complaints.applicationData.documentMap
	// }
	let documentMap = applicationData && applicationData.documentMap ? applicationData.documentMap : '';
	const { HistoryData } = complaints;	
	let historyObject = HistoryData ? HistoryData : ''
	const { paymentData } = complaints;
	const { fetchPaymentAfterPayment } = complaints;

	let paymentDetailsForReceipt = fetchPaymentAfterPayment;
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
			bkConstructionType: selectedComplaint.bkConstructionType,
			bkFromDate: selectedComplaint.bkFromDate,
			bkToDate: selectedComplaint.bkToDate,
			bkFatherName: selectedComplaint.bkFatherName,
			bkBookingVenue:selectedComplaint.bkBookingVenue

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
			DownloadMccAppp,
			DownloadReceiptDetailsforCG,
			DownloadPaymentReceiptDetails,
			paymentDetailsForReceipt,DownloadApplicationDetails,DownloadPermissionLetterDetails,
			documentMap,
			form,
			transformedComplaint,
			role,
			DownloadMccPermissionLetter,
			serviceRequestId,
			isAssignedToEmployee,
			complaintTypeLocalised,
			// reopenValidChecker
		};
	} else {
		return {
			paymentDetails,
			DownloadMccAppp,
			historyApiData,
			DownloadReceiptDetailsforCG,
			DownloadPaymentReceiptDetails,
			DownloadMccPermissionLetter,
			paymentDetailsForReceipt,
			DownloadApplicationDetails,
			DownloadPermissionLetterDetails,
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
		fetchDataAfterPayment: criteria => dispatch(fetchDataAfterPayment(criteria)),//downloadMCCPLComplete
		downloadMccPL: criteria => dispatch(downloadMccPL(criteria)),

		downloadMccApp: criteria => dispatch(downloadMccApp(criteria)),
		downloadReceiptforCG: criteria => dispatch(downloadReceiptforCG(criteria)),
		downloadPaymentReceipt: criteria => dispatch(downloadPaymentReceipt(criteria)),
        downloadPermissionLetter: criteria => dispatch(downloadPermissionLetter(criteria)),
		downloadApplication: criteria => dispatch(downloadApplication(criteria)),
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