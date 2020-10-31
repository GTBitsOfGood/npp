import React from "react";

// Components
import Calendar from "&components/Calendar";

// Styling
// import classes from "./IndexPage.module.scss";

const IndexPage = () => {
  return (
    <div className="landingPage">
      <h1>Welcome to Nonprofit Portal</h1>

      <Calendar onSelectDate={(num) => alert(num)} />
    </div>
  );
};

export default IndexPage;
