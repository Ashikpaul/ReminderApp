import React , { useEffect, useState } from "react";
import "./styles.css";
import axios from "axios";
import ReminderCard from "./components/reminderCard";
import { PrimaryButton, TextField, Dialog, DialogType, DialogFooter} from '@fluentui/react';

let interval = null;
const URL = "https://reminder-backend.glitch.me/reminders";

export default function App() {

  const [reminders, setAllReminders] = useState([]);
  const [formData, setFormData] = useState(()=>{});
  const [displayAlert, setDisplayAlert] = useState({ show:false, data:null });

  useEffect(()=>{
    getReminders();
    return () => {
      clearInterval(interval);
    }
  },[]);

  useEffect(()=>{
    if(interval) {
      clearInterval(interval);
    }
    setAlerts();
  },[reminders])

  const setAlerts = () => {
    
    interval = setInterval(()=>{
      let mins = new Date().getMinutes();
      let hours = new Date().getHours();
      let now = `${hours < 10 ? '0'+hours : hours}:${mins < 10 ? '0'+mins : mins}`;
      reminders.forEach((ele)=>{
        if(ele.time === now && ele.status === "Pending")
          setDisplayAlert({
            show: true,
            data: ele
          });
      });
    },2000);
  };

  const getReminders = () => {
    clearInterval(interval);
    setAllReminders([]);
    axios
      .get(URL)
      .then((remData) => {
        setAllReminders(remData.data);
      })
      .catch((err) => console.log(err));
  }

  const handleInputChange = (ev) =>{
    setFormData({...formData, [ev.target.name] : ev.target.value})
  };

  const createReminder = (ev) => {
    ev.preventDefault();
    let newReminder = {
      ...formData,
      status: "Pending"
    };
    axios
      .post(URL+"/add", newReminder)
      .then(() => {
        getReminders();
      }).catch((err) => console.log(err));
  };

  const deleteReminder = (id) => {
    axios
    .delete(URL+"/"+id)
    .then((e) => {
      console.log("Reminder deleted");
      const newReminders = reminders.filter((e) => {
        return e._id !== id;
      });
      setAllReminders(newReminders);
    })
    .catch((err) => console.log(err));    
  }

  const updateReminder = (ele) => {
    clearInterval(interval);
    setDisplayAlert({show:false, data:null});
    axios
      .post(URL+"/update/" + ele._id,{...ele, status: "Done"})
      .then((e) => {
        console.log("Reminder updated");
        getReminders();
      })
      .catch((err) => console.log(err));
  }

  return (
    <div className="App">
      <header>
        <h1>My Reminders</h1>
      </header>
      <main>
        <div className="createReminder">
          <form onSubmit={(ev)=>createReminder(ev)}>
            <TextField label="Activity Name" name="activityname" 
              onChange={(ev)=>{handleInputChange(ev)}} type="text" placeholder="Run, Walk, Jump ...."/>
            <TextField label="Description" name="description" 
              onChange={(ev)=>{handleInputChange(ev)}} type="text" multiline placeholder="Your Activity Description"/>
            <TextField label="Time" name="time" 
              onChange={(ev)=>{handleInputChange(ev)}} type="time" placeholder="13:00"/>
            <br/>
            <PrimaryButton onClick={(ev)=>createReminder(ev)}
              type="submit" >Create</PrimaryButton>
          </form>
        </div>
        <br/>
        <h2>Existing Reminders</h2>
        <div className="reminders">
          { reminders.length > 0 && reminders.reverse().map((rem, idx)=>{
            return <ReminderCard key={idx} details={rem} delFunc={deleteReminder}/>
          })}
        </div>
        <div>
          { displayAlert.show && 
            <Dialog 
              hidden={!displayAlert.show}
              dialogContentProps={{
                type: DialogType.normal,
                title: "Time's up",
                subText: `You had set a reminder regarding ${displayAlert.data.activityname}`,
              }}>
              <DialogFooter>
                <PrimaryButton onClick={()=>{ updateReminder(displayAlert.data) }} text="Close" />
              </DialogFooter>
            </Dialog> }
        </div>
      </main>
      <footer>
        <span>Made with 💖 by Ashik</span>
      </footer>
    </div>
  );
}
