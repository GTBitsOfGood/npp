import React from "react";
import { GetServerSideProps } from "next";

// Screens
import UnderVerificationScreen from "./UnderVerification";
import VerificationFormScreen from "./VerificationForm";

// Utils
import { getUserOrg } from "&utils/auth-utils";
import { getSession } from "next-auth/client";
import { OrganizationStatus } from "&server/models/OrganizationStatus";

interface Props {
  underVerification: boolean;
}

const VerificationScreen = ({ underVerification }: Props) => {
  if (underVerification) {
    return <UnderVerificationScreen />;
  }

  return <VerificationFormScreen />;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const UserManager = require("&server/mongodb/actions/UserManager");
    const session = await getSession({ req: context.req as any });

    if (session?.user == null) {
      throw new Error("User is not logged in!");
    }

    const organization = await getUserOrg(session);
    const user = await UserManager.getUserByEmail(session.user.email);

    if (organization && user.orgStatus !== OrganizationStatus.Verified) {
      return {
        props: {
          underVerification: true,
        },
      };
    }

    return {
      props: {
        underVerification: false,
      },
    };
  } catch (error) {
    return {
      props: {
        error: error.message,
      },
    };
  }
};

export default VerificationScreen;

VerificationScreen.showSidebar = false;
VerificationScreen.isLanding = false;
