import React from "react";
import { Button } from "components";
import { Question } from "modules/common";
import { TextArea } from "modules/common";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ( {
  root: {
    width: "100%",
    textAlign: 'right'
  },
  btnWrapper: {
    width: '100%',
    textAlign: 'right'
  },
  button: {
    height: "48px",
    minWidth: "200px",
    border: "none",
    color: "#fff",
    fontWeight: "bold",
    fontSize: "14px",
    borderRadius: "5px",
    backgroundColor: '#FE7A51',
    textTransform: 'uppercase',
    // display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: "pointer",
    boxShadow: '0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)',
    "&:hover, &:focus": {       
        backgroundColor: '#DB6844',
        color: "#fff",
        border: "none"
    },
    "&:active": {        
        backgroundColor: '#DB6844',
        color: "#fff",
        border: "none"
    },
    "&:focus": {
        outline:0
    }
  }
});
const RejectComplaintForm = ({ form, options,classes,driverFullName,mobileNumber,approverName, onSubmit,bookingservice,bookingtype,applicationNumber,createdBy,tenantId, ontextAreaChange, handleOptionChange, optionSelected, commentValue }) => {
  console.log(' RejectComplaintForm form',form)
// let bookingsRemarks=[{bkCreatedBy:createdBy,bkRemarks:commentValue,bkCreatedOn:new Date()}];

  if(form && form.fields){
    let formValue={...form.fields};
formValue.applicationNumber.value=applicationNumber;
formValue.tenantId.value=tenantId;
formValue.createdBy.value=createdBy;
formValue.remarks.value=commentValue;
formValue.createdOn.value=new Date();
formValue.bookingType.value=bookingtype;
formValue.businessService.value=bookingservice;
formValue.driverName.value = driverFullName;
    formValue.mobileNumber.value = mobileNumber;
    formValue.approverName.value = approverName;
console.log('formValue--->>',formValue)
  }

  console.log('submit button2',form)
  const fields = form.fields || {};
  const submit = form.submit;
  return (
    <div>
 {/* <div className="custom-padding-for-screens">
      <b>Application Number: </b>{applicationNumber}
    </div>   */}
          <div className="custom-padding-for-screens">
        {/* <div className="reject-complaint-question request-reaasign-question">
          <Question options={options} label={"ES_REJECT_COMPLAINT_QUESTION"} handleChange={handleOptionChange} valueSelected={optionSelected} />
        </div> */}
        <div className="reject-complaint-textArea">
          <TextArea onChange={ontextAreaChange} value={commentValue} {...fields.textarea} />
        </div>
      </div>
      <div className={classes.btnWrapper}>
        <button
          onClick={onSubmit}
          className={classes.button}
          id="rejectcomplaint-submit-action"
          primary={true}
          {...submit}
          fullWidth={true}
        >Delivered/Closed</button>
     </div>
    </div>
  );
};

export default withStyles( styles )( RejectComplaintForm );
