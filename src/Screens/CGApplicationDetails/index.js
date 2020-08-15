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
import CGAppDetails from "../AllComplaints/components/CGAppDetails"
import PaymentDetails from "../AllComplaints/components/PaymentDetails"
import CGBookingDetails from "../AllComplaints/components/CGBookingDetails"
import DocumentPreview from "../AllComplaints/components/DocumentPreview"
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import DownloadFileContainer from "../../modules/DownloadFileContainer"
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
	fetchApplications, fetchPayment, fetchHistory, fetchDataAfterPayment,downloadPaymentReceiptforCG,downloadReceiptforCG,
	sendMessage,downloadLetterforCG,
	sendMessageMedia,downloadPermissionLetterforCG,downloadApplicationforCG
} from "egov-ui-kit/redux/complaints/actions";
import { connect } from "react-redux";

import "./index.css";
//newImport
import { convertEpochToDate, getDurationDate} from '../../modules/commonFunction'
import ActionButtonDropdown from "../../modules/ActionButtonDropdown"
class CGApplicationDetails extends Component {
	constructor(props) {
		super(props);
		this.state = {
			openMap: false,
			docFileData: [],
			bookingType:'',
		};
	};

	componentDidMount = async () => {
		let {
			fetchApplications,
			fetchHistory,
			fetchPayment,
			fetchDataAfterPayment,downloadReceiptforCG,downloadPaymentReceiptforCG,downloadLetterforCG,downloadPermissionLetterforCG,downloadApplicationforCG,
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
			[{ key: "consumerCode", value: match.params.applicationId }, { key: "businessService", value: "GFCP" }, { key: "tenantId", value: userInfo.tenantId }
			])
		fetchDataAfterPayment(
			[{ key: "consumerCodes", value: match.params.applicationId }, { key: "tenantId", value: userInfo.tenantId }
			])


			

		let { details } = this.state;

	}

	componentWillReceiveProps = async (nextProps) =>  {
		console.log('this.props123', this.props)
		const { transformedComplaint, prepareFormData } = this.props;
		if (!isEqual(transformedComplaint, nextProps.transformedComplaint)) {
			prepareFormData("complaints", nextProps.transformedComplaint);
		}
	}


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

