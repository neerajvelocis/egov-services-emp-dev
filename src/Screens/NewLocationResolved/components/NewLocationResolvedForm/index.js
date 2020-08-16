import React from "react";
import { Button } from "components";
import { ImageUpload } from "modules/common";
import { TextArea } from "modules/common";

const ComplaintResolvedForm = ({ form, options,userInfo, onSubmit,bookingservice,bookingtype,applicationNumber,createdBy,tenantId, ontextAreaChange, handleOptionChange, optionSelected, commentValue }) => {
  console.log('submit commentValue',commentValue);

 
  if(form && form.fields){
    let formValue={...form.fields};

    const foundFirstLavel = userInfo&&userInfo.roles.some(el => el.code === 'MCC_APPROVER');
    if(foundFirstLavel){
      formValue.action.value='APPROVE';
    }
    const foundSecondLavel = userInfo&&userInfo.roles.some(el => el.code === 'OSD_APPROVER');
  
    if(foundSecondLavel){
      formValue.action.value='APPROVEOSD';
    }
    // const foundthirdLavel = userInfo&&userInfo.roles.some(el => el.code === 'ADMIN_APPROVER');
  
    // if(foundthirdLavel){
    //   formValue.action.value='PUBLISH';
    // }
    
formValue.applicationNumber.value=applicationNumber;
formValue.tenantId.value=tenantId;
formValue.createdBy.value=createdBy;
formValue.remarks.value=commentValue;
formValue.createdOn.value=new Date();
// formValue.bookingType.value=bookingtype;
formValue.businessService.value=bookingservice
console.log('formValue--->>',formValue)
  }

  console.log('submit button2',form)
  const fields = form.fields || {};
  const submit = form.submit;
  return (
    <div>
       <div className="custom-padding-for-screens">
        <div className="complaint-resolved-main-container">
          <TextArea onChange={ontextAreaChange} value={commentValue} {...fields.textarea} />
        </div>
      </div>
      <button 
       onClick={onSubmit}
       className="responsive-action-button"
       id="rejectcomplaint-submit-action"
       primary={true}
       {...submit}
       fullWidth={true}
      >Approve</button>
    </div>
  );
};

export default ComplaintResolvedForm;