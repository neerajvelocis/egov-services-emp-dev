import React from "react";
import Loadable from "react-loadable";

// pgr employee specific screens
import { ReOpenComplaint, ReopenAcknowledgement } from "../modules/common";

const Loading = () => <div />;

const Login = Loadable({
  loader: () => import("../Screens/User/Login"),
  loading: Loading
});
const OTP = Loadable({
  loader: () => import("../Screens/User/OTP"),
  loading: Loading
});

const RequestReAssign = Loadable({
  loader: () => import("../Screens/RequestReAssign"),
  loading: Loading
});
const AllComplaints = Loadable({
  loader: () => import("../Screens/AllComplaints"),
  loading: Loading
});
const AllRequests = Loadable({
  loader: () => import("../Screens/AllComplaints"),
  loading: Loading
});
const ComplaintResolved = Loadable({
  loader: () => import("../Screens/ComplaintResolved"),
  loading: Loading
});
const ComplaintCreated = Loadable({
  loader: () => import("../Screens/ComplaintCreated"),
  loading: Loading
});
const ApplicationSummary = Loadable({
  loader: () => import("../Screens/ApplicationDetails"),
  loading: Loading
});
const ApplicationBWTSummary = Loadable({
  loader: () => import("../Screens/BwtApplicationDetails"),
  loading: Loading
});


const ServiceHome = Loadable({
  loader: () => import("../Screens/ApplicationDetails"),
  loading: Loading
});


const AssignComplaint = Loadable({
  loader: () => import("../Screens/AssignComplaint"),
  loading: Loading
});
const EmployeeDirectory = Loadable({
  loader: () => import("../Screens/EmployeeDirectory"),
  loading: Loading
});
const ClosedComplaints = Loadable({
  loader: () => import("../Screens/ClosedComplaints"),
  loading: Loading
});
const RejectComplaint = Loadable({
  loader: () => import("../Screens/RejectComplaint"),
  loading: Loading
});
const RejectBWTComplaint = Loadable({
  loader: () => import("../Screens/RejectBWTBooking"),
  loading: Loading
});

const ApplyWaterTanker = Loadable({
  loader: () => import("../Screens/ApplyWaterTanker"),
  loading: Loading
})
const deliverBooking= Loadable({
  loader: () => import("../Screens/DeliveredBWTBooking"),
  loading: Loading
});
const notDeliverBooking= Loadable({
  loader: () => import("../Screens/NotDeliveredBWTBooking"),
  loading: Loading
});

const AssignToDriver= Loadable({
  loader: () => import("../Screens/AssignToDriver"),
  loading: Loading
});
const ComplaintRejected = Loadable({
  loader: () => import("../Screens/ComplaintRejected"),
  loading: Loading
});
const ComplaintAssigned = Loadable({
  loader: () => import("../Screens/ComplaintAssigned"),
  loading: Loading
});
const ResolveSuccess = Loadable({
  loader: () => import("../Screens/ResolveSuccess"),
  loading: Loading
});
const CreateSuccess= Loadable({
  loader: () => import("../Screens/CreateWBTApplicationSuccess"),
  loading: Loading
});
const AssignToDriverSuccess = Loadable({
  loader: () => import("../Screens/AssignToDriverSuccess"),
  loading: Loading
});

const RejectBWTApplicationSuccess= Loadable({
  loader: () => import("../Screens/RejectBWTApplicationSuccess"),
  loading: Loading
});

const DeliveredApplicationSuccess= Loadable({
  loader: () => import("../Screens/DeliveredBWTApplicationSuccess"),
  loading: Loading
});
const ReassignSuccess = Loadable({
  loader: () => import("../Screens/ReassignSuccess"),
  loading: Loading
});
const CreateComplaint = Loadable({
  loader: () => import("../Screens/CreateComplaint"),
  loading: Loading
});
const SearchScreen = Loadable({
  loader: () => import("../Screens/SearchScreen"),
  loading: Loading
});

