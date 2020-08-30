import * as actionTypes from "./actionTypes";
// import * as commonActions from "../common/actions";
import {CREATEBWTAPPLICATION, APPLICATION,MCCAPPLICATION, COMPLAINT, CATEGORY,PAYMENT,HISTORY,AFTERPAYMENTAPI,DWONLOADPAYMENTRECEIPT,DOWNLOADBWTAPPLICATION,DOWNLOADAPPLICATION,DWONLOADPERMISSIONLETTER } from "../../utils/endPoints";
import { httpRequest } from "egov-ui-kit/utils/api";
// import commonConfig from "config/common.js";

// complaint categories success
const complaintCategoriesFetchSucess = (payload) => {
	return {
		type: actionTypes.COMPLAINTS_CATEGORIES_FETCH_SUCCESS,
		payload,
	};
};

const complaintCategoriesFetchError = (error) => {
	return {
		type: actionTypes.COMPLAINTS_CATEGORIES_FETCH_ERROR,
		error,
	};
};

// complaint department success
const complaintDepartmentFetchSucess = (payload) => {
	return {
		type: actionTypes.COMPLAINTS_DEPARTMENT_FETCH_SUCCESS,
		payload,
	};
};

const complaintDepartmentFetchError = (error) => {
	return {
		type: actionTypes.COMPLAINTS_DEPARTMENT_FETCH_ERROR,
		error,
	};
};

// complaint Sector success
const complaintSectorFetchSucess = (payload) => {
	return {
		type: actionTypes.COMPLAINTS_SECTOR_FETCH_SUCCESS,
		payload,
	};
};

const applicationSectorFetchSucess = (payload) => {
	return {
		type: actionTypes.APPLICATION_SECTOR_FETCH_SUCCESS,
		payload,
	};
};

const applicationSectorFetchError = (error) => {
	return {
		type: actionTypes.APPLICATION_SECTOR_FETCH_ERROR,
		error,
	};
};

const complaintSectorFetchError = (error) => {
	return {
		type: actionTypes.COMPLAINTS_SECTOR_FETCH_ERROR,
		error,
	};
};
// complaints actions
const complaintFetchPending = () => {
	return {
		type: actionTypes.COMPLAINTS_FETCH_PENDING,
	};
};

const complaintFetchComplete = (payload, overWrite) => {
	console.log('payload', payload, overWrite)
	return {
		type: actionTypes.COMPLAINTS_FETCH_COMPLETE,
		payload,
		overWrite: overWrite,
	};
};

const applicationFetchComplete = (payload, overWrite) => {
	console.log('payload', payload, overWrite)
	return {
		type: actionTypes.APPLICATION_FETCH_COMPLETE,
		payload,
		overWrite: overWrite,
	};
};

const MCCapplicationFetchComplete = (payload, overWrite) => {
	return {
		type: actionTypes.MCCAPPLICATION_FETCH_COMPLETE,
		payload,
		overWrite: overWrite,
	};
};
const MCCapplicationFetchError = (error) => {
	return {
		type: actionTypes.MCCAPPLICATION_FETCH_ERROR,
		error,
	};
};
const downloadReceiptComplete = (payload, overWrite) => {
	console.log('payload', payload, overWrite)
	return {
		type: actionTypes.DOWNLOAD_RECEIPT_COMPLETE,
		payload,
		overWrite: overWrite,
	};
};
const downloadPermissionLetterComplete= (payload, overWrite) => {
	console.log('payload', payload, overWrite)
	return {
		type: actionTypes.DOWNLOAD_LETTER_COMPLETE,
		payload,
		overWrite: overWrite,
	};
};

const createWaterTankerComplete= (payload, overWrite) => {
	console.log('payload', payload, overWrite)
	return {
		type: actionTypes.CREATE_WATER_TANKER_COMPLETE,
		payload,
		overWrite: overWrite,
	};
};

const downloadApplicationComplete = (payload, overWrite) => {
	console.log('payload', payload, overWrite)
	return {
		type: actionTypes.DOWNLOAD_APPLICATION_COMPLETE,
		payload,
		overWrite: overWrite,
	};
};
const downloadBWTApplicationComplete = (payload, overWrite) => {
	console.log('payload', payload, overWrite)
	return {
		type: actionTypes.DOWNLOAD_BWT_APPLICATION_COMPLETE,
		payload,
		overWrite: overWrite,
	};
};


const paymentFetchComplete = (payload, overWrite) => {
	console.log('payload', payload, overWrite)
	return {
		type: actionTypes.PAYMENT_FETCH_COMPLETE,
		payload,
		overWrite: overWrite,
	};
};

const fetchAfterPaymentData = (payload, overWrite) => {
	console.log('payload', payload, overWrite)
	return {
		type: actionTypes.AFTER_PAYMENT_FETCH_DETAILS,
		payload,
		overWrite: overWrite,
	};
};
const historyFetchComplete = (payload, overWrite) => {
	console.log('payload', payload, overWrite)
	return {
		type: actionTypes.HISTORY_FETCH_COMPLETE,
		payload,
		overWrite: overWrite,
	};
};


