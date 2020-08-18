import React, { Component } from "react";
import Image from "egov-ui-kit/components/Image";
import  Card  from  "egov-ui-kit/components/Card";;

import { connect } from "react-redux";
import get from "lodash/get";
import {
	getQueryArg,
	setBusinessServiceDataToLocalStorage,
	getFileUrlFromAPI,
	setDocuments
} from "egov-ui-framework/ui-utils/commons";
import jp from "jsonpath";
class ImageList extends Component {



    componentDidMount = async () => {
 
    }



    render() {
        let style = {
            display: "inline-block",
            marginRight: "20px"
        }
        let { data } = this.props;

console.log('data in imeage1',data)
//         data=[{fileName: "1593501107427e46eb089eb9e47d82adcec531625d8c9.jp", fileStoreId: "5f2a6078-7fef-4227-a962-462a1673c842", fileUrl: "https://dl.dropboxusercontent.com/s/1gxdgxvj49zajft/admins%20blog.png", documentType: "MCCNEWLOCATION"},
//         {fileName: "1594117903289Screenshot (14)_small.pn", fileStoreId: "7053928d-4744-4366-aa5d-6da80c6d27c1", fileUrl: "https://ch-fileshare.s3.ap-south-1.amazonaws.com/c…22422cb9172b9453c014b8ca0bf35819152095cfd83362ead", documentType: "MCCNEWLOCATION"},
//       {fileName: "1594013543484Screenshot (16)_small.pn", fileStoreId: "bca6d96d-6e9a-44f5-88cf-9b6b231a6ee9", fileUrl: "https://ch-fileshare.s3.ap-south-1.amazonaws.com/c…653605151982d4ef2ef149aee155113bfc6d910fdfdd5f504", documentType: "MCCNEWLOCATION"}];
        

// console.log('data in imeage2',data)
        return data.length > 0 ? (
            data.map((item, index) => { 
                return item.fileUrl !== undefined && <div style={style}> <Image size="medium" width={200} height={154} source={item.fileUrl} /></div>
            })

        ) : (
                "No Document Available."
            );
    }
}

const mapStateToProps = (state, ownProps) => {
    const { screenConfiguration } = state;

    const data = get(
        screenConfiguration.preparedFinalObject,
        ownProps.sourceJsonPath,
        []
    );
    return { data };
};

export default connect(mapStateToProps, null)(ImageList);