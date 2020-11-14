import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { useRouter } from "next/router";
import { useSession } from "next-auth/client";
import Swal from "sweetalert2";

// Components
import Statusbar from "&components/Statusbar";
import ButtonLink from "&components/ButtonLink";

// Utils
import { getApplications } from "&actions/ApplicationActions";
import urls from "&utils/urls";
import { Application } from "&server/models/Application";

// Styles
import classes from "./ProjectScreen.module.scss";

const ProjectPage = () => {
  const router = useRouter();
  const [session, loading] = useSession();
  const [latestApp, setLatest] = useState<Application | null>(null);
  const [appLoaded, setAppLoaded] = useState<boolean>(false);

  useEffect(() => {
    void (async () => {
      if (!loading) {
        if (!session) {
          await router.replace(urls.pages.index);
          // } else if (!(session.user as any)?.organizationVerified) {
          // void router.replace(urls.pages.app.verification);
        } else {
          try {
            const applications = await getApplications();

            setLatest(applications?.[0]);
          } catch (error) {
            console.log("Error", error);

            await Swal.fire({
              title: "Error",
              text: "Failed to submit application, please try again later!",
              icon: "error",
            });

            setLatest(null);
          }

          setAppLoaded(true);
        }
      }
    })();
  }, [loading, session]);

  if (loading || !session || !appLoaded) {
    return <h1 className="loadingText">Loading...</h1>;
  }

  return (
    <div className="landingPage">
      <h1 className="landingHeader">
        {latestApp != null ? "Project Status" : "Apply for a New Project"}
      </h1>

      <Statusbar application={latestApp} />

      <h3 className="landingText">
        As a partner, Bits of Good will help you build software that turns your
        need into real productLorem ipsum dolor sit amet, consectetur adipiscing
        elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi
        ut
      </h3>

      <div className={clsx("landingButton", classes.button)}>
        <ButtonLink variant="primary" href={urls.pages.app.apply}>
          <h3>{latestApp != null ? "View" : "Apply Now"}</h3>
        </ButtonLink>
      </div>
      {latestApp != null &&
        latestApp.stage === "DECISION" &&
        latestApp.decision === false && (
          <div className={clsx("landingButton", classes.button)}>
            <ButtonLink variant="secondary" href={urls.pages.app.apply}>
              <h3>Apply Again</h3>
            </ButtonLink>
          </div>
        )}
    </div>
  );
};

export default ProjectPage;
