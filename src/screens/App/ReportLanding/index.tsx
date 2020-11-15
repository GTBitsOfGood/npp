import React from "react";

// Components
import ButtonLink from "&components/ButtonLink";

// Utils
import urls from "&utils/urls";

const ReportLanding = () => (
  <div className="landingPage">
    <h1 className="landingHeader">Report a Problem</h1>

    <h3 className="landingText">
      As a partner, Bits of Good will help you build software that turns your
      need into real productLorem ipsum dolor sit amet, consectetur adipiscing
      elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
    </h3>

    <div className="landingButton">
      <ButtonLink variant="primary" href={urls.pages.app.report}>
        <h3>File an Issue</h3>
      </ButtonLink>
    </div>
  </div>
);

export default ReportLanding;
