import React, { useEffect } from "react";

import { useRouter } from "next/router";
import { useSession } from "next-auth/client";

// Components
import Statusbar from "&components/Statusbar";
import ButtonLink from "&components/ButtonLink";

// Iconography
import SchedulePerson from "&icons/SchedulePerson";

// Interfaces
import { Application } from "&server/models/Application";

// Utils
import urls from "&utils/urls";
import { GetStaticPaths, GetStaticProps } from "next";
import { applicationFromJson } from "&actions/ApplicationActions";
import { stageToIndex, StageType } from "&server/models/StageType";

interface ScheduleLandingProps {
  application: Application;
}

const ScheduleLanding = ({ application }: ScheduleLandingProps) => {
  const router = useRouter();
  const [session, loading] = useSession();

  useEffect(() => {
    if (!loading && !session) {
      void router.replace(urls.pages.index);
    }
  }, [loading, session]);

  if (loading || !session || router.isFallback) {
    return <h1 className="loadingText">Loading...</h1>;
  }

  return (
    <div className="landingPage">
      <h1 className="landingHeader">Schedule an Interview with us</h1>

      <Statusbar application={application} />

      <SchedulePerson className="landingImage" />

      <div className="landingContent">
        <div className="landingPadding" />

        <h3 className="landingText">
          Congratulations! After reviewing your application, we have decided to
          move forward to the interview process! For the next step, we want to
          have a one-hour virtual interview to learn more about you. When you
          have a moment, please let us know when you’d be available for the
          interview.
        </h3>

        <div className="landingPadding" />
      </div>

      <div className="landingButton">
        <ButtonLink
          variant="primary"
          href={urls.pages.app.application.schedule(application.id!)}
        >
          <h3>Schedule Now</h3>
        </ButtonLink>
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const ApplicationManager = require("&server/mongodb/actions/ApplicationManager");

  try {
    const { id } = (context.params || {}) as Record<string, unknown>;
    const application = await ApplicationManager.getApplicationById(id);
    const appJson = applicationFromJson(application);

    if (
      stageToIndex[appJson.stage!] < stageToIndex[StageType.AWAITING_SCHEDULE]
    ) {
      return {
        props: {
          application: null,
        },
        notFound: true,
        revalidate: 1,
      };
    } else {
      return {
        props: {
          application: {
            ...appJson,
            createdAt: appJson.createdAt?.toISO(),
            updatedAt: appJson.updatedAt?.toISO(),
          },
        },
        revalidate: 60,
      };
    }
  } catch (error) {
    return {
      props: {
        application: null,
        error: error.message,
      },
      notFound:
        error.name === "CastError" ||
        error.message === "Application does not exist!",
      revalidate: 1,
    };
  }
};

export const getStaticPaths: GetStaticPaths = async () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const ApplicationManager = require("&server/mongodb/actions/ApplicationManager");

  const applications = await ApplicationManager.getApplicationsByStage(
    StageType.AWAITING_SCHEDULE
  );

  return {
    paths: applications.map((id: string) => ({
      params: { id },
    })),
    fallback: true,
  };
};

export default ScheduleLanding;

ScheduleLanding.showSidebar = true;
ScheduleLanding.isLanding = true;
