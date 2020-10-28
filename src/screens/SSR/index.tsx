import React from "react";
import PropTypes from "prop-types";
import { helloWorld } from "../../actions/General";
import classes from "./SSRPage.module.scss";
import { GetServerSideProps } from "next";

interface PropTypes {
  message?: string;
  errorMessage?: string;
}

const SSRPage: React.FC<PropTypes> = ({ message, errorMessage }: PropTypes) => {
  return (
    <>
      <h2 className={classes.centerText}>Welcome to Next.js!</h2>
      <h3>
        This page is server-side rendered, because all API calls are made in
        getServerSideProps
      </h3>
      {errorMessage == null ? (
        <h4>SSR Message: {message}</h4>
      ) : (
        <h4>SSR Error: {errorMessage}</h4>
      )}
      <p>You can tell because the text above does not flash on refresh</p>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const payload = await helloWorld();

    return {
      props: {
        message: payload.message,
      },
    };
  } catch (error) {
    return {
      props: {
        errorMessage: error.message,
      },
    };
  }
};

export default SSRPage;
