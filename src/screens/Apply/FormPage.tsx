import React from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/client";
import classes from "./FormPage.module.scss";
import Form from "../../components/Form";

const FormPage: React.FC = () => {
  const router = useRouter();
  const [session, loading] = useSession();

  React.useEffect(() => {
    if (!loading && !session) {
      void router.replace(urls.pages.index);
    }
  }, [router, loading, session]);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className={classes.root}>
      <h1 className={classes.headerText}>
        Application Form - Non-Profit
      </h1>
      <Form>

      </Form>
    </div>

  );
};

export default FormPage;