import React, { useEffect, useState } from "react";

import urls from "&utils/urls";
import Link from "next/link";

const VerifyScreen = () => {
  const [user, setUser] = useState([]);

  useEffect(() => {
    fetch(urls.baseUrl + "/api/user")
      .then((response) => response.json())
      .then((data) => {
        setUser(data.payload);
      });
  }, []);

  return (
    <div>
      <Link href={urls.pages.admin.verification.index}>
        {" "}
        BACK TO VERIFICATION
      </Link>
      <h3>Account</h3>
      <h3>Organization Name</h3>
      <h3>EIN</h3>
      <h3>Website</h3>
      <h3>Address</h3>
      <h3>Mission</h3>
      <h3>Status</h3>
    </div>
  );
};

export default VerifyScreen;

VerifyScreen.showSidebar = true;
VerifyScreen.isLanding = false;
