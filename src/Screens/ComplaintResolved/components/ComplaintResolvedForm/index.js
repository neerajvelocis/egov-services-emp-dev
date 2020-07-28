import React from "react";
import { Button } from "components";
import { ImageUpload } from "modules/common";
import { TextArea } from "modules/common";

const ComplaintResolvedForm = ({ form, options, onSubmit,bookingservice,bookingtype,applicationNumber,createdBy,tenantId, ontextAreaChange, handleOptionChange, optionSelected, commentValue }) => {
  console.log('submit button',form)
// let bookingsRemarks=[{bkCreatedBy:createdBy,bkRemarks:commentValue,bkCreatedOn:new Date()}];

  if(form && form.fields){
    let formValue={...form.fields};
formValue.applicationNumber.value=applicationNumber;
formValue.tenantId.value=tenantId;
formValue.createdBy.value=createdBy;
formValue.remarks.value=commentValue;
formValue.createdOn.value=new Date();
formValue.bookingType.value=bookingtype;
formValue.businessService.value=bookingservice
console.log('formValue--->>',formValue)
  }

  console.log('submit button2',form)
  const fields = form.fields || {};
  const submit = form.submit;
  return (
    <div>
      
      {/* <div className="custom-padding-for-screens">
      <b>Application Number: </b>{applicationNumber}
    </div>    */}
    
       <div className="custom-padding-for-screens">
        {/* <div className="reject-complaint-question request-reaasign-question">
          <Question options={options} label={"ES_REJECT_COMPLAINT_QUESTION"} handleChange={handleOptionChange} valueSelected={optionSelected} />
        </div> */}
        <div className="reject-complaint-textArea">
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
      >Verify and Forward</button>
      {/* <div className="responsive-action-button-cont">
        <Button
          onClick={onSubmit}
          className="responsive-action-button"
          id="rejectcomplaint-submit-action"
          primary={true}
          {...submit}
          fullWidth={true}
        />
      </div> */}
    </div>
  );
};

export default ComplaintResolvedForm;
