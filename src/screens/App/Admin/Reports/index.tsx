import React from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import { DateTime } from "luxon";
import { Cell } from "react-table";
import capitalize from "lodash/capitalize";

// Components
import Link from "next/link";
import Table from "&components/Table";

// Utils
import urls from "&utils/urls";
import { getSession } from "&utils/auth-utils";
import { getIssues, issueFromJsonResponse } from "&actions/IssueActions";
import { Issue } from "&server/models/Issue";
import { IssueType } from "&server/models/IssueType";
import { IssueStatus } from "&server/models/IssueStatus";
import { StageType } from "&server/models/StageType";

// Styles
import classes from "./Reports.module.scss";

const initialLimit = 5;
const initialPage = 0;

interface PropTypes {
  initialIssues: Issue[];
  error?: string;
}

const ReportsPage = ({ initialIssues, error }: PropTypes) => {
  const router = useRouter();
  const [issues, setIssues] = React.useState<Issue[]>(
    initialIssues.map(issueFromJsonResponse)
  );
  const [limit, setLimit] = React.useState<number>(initialLimit);
  const [page, setPage] = React.useState<number>(initialPage);
  const [loading, setLoading] = React.useState<boolean>(false);
  const fetchIdRef = React.useRef(0);

  React.useEffect(() => {
    if (error != null) {
      void Swal.fire({
        title: "Error",
        text: error,
        icon: "error",
      });
    }
  }, []);

  const fetchData = React.useCallback(
    async (pagination: { limit: number; page: number }) => {
      const fetchId = ++fetchIdRef.current;
      setLoading(true);

      if (fetchId === fetchIdRef.current) {
        try {
          const response = await getIssues({
            ...pagination,
          });

          if (response == null) {
            throw new Error("Failed to get issues!");
          }

          setIssues(response);
        } catch (error) {
          console.log("Error", error);

          await Swal.fire({
            title: "Failed To Get Issues",
            text: error.message,
            icon: "error",
          });
        }

        setLoading(false);
      }
    },
    []
  );

  const columns = React.useMemo(
    () => [
      {
        Header: "Issue Type",
        accessor: "issueType",
        Cell: ({ value }: Cell) =>
          capitalize(
            (value as IssueType[]).map((i) => i.replace("_", " ")).join(", ")
          ),
      },
      {
        Header: "Description",
        accessor: "description",
      },
      {
        Header: "Created At",
        accessor: "createdAt",
        Cell: ({ value }: Cell) =>
          (value as DateTime).toLocaleString(DateTime.DATETIME_MED),
      },
      {
        Header: "Updated At",
        accessor: "updatedAt",
        Cell: ({ value }: Cell) =>
          (value as DateTime).toLocaleString(DateTime.DATETIME_MED),
      },
      {
        Header: "Status",
        accessor: "status",
      },
    ],
    []
  );

  console.log("issues", issues);

  return (
    <div className="landingPage">
      <h1 className="landingHeader">Reports</h1>

      <div className="landingContent">
        <div className="landingPadding" />
        <Table
          columns={columns}
          data={issues}
          pagination={{
            limit,
            page,
            total: 7,
            loading,
            fetchData,
          }}
        />

        <div className="landingPadding" />
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const IssueManager = require("&server/mongodb/actions/IssueManager");

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

    const issues = await IssueManager.getIssues({
      sortCreated: -1,
      limit: initialLimit,
      page: initialPage,
    });

    if (issues == null) {
      throw new Error("Failed to get issues!");
    }

    return {
      props: {
        initialIssues: JSON.parse(JSON.stringify(issues)),
      },
    };
  } catch (error) {
    return {
      props: {
        initialIssues: [],
        error: error.message,
      },
    };
  }
};

export default ReportsPage;

ReportsPage.showSidebar = true;
ReportsPage.isLanding = false;
