import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/client";

// Styling
import classes from "./HomePage.module.scss";

// URLs
import urls from "&utils/urls";
import ApplicationActions from "&actions/ApplicationActions";

const HomePage = () => {
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
      <h2 className={classes.centerText}>
        Welcome to our app, {session?.user?.name ?? "User"}!
      </h2>
      <h3>
        This page can only be accessed by logged-in users, because _app.js
        reroutes users who are not logged-in away from this page.
      </h3>
    </div>
  );
};

export default HomePage;
