import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/client";

// Components
import Statusbar from "&components/Statusbar";

// Styling
import classes from "./SubmittedScreen.module.scss";
import urls from "&utils/urls";

const message =
  "Your application has been submitted to the BoG team successfully! You will get an email notification after we finish reviewing your application. If we decide to move on with your project, the next step will be an interview to better understand your project and see if it’s a good fit for Bits of Good.";

const SubmittedScreen: React.FC = () => {
  const router = useRouter();
  const [session, loading] = useSession();

  useEffect(() => {
    if (!loading && !session) {
      void router.replace(urls.pages.index);
    }
  }, [router, loading, session]);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className={classes.root}>
      <h1>Application Submitted!</h1>

      <div className={classes.statusbar}>
        <Statusbar status={0} />
      </div>
      <div className={classes.submitMsg}>
        <h5>{message}</h5>
      </div>
    </div>
  );
};

export default SubmittedScreen;
