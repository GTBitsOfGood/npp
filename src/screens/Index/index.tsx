import React from "react";

// Components
import Calendar from "&components/Calendar";
import TimePicker from "&components/Calendar/TimePicker";

// Styling
// import classes from "./IndexPage.module.scss";

const IndexPage = () => {
  const [date, setDate] = React.useState<Date | null>(null);

  return (
    <div className="landingPage">
      <h1>Welcome to Nonprofit Portal</h1>

      <Calendar value={date} onSelectDate={(date) => setDate(date)} />
    </div>
  );
};

export default IndexPage;
