import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/client";

// Components
import Statusbar from "&components/Statusbar";

// Iconography
import SubmittedUFO from "&icons/SubmittedUFO";

// Styling
import classes from "./SubmittedScreen.module.scss";

// Utils
import urls from "&utils/urls";

const SubmittedScreen = () => {
  const router = useRouter();
  const [session, loading] = useSession();
  const [loggedIn, setLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    if (!loading) {
      if (session) {
        setLoggedIn(true);
      } else {
        void router.replace(urls.pages.index);
      }
    }
  }, [router, loading, session]);

  if (loading || !loggedIn) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="landingPage">
      <h1 className="landingHeader">Application Submitted!</h1>

      <Statusbar status={0} />

      <SubmittedUFO className={classes.submittedImage} />

      <h3 className="landingText">
        Your application has been submitted to the BoG team successfully! You
        will get an email notification after we finish reviewing your
        application. If we decide to move on with your project, the next step
        will be an interview to better understand your project and see if it’s a
        good fit for Bits of Good.
      </h3>
    </div>
  );
};

export default SubmittedScreen;
