import React from "react";

// Components
import Calendar from "&components/Calendar";
import TimePicker from "&components/TimePicker";

// Styling
// import classes from "./IndexPage.module.scss";

const IndexPage = () => {
  const [selDate, setDate] = React.useState<Date | null>(null);

  return (
    <div className="landingPage">
      <h1>Welcome to Nonprofit Portal</h1>

      <Calendar value={selDate} onSelectDate={(date) => setDate(date)} />
      {selDate != null && (
        <TimePicker date={selDate} onSelectTime={(time) => alert(time)} />
      )}
    </div>
  );
};

export default IndexPage;
