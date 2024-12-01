import React from 'react';
import ApplicationsList from "../admin/ApplicationsList";

const NotifyStatus=()=>{
    return(
                 <ApplicationsList status={['selected', 'rejected']} title={'hello'}/>
    )
}
export default NotifyStatus;