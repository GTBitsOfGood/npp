import IndexPage from "&screens/Index";

import { useSession } from "next-auth/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import urls from "&utils/urls";

const Index = () => {
  const router = useRouter();
  const [session] = useSession();
  const [route, setRoute] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // @ts-ignore
    if (session && session.user.organizationVerified) {
      setRoute(urls.pages.app.index);
      setLoading(false);
    } else if (session) {
      const query = new URLSearchParams({
        email: session.user.email,
      });
      fetch(`${urls.baseUrl}${urls.api.user}/?${query}`, {
        method: "get",
        mode: "same-origin",
        credentials: "include",
      }).then(async (response) => {
        const json = await response.json();
        console.log(json.payload.organization);
        setRoute(
          json.payload.organization
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

export default Index;