	btnOneOnClick = (e,complaintNo, label) => {
		console.log('complaintNo in  btnone', e.target.value,complaintNo, label)
		//Action for first button
		let { history } = this.props;
		if (e.target.value=="REJECTED") {
				history.push(`/reject-booking/${complaintNo}`);
		}else if(e.target.value=='APPROVED'){
			history.push(`/booking-resolved/${complaintNo}`);

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
	downloadPermissionLetterFunction = async (e) => {
		
		const { transformedComplaint,paymentDetails,downloadPermissionLetterforCG,userInfo } = this.props;
		
		const {complaint} = transformedComplaint;
		console.log("bkApplicationNumberPayment ",complaint.applicationNo)
		console.log('compalint in downloadpayament',complaint,paymentDetails)
	
		let receiptData = [
			{
				applicantDetail: {
					name: complaint.applicantName,
					mobileNumber: complaint.bkMobileNumber,
					houseNo: complaint.houseNo,
					permanentAddress: complaint.address,
					permanentCity: complaint.villageCity,
					sector: complaint.sector,
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
					groundName:complaint.sector
				},
				generatedBy: {
					generatedBy: userInfo.name,
				},
			}]
	
			downloadPermissionLetterforCG({BookingInfo:receiptData})
	
	
	}

//PaymentReceipt
downloadPaymentReceiptFunction = async (e) => {
	const { transformedComplaint, paymentDetailsForReceipt, downloadPaymentReceiptforCG, userInfo, paymentDetails } = this.props;
	const { complaint } = transformedComplaint;
	console.log('compalint in downloadpayament', complaint, paymentDetailsForReceipt)
	console.log("bkApplicationNumberPayment ",complaint.applicationNo)
		console.log('compalint in downloadpayament',complaint,paymentDetails)

	// let BookingInfo = [{
	// 	"applicantDetail": {
	// 		"name": complaint && complaint.applicantName ? complaint.applicantName : 'NA',
	// 		"mobileNumber": complaint && complaint.bkMobileNumber ? complaint.bkMobileNumber : '',
	// 		"houseNo": complaint && complaint.houseNo ? complaint.houseNo : '',
	// 		"permanentAddress": complaint && complaint.address ? complaint.address : '',
	// 		"permanentCity": complaint && complaint.villageCity ? complaint.villageCity : '',
	// 		"sector": complaint && complaint.sector ? complaint.sector : ''
	// 	},
	// 	"booking": {
	// 		"bkApplicationNumber": complaint && complaint.applicationNo ? complaint.applicationNo : ''
	// 	},
	// 	"paymentInfo": {
	// 		"paymentDate": paymentDetailsForReceipt && convertEpochToDate(paymentDetailsForReceipt.Payments[0].transactionDate, "dayend"),
	// 		"transactionId": paymentDetailsForReceipt && paymentDetailsForReceipt.Payments[0].transactionNumber,
	// 		"bookingPeriod": getDurationDate(
	// 			complaint.bkFromDate,
	// 			complaint.bkToDate
	// 		),
	// 		"bookingItem": "Online Payment Against Booking of Commercial Ground",
	// 		"amount": paymentDetailsForReceipt.Payments[0].paymentDetails[0].bill.billDetails[0].billAccountDetails.filter(
	// 			(el) => !el.taxHeadCode.includes("TAX")
	// 		)[0].amount,
	// 		"tax": paymentDetailsForReceipt.Payments[0].paymentDetails[0].bill.billDetails[0].billAccountDetails.filter(
	// 			(el) => el.taxHeadCode.includes("TAX")
	// 		)[0].amount,
	// 		"grandTotal": paymentDetailsForReceipt.Payments[0].totalAmountPaid,
	// 		"amountInWords": this.NumInWords(
	// 			paymentDetailsForReceipt.Payments[0].totalAmountPaid
	// 		),
	// 		paymentItemExtraColumnLabel: "Booking Period",
	// 		paymentMode:
	// 			paymentDetailsForReceipt.Payments[0].paymentMode,
	// 		receiptNo:
	// 			paymentDetailsForReceipt.Payments[0].paymentDetails[0]
	// 				.receiptNumber,
	// 		// name: paymentDetailsForReceipt.Payments[0].payerName,
	// 		//     mobileNumber:
	// 		//         paymentDetailsForReceipt.Payments[0].mobileNumber,
	// 	},
	// 	payerInfo: {
	// 		payerName: paymentDetailsForReceipt.Payments[0].payerName,
	// 		payerMobile:
	// 			paymentDetailsForReceipt.Payments[0].mobileNumber,
	// 	},
	// 	generatedBy: {
	// 		generatedBy: userInfo.name,
	// 	},
	// }
	// ]
console.log("cgappno--",complaint.applicationNo,complaint.sector,complaint.dateCreated,complaint.bkFromDate,
complaint.bkToDate)

	let receiptData = [
		{
			applicantDetail: {
				name: complaint.applicantName,
				mobileNumber: complaint.bkMobileNumber,
				houseNo: complaint.houseNo,
				permanentAddress: complaint.address,
				permanentCity: complaint.villageCity,
				sector: complaint.sector,
				permanentCity: "ch"
			},
			bookingDetail: {
				applicationNumber:
				complaint.applicationNo,
				// applicationDate:
				// complaint.dateCreated,
				applicationDate: convertEpochToDate(
					complaint.dateCreated,"dayend"
				),
				bookingPeriod: getDurationDate(
					complaint.bkFromDate,
					complaint.bkToDate
				),
				groundName:complaint.sector
			},
			generatedBy: {
				generatedBy: userInfo.name,
			},
		}]
	downloadPaymentReceiptforCG({BookingInfo:receiptData})
}


//new letter  function
downloadLetterFunction = async (e) => {
	const { transformedComplaint, paymentDetailsForReceipt, downloadLetterforCG, userInfo } = this.props;
	const { complaint } = transformedComplaint;
	console.log('compalint in downloadpayament', complaint, paymentDetailsForReceipt)

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
			"bookingItem": "Online Payment Against Booking of Commercial Ground",
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
	downloadLetterforCG({ BookingInfo: BookingInfo })
}

downloadApplicationFunction = async (e) => {
const { transformedComplaint,paymentDetails,downloadApplicationforCG,paymentDetailsForReceipt,userInfo } = this.props;

const {complaint} = transformedComplaint;

console.log('compalint in downloadpayament',complaint,paymentDetails)
let BookingInfo = [{
	"applicantDetail": {
		"name": complaint && complaint.applicantName ? complaint.applicantName : 'NA',
		"mobileNumber": complaint && complaint.bkMobileNumber ? complaint.bkMobileNumber : '',
		"houseNo": complaint && complaint.houseNo ? complaint.houseNo : '',
		"permanentAddress": complaint && complaint.address ? complaint.address : '',
		"permanentCity": complaint && complaint.villageCity ? complaint.villageCity : '',
		"sector": complaint && complaint.sector ? complaint.sector : '',
		"fatherName":complaint.bkFatherName,
		"DOB": null,
		"email":complaint.bkEmail,
	},
	"bookingDetail": {
		"applicationNumber":complaint.applicationNo,
		"venue": complaint.sector,
        "bookingCategory": complaint.bkCategory,
        "bookingPeriod": getDurationDate(
			complaint.bkFromDate,
			complaint.bkToDate
		),
        "bookingPurpose": complaint.bkBookingPurpose
	},
	"feeDetail": {
		"baseCharge": paymentDetailsForReceipt.Payments[0].paymentDetails[0].bill.billDetails[0].billAccountDetails.filter(
			(el) => !el.taxHeadCode.includes("TAX")
		)[0].amount,
		"taxes": paymentDetailsForReceipt.Payments[0].paymentDetails[0].bill.billDetails[0].billAccountDetails.filter(
			(el) => el.taxHeadCode.includes("TAX")
		)[0].amount,
		"totalAmount": paymentDetailsForReceipt.Payments[0].totalAmountPaid,
	},
	generatedBy: {
		generatedBy: userInfo.name,
	},
}
]
downloadApplicationforCG({BookingInfo:BookingInfo})
}


downloadApplicationButton = async (e) => {
	await this.downloadApplicationFunction();

	console.log('DownloadApplicationDetailsforCG this.props',this.props)
	let documentsPreviewData;
	const { DownloadApplicationDetailsforCG } = this.props;
	
	var documentsPreview = [];
	if (DownloadApplicationDetailsforCG && DownloadApplicationDetailsforCG.filestoreIds.length > 0) {

		console.log('DownloadApplicationDetailsforCG',DownloadApplicationDetailsforCG.filestoreIds[0])
		 documentsPreviewData=DownloadApplicationDetailsforCG.filestoreIds[0];
		
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

// downloadPermissionLetterButton = async (e) => {
	
// 	await this.downloadPermissionLetterFunction();

// 	console.log('DownloadPermissionLetterDetailsforCG this.props',this.props)
// 	let documentsPreviewData;
// 	const { DownloadPermissionLetterDetailsforCG } = this.props;
	
// 	var documentsPreview = [];
// 	if (DownloadPermissionLetterDetailsforCG && DownloadPermissionLetterDetailsforCG.filestoreIds.length > 0) {

// 		console.log('DownloadPermissionLetterDetailsforCG',DownloadPermissionLetterDetailsforCG.filestoreIds[0])
// 		 documentsPreviewData=DownloadPermissionLetterDetailsforCG.filestoreIds[0];
		
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
// 		console.log('documentsPreview',documentsPreview)
// 		setTimeout(() => {
// 			window.open(documentsPreview[0].link);
// 		}, 100);
// 		prepareFinalObject('documentsPreview', documentsPreview)
// 	}
// }

//NEW PERMISSIONLETTER FUNCTION
downloadLetterButton = async (e) => {
	
	await this.downloadLetterFunction();

	console.log('DownloadPermissionLetterDetailsforCG this.props',this.props)
	let documentsPreviewData;
	const { DownloadPermissionLetterDetailsforCG } = this.props;
	
	var documentsPreview = [];
	if (DownloadPermissionLetterDetailsforCG && DownloadPermissionLetterDetailsforCG.filestoreIds.length > 0) {

		console.log('DownloadPermissionLetterDetailsforCG',DownloadPermissionLetterDetailsforCG.filestoreIds[0])
		 documentsPreviewData=DownloadPermissionLetterDetailsforCG.filestoreIds[0];
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


//new paymentReceipt
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
			"bookingItem": "Online Payment Against Booking of Commercial Ground",
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
//new paymentreceipt


downloadPaymentReceiptButton = async (e) => {
	
	await this.downloadPaymentReceiptFunction();

	console.log('DownloadPaymentReceiptDetailsforCG this.props',this.props)
	let documentsPreviewData;
	const { DownloadPaymentReceiptDetailsforCG } = this.props;
	
	var documentsPreview = [];
	if (DownloadPaymentReceiptDetailsforCG && DownloadPaymentReceiptDetailsforCG.filestoreIds.length > 0) {

		console.log('DownloadPaymentReceiptDetailsforCG',DownloadPaymentReceiptDetailsforCG.filestoreIds[0])
		 documentsPreviewData=DownloadPaymentReceiptDetailsforCG.filestoreIds[0];
		
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



callApiDorData = async (e) =>  {
		console.log('e.target.dataset',e.target.dataset.doc,this.props)
// 		if(e.target.dataset){

// 		var object = {};
// 		 {object[key] = object[value]};
// var json = JSON.stringify(object);
// console.log('documentMap in new function',json)
// }
const {documentMap}=this.props;
		// let documentMap={"93e71d9f-6eb0-461a-b3cd-9a5c2220950d":"Screenshot (14)_small.png"}

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
			console.log('documentsPreview1--',documentsPreview)
			prepareFinalObject('documentsPreview', documentsPreview)
		}


		
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
console.log("complaintsToAddress ",complaint)
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
											labelName: "PermissionLetter",
											labelKey: "MYBK_DOWNLOAD_PERMISSION_LETTER"
										},
										leftIcon: "book",
										link: () => this.downloadPaymentReceiptButton('Receipt')
									},
									{
										label: {
											labelName: "Receipt",
											labelKey: "MYBK_DOWNLOAD_RECEIPT"
										},
										leftIcon: "receipt",

										link: () => this.downloadReceiptButton('PermissionLetter')
									},
									{
										label: {
											labelName: "Application",
											labelKey: "MYBK_DOWNLOAD_APPLICATION"
										},
										leftIcon:"assignment",
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
											labelName: "PermissionLetter",
											labelKey: "MYBK_DOWNLOAD_PERMISSION_LETTER"
										},
										leftIcon: "book",
										link: () => this.downloadPaymentReceiptButton('Receipt')
									},
									{
										label: {
											labelName: "Receipt",
											labelKey: "MYBK_DOWNLOAD_RECEIPT"
										},
										leftIcon: "receipt",

										link: () => this.downloadReceiptButton('PermissionLetter')
									},
									{
										label: {
											labelName: "Application",
											labelKey: "MYBK_DOWNLOAD_APPLICATION"
										},
										leftIcon:"assignment",
										 link: () => this.downloadApplicationButton('Application')
									}]
								}} />

</div>
										</div>
									</div>
								</div>
                              <CGBookingDetails
									{...complaint}
								/>

								<CGAppDetails
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
								}}><b>Documents</b><br></br>