const complaintSendSMS = (message) => {
	return {
		type: actionTypes.COMPLAINTS_SEND_MESSAGE,
		message,
	};
};

const complaintSendSMSTo = (message) => {
	return {
		type: actionTypes.COMPLAINTS_SEND_MESSAGE_SHARECONTENT_TO,
		message,
	};
};

const complaintSendSMSMedia = (message) => {
	return {
		type: actionTypes.COMPLAINTS_SEND_MESSAGE_SHAREMEDIA,
		message,
	};
};

const complaintFetchError = (error) => {
	return {
		type: actionTypes.COMPLAINTS_FETCH_ERROR,
		error,
	};
};


const applicationFetchError = (error) => {
	return {
		type: actionTypes.APPLICATION_FETCH_ERROR,
		error,
	};
};


const downloadReceiptError = (error) => {
	return {
		type: actionTypes.DOWNLOAD_RECEIPT_ERROR,
		error,
	};
};

const downloadPermissionLetterError = (error) => {
	return {
		type: actionTypes.DOWNLOAD_LETTER_ERROR,
		error,
	};
};
const createWaterTankerError = (error) => {
	return {
		type: actionTypes.CREATE_WATER_ERROR,
		error,
	};
};


const downloadApplicationError = (error) => {
	return {
		type: actionTypes.DOWNLOAD_APPLICATION_ERROR,
		error,
	};
};
const downloadBWTApplicationError = (error) => {
	return {
		type: actionTypes.DOWNLOAD_BWT_APPLICATION_ERROR,
		error,
	};
};

const historyFetchError = (error) => {
	return {
		type: actionTypes.HISTORY_FETCH_ERROR,
		error,
	};
};

const fetchAfterPaymentError = (error) => {
	return {
		type: actionTypes.AFTER_PAYMENT_FETCH_ERROR,
		error,
	};
};
const paymentFetchError = (error) => {
	return {
		type: actionTypes.PAYMENT_FETCH_ERROR,
		error,
	};
};





const complaintSortOrder = (order) => {
	return { type: actionTypes.COMPLAINTS_SORT_ORDER, order };
};

export const getComplaintDisplayOrder = (order) => {
	return async (dispatch, getState) => {
		dispatch(complaintSortOrder(order));
	};
};

export const fetchComplaints = (queryObject, hasUsers = true, overWrite) => {
	return async (dispatch, getState) => {
		
		dispatch(complaintFetchPending());
		try {
			let tenantId = "";
			 const payload= await httpRequest(COMPLAINT.GET.URL, COMPLAINT.GET.ACTION, queryObject);
			if (payload.services && payload.services.length === 1) {
			  tenantId = payload.services[0].tenantId;
			}
			//  checkUsers(dispatch, getState(), payload.actionHistory, hasUsers, tenantId);
			dispatch(complaintFetchComplete(payload, overWrite));
		} catch (error) {
			dispatch(complaintFetchError(error.message));
		}
	};
};
export const fetchApplications = (requestBody, hasUsers = true, overWrite) => {
	requestBody.tenantId = "ch"
	return async (dispatch, getState) => {
		try {
			let tenantId = "";
			const payload = await httpRequest(APPLICATION.POST.URL, APPLICATION.POST.ACTION, [], requestBody);
			console.log('payload1----2', payload)
			dispatch(applicationFetchComplete(payload, overWrite));
		} catch (error) {
			dispatch(applicationFetchError(error.message));
		}
	};
};
export const downloadPaymentReceipt = (requestBody, hasUsers = true, overWrite) => {
	//   requestBody.tenantId = "ch"
	console.log('requestBody in download payment---', requestBody)
	return async (dispatch, getState) => {
		try {
			let tenantId = "";
			const payload = await httpRequest(DWONLOADPAYMENTRECEIPT.POST.URL, DWONLOADPAYMENTRECEIPT.POST.ACTION, [], requestBody);
			console.log('payload5----5', payload)
			dispatch(downloadReceiptComplete(payload, overWrite));
		} catch (error) {
			dispatch(downloadReceiptError(error.message));
		}
	};
};
export const downloadApplication = (requestBody, hasUsers = true, overWrite) => {
	
	console.log('requestBody in download payment---', requestBody)
	return async (dispatch, getState) => {
		try {
			let tenantId = "";
			console.log('DOWNLOADAPPLICATION in try block',DOWNLOADAPPLICATION)
			const payload = await httpRequest(DOWNLOADAPPLICATION.POST.URL, DOWNLOADAPPLICATION.POST.ACTION, [], requestBody);
			console.log('payload6----6', payload)
			dispatch(downloadApplicationComplete(payload, overWrite));
		} catch (error) {
			dispatch(downloadApplicationError(error.message));
		}
	};
	
};
export const downloadBWTApplication = (requestBody, hasUsers = true, overWrite) => {
	return async (dispatch, getState) => {
		try {
			let tenantId = "";
			const payload = await httpRequest(DOWNLOADBWTAPPLICATION.POST.URL, DOWNLOADBWTAPPLICATION.POST.ACTION, [], requestBody);
			console.log('payload6----6', payload)
			dispatch(downloadBWTApplicationComplete(payload, overWrite));
		} catch (error) {
			dispatch(downloadBWTApplicationError(error.message));
		}
	};
	
	
};
export const downloadPermissionLetter = (requestBody, hasUsers = true, overWrite) => {
	//   requestBody.tenantId = "ch"
	console.log('requestBody in download payment---', requestBody)
	return async (dispatch, getState) => {
		try {
			let tenantId = "";
			console.log('DWONLOADPERMISSIONLETTER in try block',DWONLOADPERMISSIONLETTER)
			const payload = await httpRequest(DWONLOADPERMISSIONLETTER.POST.URL, DWONLOADPERMISSIONLETTER.POST.ACTION, [], requestBody);
			console.log('payload6----6', payload)
			dispatch(downloadPermissionLetterComplete(payload, overWrite));
		} catch (error) {
			dispatch(downloadPermissionLetterError(error.message));
		}
	};
};

