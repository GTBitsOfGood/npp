import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/client";

// Components
import Statusbar from "&components/Statusbar";
import ButtonLink from "&components/ButtonLink";

import urls from "&utils/urls";

const ProjectPage = () => {
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
    <div className="landingPage">
      <h1 className="landingHeader">Apply for a New Project</h1>

      <Statusbar status={-1} />

      {/* insert image here*/}

      <h3 className="landingText">
        As a partner, Bits of Good will help you build software that turns your
        need into real productLorem ipsum dolor sit amet, consectetur adipiscing
        elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi
        ut
      </h3>

      <div className="landingButton">
        <ButtonLink variant="primary" href={urls.pages.app.apply}>
          <h3>Apply Now</h3>
        </ButtonLink>
      </div>
    </div>
  );
};

export default ProjectPage;
