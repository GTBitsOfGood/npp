import IndexPage from "&screens/Index";

import { GetServerSideProps, NextApiRequest } from "next";
import { getSession, Session } from "next-auth/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { getUserOrg } from "&utils/auth-utils";
import urls from "&utils/urls";

interface PropTypes {
  session: Session | null;
}

const Index = ({ session }: PropTypes) => {
  const router = useRouter();
  const [route, setRoute] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // @ts-ignore
    if (session && session.user.organizationVerified) {
      setRoute(urls.pages.app.index);
      setLoading(false);
    } else if (session) {
      getUserOrg(session).then((organization) => {
        setRoute(
          organization
            ? urls.pages.app.index
            : urls.pages.app.verification
        );
        setLoading(false);
      });
    }
  }, [session]);

  if (!session) return <IndexPage />;
  else if (!loading) void router.replace(route);

  // in the event there exists no session (i.e. user isn't
  // currently logged in), loading text will be displayed
  // until the correct page is determined and re-routed
  return <h1 className="loadingText">Loading...</h1>;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession({ req: context.req as any });
  return { props: { session } };
};

export default Index;
