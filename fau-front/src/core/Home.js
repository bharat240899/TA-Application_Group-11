import React from "react";
import Layout from "./Layout";

import fauCampusImage from "../assets/faubanner.jpg" // Ad/just the path as needed

const Home = () => {
  

  // Conditional rendering of Layout and Footer based on Postings component
  const renderContent = () => {
    // If no jobs are available, render only the layout with the FAU image
    return (
      <Layout
        title="CampusHires"
        description="Welcome to Florida Atlantic University TA Management Portal"
        className="container-fluid"
      >
        {/* Display the FAU image */}
        <div className="text-center mt-4">
          <img
            src={fauCampusImage}
            alt="Florida Atlantic University Campus"
            className="img-fluid"
            style={{ maxWidth: "100%", height: "auto", borderRadius: "8px" }}
          />
        </div>
      </Layout>
    );
  };

  return <div>{renderContent()}</div>;
};

export default Home;