export const fetchPayment = (queryObject, hasUsers = true, overWrite) => {
	console.log('requestBody in in payment ---', queryObject)
	return async (dispatch, getState) => {
		try {
			let tenantId = "";
			console.log('PAYMENT',PAYMENT)
			const payload = await httpRequest(PAYMENT.POST.URL, PAYMENT.POST.ACTION, queryObject);
			console.log('payload2----2', payload)
			dispatch(paymentFetchComplete(payload, overWrite));
		} catch (error) {
			dispatch(paymentFetchError(error.message));
		}
	};
};
export const fetchHistory = (queryObject, hasUsers = true, overWrite) => {
	return async (dispatch, getState) => {
		try {
			let tenantId = "";
			const payload = await httpRequest(HISTORY.POST.URL, HISTORY.POST.ACTION, queryObject);
			console.log('payload3----3', payload)
			dispatch(historyFetchComplete(payload, overWrite));
		} catch (error) {
			dispatch(historyFetchError(error.message));
		}
	};
};
export const fetchDataAfterPayment = (queryObject, hasUsers = true, overWrite) => {
	return async (dispatch, getState) => {
		try {
			let tenantId = "";
			const payload = await httpRequest(AFTERPAYMENTAPI.POST.URL, AFTERPAYMENTAPI.POST.ACTION, queryObject);
			console.log('payload4----4', payload)
			dispatch(fetchAfterPaymentData(payload, overWrite));
		} catch (error) {
			dispatch(fetchAfterPaymentError(error.message));
		}
	};
};
export const createWaterTankerApplication = (requestBody, hasUsers = true, overWrite) => {
	console.log('requestBody in download payment---', requestBody)
	return async (dispatch, getState) => {
		try {
			let tenantId = "";

			const payload = await httpRequest(CREATEBWTAPPLICATION.POST.URL, CREATEBWTAPPLICATION.POST.ACTION, [], requestBody);
			console.log('payload10----10', payload)
			dispatch(createWaterTankerComplete(payload, overWrite));
		} catch (error) {
			dispatch(createWaterTankerError(error.message));
		}
	};
};


export const sendMessage = (message) => {
	return async (dispatch, getState) => {
		dispatch(complaintSendSMS(message));
	};
};

export const sendMessageTo = (message) => {
	return async (dispatch, getState) => {
		dispatch(complaintSendSMSTo(message));
	};
};

export const sendMessageMedia = (message) => {
	return async (dispatch, getState) => {
		dispatch(complaintSendSMSMedia(message));
	};
};


export const fetchApplicaionSector = () => {
	//Fetching Complaint Categories from MDMS
	let requestBody = {
		MdmsCriteria: {
			tenantId: "ch",//commonConfig.tenantId,
			moduleDetails: [
				{
					moduleName: "Booking",
					masterDetails: [
						{
							name: "Sector",
						},

						{
							"name": "PropertyType"
						},
					],
				},
			],
		},
	};
	return async (dispatch) => {
		try {
			const payload = await httpRequest(CATEGORY.GET.URL, CATEGORY.GET.ACTION, [], requestBody);
			
			dispatch(applicationSectorFetchSucess(payload));
		} catch (error) {
			dispatch(applicationSectorFetchError(error.message));
		}
	};
};



	export const fetchMccApplications = (requestBody, hasUsers = true, overWrite) => {
		requestBody.tenantId = "ch"
		return async (dispatch, getState) => {
			try {
				let tenantId = "";
				const payload = await httpRequest(MCCAPPLICATION.POST.URL, MCCAPPLICATION.POST.ACTION, [], requestBody);
				dispatch(MCCapplicationFetchComplete(payload, overWrite));
			} catch (error) {
				
				dispatch(MCCapplicationFetchError(error.message));
			}
		};
	};