// import CreateEmployee from "modules/employee/pgr/CreateEmployee";
const redirectionUrl = "/user/login";
const routes = [
  {
    path: "user/login",
    component: Login,
    needsAuthentication: false,
    redirectionUrl: "/"
  },
  {
    path: "user/otp",
    component: OTP,
    needsAuthentication: false,
    redirectionUrl: "/"
  },
  {
    path: "all-complaints",
    component: AllComplaints,
    needsAuthentication: true,
    options: {
      hideFooter: true,
      title: "ES_OPEN_COMPLAINTS_HEADER",
      hideTitle: false,
      redirectionUrl,
      hideFor: "ao",
      customFor: "csr",
      customTitle: "ES_ALL_COMPLAINTS_HEADER"
    }
  },
  {
    path: "egov-services/all-applications",
    component: AllRequests,
    needsAuthentication: true,
    options: {
      hideFooter: true,
      title: "ES_OPEN_APPLICAION_HEADER",
      hideTitle: false,
      redirectionUrl,
      hideFor: "ao",
      customFor: "employee",
      customTitle: "MYBK_ALL_APPLICAION_HEADER"
    }
  },



  {
    path: "egov-services/applywatertanker",
    component: ApplyWaterTanker,
    needsAuthentication: true,
    options: {
      hideFooter: true,
      title: "Apply for Water Tanker",
      hideTitle: false,
      redirectionUrl,
      hideFor: "ao",
      customFor: "employee",
      customTitle: "Apply for Water Tanker"
    }
  },
  {
    path: "search-complaint",
    component: SearchScreen,
    needsAuthentication: true,
    options: { hideFooter: true, title: "CORE_COMMON_SEARCH_COMPLAINT" }
  },
  {
    path: "egov-services/booking-resolved/:applicationId?",
    component: ComplaintResolved,
    needsAuthentication: true,
    options: {
      hideFooter: true,
      title: "MYBK_APPLICATION_DETAILS_RESOLVE",
      titleBackground: true, // Use this if you need white background for title in web version
      redirectionUrl
    }
  },
  {
    path: "egov-services/application-details/:applicationId",
    component: ApplicationSummary,
    needsAuthentication: true,
    options: {
      hideFooter: true,
      // title: "CS_HEADER_APPLICATION_SUMMARY",
      redirectionUrl
    }
  },
  {
    path: "egov-services/bwt-application-details/:applicationId",
    component: ApplicationBWTSummary,
    needsAuthentication: true,
    options: {
      hideFooter: true,
      title: "CS_HEADER_APPLICATION_SUMMARY",
      redirectionUrl
    }
  },


  {
    path: "egov-services/home123",
    component: ApplicationSummary,
    needsAuthentication: true,
    options: {
      hideFooter: true,
      title: "CS_HEADER_APPLICATION_SUMMARY",
      redirectionUrl
    }
  },
  {
    path: "closed-complaints",
    component: ClosedComplaints,
    needsAuthentication: true,
    options: {
      hideFooter: true,
      title: "ES_CLOSED_COMPLAINTS_HEADER",
      redirectionUrl
    }
  },
  {
    path: "complaint-reassigned/:serviceRequestId?",
    component: ComplaintAssigned,
    needsAuthentication: true,
    options: {
      hideFooter: true,
      title: "ES_COMPLAINT_REASSIGNED_HEADER",
      hideTitle: true,
      redirectionUrl
    }
  },
  {
    path: "egov-services/resolve-success",
    component: ResolveSuccess,
    needsAuthentication: true,
    options: {
      hideBackButton: true,
      hideFooter: true,
      title: "CS_COMPLAINT_DETAILS_COMPLAINT_RESOLVED",
      hideTitle: true,
      redirectionUrl
    }
  },
  {
    path: "egov-services/create-success",
    component: CreateSuccess,
    needsAuthentication: true,
    options: {
      hideBackButton: true,
      hideFooter: true,
      title: "CS_COMPLAINT_DETAILS_COMPLAINT_RESOLVED",
      hideTitle: true,
      redirectionUrl
    }
  },

  
  {
    path: "egov-services/assign-to-success",
    component: AssignToDriverSuccess,
    needsAuthentication: true,
    options: {
      hideBackButton: true,
      hideFooter: true,
      title: "CS_COMPLAINT_DETAILS_COMPLAINT_RESOLVED",
      hideTitle: true,
      redirectionUrl
    }
  },

  {
    path: "egov-services/reject-bwt-application-success",
    component: RejectBWTApplicationSuccess,
    needsAuthentication: true,
    options: {
      hideBackButton: true,
      hideFooter: true,
      title: "CS_COMPLAINT_DETAILS_COMPLAINT_RESOLVED",
      hideTitle: true,
      redirectionUrl
    }
  },

  {
    path: "egov-services/delivered-bwt-application-success",
    component: DeliveredApplicationSuccess,
    needsAuthentication: true,
    options: {
      hideBackButton: true,
      hideFooter: true,
      title: "CS_COMPLAINT_DETAILS_COMPLAINT_RESOLVED",
      hideTitle: true,
      redirectionUrl
    }
  },
  {
    path: "reassign-success",
    component: ReassignSuccess,
    needsAuthentication: true,
    options: {
      hideBackButton: true,
      hideFooter: true,
      hideTitle: true,
      title: "CS_COMMON_RE-ASSIGN REQUESTED",
      redirectionUrl
    }
  },
  {
    path: "complaint-assigned/:serviceRequestId?",
    component: ComplaintAssigned,
    needsAuthentication: true,
    options: {
      hideBackButton: true,
      hideFooter: true,
      hideTitle: true,
      title: "ES_COMPLAINT_ASSIGNED_HEADER",
      redirectionUrl
    }
  },
  {
    path: "egov-services/application-rejected",
    component: ComplaintRejected,
    needsAuthentication: true,
    options: {
      title: "ES_COMPLAINT_REJECTED_HEADER",
      hideTitle: true,
      hideFooter: true,
      redirectionUrl,
      hideBackButton: true
    }
  },
  {
    path: "assign-complaint/:serviceRequestId?",
    component: AssignComplaint,
    needsAuthentication: true,
    options: {
      title: "ES_ASSIGN_TO_EMPLOYEE_HEADER",
      hideFooter: true,
      redirectionUrl
    }
  },
  {
    path: "reassign-complaint/:serviceRequestId?",
    component: AssignComplaint,
    needsAuthentication: true,
    options: {
      title: "ES_REASSIGN_TO_EMPLOYEE_HEADER",
      hideFooter: true,
      redirectionUrl
    }
  },
  {
    path: "employee-directory",
    component: EmployeeDirectory,
    needsAuthentication: true,
    options: {
      title: "ES_EMPLOYEE_DIRECTORY_HEADER",
      hideFooter: true,
      redirectionUrl
    }
  },
  {
    path: "egov-services/reject-booking/:applicationId?",
    component: RejectComplaint,
    needsAuthentication: true,
    options: {
      // title: "ES_REASON_TO_REJECT_HEADER",
      titleBackground: true, // Use this if you need white background for title in web version
      hideFooter: true,
      redirectionUrl
    }
  },
  {
    path: "egov-services/reject-bwt-booking/:applicationId?",
    component: RejectBWTComplaint,
    needsAuthentication: true,
    options: {
      // title: "ES_REASON_TO_REJECT_HEADER",
      titleBackground: true, // Use this if you need white background for title in web version
      hideFooter: true,
      redirectionUrl
    }
  },

  {
    path: "egov-services/deliver-application/:applicationId?",
    component: deliverBooking,
    needsAuthentication: true,
    options: {
      // title: "ES_REASON_TO_REJECT_HEADER",
      titleBackground: true, // Use this if you need white background for title in web version
      hideFooter: true,
      redirectionUrl
    }
  },
  {
    path: "egov-services/not-deliver-application/:applicationId?",
    component: notDeliverBooking,
    needsAuthentication: true,
    options: {
      // title: "ES_REASON_TO_REJECT_HEADER",
      titleBackground: true, // Use this if you need white background for title in web version
      hideFooter: true,
      redirectionUrl
    }
  },
  
 
  {
    path: "egov-services/assignto-driver/:applicationId?",
    component: AssignToDriver,
    needsAuthentication: true,
    options: {
       title: "MYBK_ASSIGN_TO_DRIVER_HEADER",
      titleBackground: true, // Use this if you need white background for title in web version
      hideFooter: true,
      redirectionUrl
    }
  },


  
  {
    path: "request-reassign/:serviceRequestId?",
    component: RequestReAssign,
    needsAuthentication: true,
    options: {
      title: "CS_HEADER_REQUEST_REASSIGN",
      titleBackground: true, // Use this if you need white background for title in web version
      hideFooter: true,
      redirectionUrl
    }
  },
  {
    path: "create-complaint",
    component: CreateComplaint,
    needsAuthentication: true,
    options: {
      title: "CS_ADD_COMPLAINT_COMPLAINT_SUBMISSION",
      hideFooter: true,
      redirectionUrl,
      isHomeScreen: true
    }
  },
  {
    path: "complaint-submitted",
    component: ComplaintCreated,
    needsAuthentication: true,
    options: {
      hideFooter: true,
      title: "CS_HEADER_COMPLAINT_SUBMITTED",
      hideTitle: true,
      hideBackButton: true
    }
  },
  {
    path: "reopen-complaint/:serviceRequestId?",
    component: ReOpenComplaint,
    needsAuthentication: true,
    options: {
      title: "CS_HEADER_REOPEN_COMPLAINT",
      titleBackground: true // Use this if you need white background for title in web version
    }
  },
  {
    path: "reopen-acknowledgement",
    component: ReopenAcknowledgement,
    needsAuthentication: true,
    options: {
      hideFooter: true,
      hideBackButton: true,
      title: "CS_COMMON_COMPLAINT_REOPENED",
      hideTitle: true
    }
  }
  // {
  //   path: "create-employee",
  //   component: CreateEmployee,
  //   needsAuthentication: true,
  //   options: {
  //     hideFooter: true,
  //     title: "Create Employee",
  //     hideTitle: true,
  //     hideBackButton: true
  //   }
  // }
];

export default routes;
