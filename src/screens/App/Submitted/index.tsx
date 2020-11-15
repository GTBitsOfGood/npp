import React, { useEffect } from "react";
import { useRouter } from "next/router";

// Components
import Statusbar from "&components/Statusbar";

// Iconography
import SubmittedUFO from "&icons/SubmittedUFO";

// Utils
import urls from "&utils/urls";
import { Application } from "&server/models/Application";
import { applicationFromJson } from "&actions/ApplicationActions";
import { stageToIndex, StageType } from "&server/models/StageType";
import { GetStaticPaths, GetStaticProps } from "next";
import { useSession } from "&utils/auth-utils";

interface PropTypes {
  application: Application;
}

const SubmittedScreen = ({ application }: PropTypes) => {
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
      <h1 className="landingHeader">Application Submitted!</h1>

      <Statusbar application={application} />

      <SubmittedUFO className="landingImage" />

      <div className="landingContent">
        <div className="landingPadding" />

        <h3 className="landingText">
          Your application has been submitted to the BoG team successfully! You
          will get an email notification after we finish reviewing your
          application. If we decide to move on with your project, the next step
          will be an interview to better understand your project and see if it’s
          a good fit for Bits of Good.
        </h3>

        <div className="landingPadding" />
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

    if (stageToIndex[appJson.stage!] < stageToIndex[StageType.SUBMITTED]) {
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
    StageType.SUBMITTED
  );

  return {
    paths: applications.map((id: string) => ({
      params: { id },
    })),
    fallback: true,
  };
};

export default SubmittedScreen;