									{documentMap && Object.values(documentMap) ? Object.values(documentMap) : "Not found"}
									<button className="ViewDetailButton" data-doc={documentMap} onClick={(e) => { this.callApiForDocumentData(e) }}>VIEW</button>
								</div>
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
	const {DownloadPaymentReceiptDetailsforCG}=complaints;
	const {DownloadPermissionLetterDetailsforCG}=complaints;
	const {DownloadApplicationDetailsforCG,DownloadReceiptDetailsforCG}=complaints;
	
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
	const { documentMap } = applicationData;
	const { HistoryData } = complaints;
	let temp;
	// if(applicationData && applicationData.documentMap){
	// 	temp=applicationData;
	// }
console.log('temp===',temp)
	let historyObject = HistoryData ? HistoryData : ''
	const { paymentData } = complaints;
	const { fetchPaymentAfterPayment } = complaints;

	// console.log('fetchPaymentAfterPayment in map state to props', fetchPaymentAfterPayment)

	let paymentDetailsForReceipt = fetchPaymentAfterPayment;
	// let paymentDetails;
	let paymentDetails;
	if (selectedComplaint && selectedComplaint.bkApplicationStatus == "APPLIED") {
		paymentDetails = fetchPaymentAfterPayment && fetchPaymentAfterPayment.Payments[0] && fetchPaymentAfterPayment.Payments[0].paymentDetails[0].bill ;
	} 
	else {
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
			bkFatherName: selectedComplaint.bkFatherName,
		    bkBookingPurpose: selectedComplaint.bkBookingPurpose,
		    bkFromDate: selectedComplaint.bkFromDate,
		    bkToDate: selectedComplaint.bkToDate

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
			DownloadPaymentReceiptDetailsforCG,
			DownloadReceiptDetailsforCG,
			DownloadPermissionLetterDetailsforCG,
			DownloadApplicationDetailsforCG,
			paymentDetailsForReceipt,
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
			DownloadPaymentReceiptDetailsforCG,
			DownloadReceiptDetailsforCG,
			DownloadPermissionLetterDetailsforCG,
			DownloadApplicationDetailsforCG,
			paymentDetailsForReceipt,
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

		downloadPaymentReceiptforCG: criteria => dispatch(downloadPaymentReceiptforCG(criteria)),
		downloadReceiptforCG: criteria => dispatch(downloadReceiptforCG(criteria)),
		downloadLetterforCG: criteria => dispatch(downloadLetterforCG(criteria)),
		downloadPermissionLetterforCG: criteria => dispatch(downloadPermissionLetterforCG(criteria)),
		downloadApplicationforCG: criteria => dispatch(downloadApplicationforCG(criteria)),
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
)(CGApplicationDetails);
