import React from "react";
import { PrimaryButton } from '@fluentui/react';

function ReminderCard({ details , delFunc}){
  return (
    <div className={ details.status === "Pending" ? "ReminderCards": "oldReminders"}>
      <p><b>Activity:</b> {details.activityname}</p>
      {/* <p><b>Type:</b> {details.type}</p> */}
      <p><b>Time:</b> {details.time}</p>
      <p><b>Description</b>{details.description}</p>
      <PrimaryButton onClick={()=>{delFunc(details._id)}}>Delete</PrimaryButton>
    </div>
  );

}

export default ReminderCard;