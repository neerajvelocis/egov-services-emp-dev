import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { Button } from "components";
import { Question } from "modules/common";
import { TextArea } from "modules/common";

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

const RejectComplaintForm = ({ form, options, onSubmit,bookingservice,bookingtype,applicationNumber,createdBy,tenantId, ontextAreaChange, handleOptionChange, optionSelected, commentValue, classes }) => {
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
          <div className="custom-padding-for-screens">
        <div className="reject-complaint-textArea">
        <TextField
              id="comment-value"
              name="comment-value"
              type="string"
              value={commentValue}
              hintText={
                <Label
                  label="MYBK_ADD_COMMENTS_PLACEHOLDER"
                  color="rgba(0, 0, 0, 0.3799999952316284)"
                  fontSize={16}
                  labelStyle={{
                    letterSpacing: "0.7px",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    width: "90%",
                    overflow: "hidden"
                  }}
                />
              }
              // floatingLabelText={
              //   <Label
              //     key={0}
              //     label="MYBK_COMMON_COMMENTS_VALUE"
              //     color="rgba(0,0,0,0.60)"
              //     fontSize="12px"
              //   />
              // }
              onChange={ontextAreaChange}
              underlineStyle={{ bottom: 7 }}
              underlineFocusStyle={{ bottom: 7 }}
              hintStyle={{ width: "100%" }}
            />
          
          {/* <TextArea onChange={ontextAreaChange} value={commentValue} {...fields.textarea} /> */}
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
          >Reject</button>
        </div>
    </div>
  );
};

export default withStyles( styles )( RejectComplaintForm );
