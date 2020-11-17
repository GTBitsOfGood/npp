import React from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import Swal from "sweetalert2";

// Components
import Link from "next/link";
import Statusbar from "&components/Statusbar";

// Utils
import urls, { getApplicationUrl } from "&utils/urls";
import { getSession } from "&utils/auth-utils";
import { Application } from "&server/models/Application";
import { User } from "&server/models";
import { Organization } from "&server/models/Organization";
import { updateApplicationStage } from "&actions/ApplicationActions";
import { StageType } from "&server/models/StageType";

// Styles
import classes from "./Reports.module.scss";

type ExtendedUser = User & {
  organization: Organization;
};
type ExtendedApplication = Application & {
  _id: string;
  users: ExtendedUser[];
};

interface PropTypes {
  applications: ExtendedApplication[];
  error?: string;
}

const ReportsPage = ({ applications, error }: PropTypes) => {
  const router = useRouter();

  React.useEffect(() => {
    if (error != null) {
      void Swal.fire({
        title: "Error",
        text: error,
        icon: "error",
      });
    }
  }, []);

  const setStage = async (
    application: ExtendedApplication,
    stage: StageType
  ) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Do you want to send this application to the ${stage} stage?`,
      icon: "warning",
      showCancelButton: true,
    });

    if (result.value) {
      try {
        await updateApplicationStage(application._id, stage);

        await router.reload();
      } catch (error) {
        console.log("Error", error);

        await Swal.fire({
          title: "Error",
          text: error.message,
          icon: "error",
        });
      }
    }
  };

  return (
    <div className="landingPage">
      <h1 className="landingHeader">Reports</h1>

      <div className="landingContent">
        <div className="landingPadding" />

        <div className={classes.appList}>
          {applications.map((application) => (
            <div key={application._id} className={classes.app}>
              <h2>{application.users[0].organization.organizationName}</h2>
              <h4>{application.users[0].organization.mission}</h4>
              <h4>
                Submitted:{" "}
                {new Date(application.createdAt as any).toLocaleString()}
              </h4>
              <h4>
                Last Updated:{" "}
                {new Date(application.updatedAt as any).toLocaleString()}
              </h4>
              <Statusbar
                application={application}
                onStageClick={async (stage: StageType) =>
                  setStage(application, stage)
                }
              />
              <p>{application.description}</p>
              <Link href={getApplicationUrl(application)} passHref>
                <a>View Application Page</a>
              </Link>
            </div>
          ))}
        </div>

        <div className="landingPadding" />
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const ApplicationManager = require("&server/mongodb/actions/ApplicationManager");

  try {
    const session = await getSession({ req: context.req } as any);

    if (session?.user == null || !session.user.isAdmin) {
      return {
        props: {},
        redirect: {
          destination: urls.pages.index,
          permanent: false,
        },
      };
    }

    const applications = await ApplicationManager.getApplications(
      session.user,
      { all: true }
    );

    if (applications == null) {
      throw new Error("Failed to get applications!");
    }

    return {
      props: {
        applications: JSON.parse(JSON.stringify(applications)),
      },
    };
  } catch (error) {
    return {
      props: {
        applications: [],
        error: error.message,
      },
    };
  }
};

export default ReportsPage;

ReportsPage.showSidebar = true;
ReportsPage.isLanding = false;
