import React, { useState } from "react";
// import { FormGroup, Label, Input, FormText, Button } from "@coreui/coreui";
// import { Button } from "@coreui/coreui";

import "./addpackage.css";

// const addPackage = () => {
//   return (
//     <p>
//         Culpa veniam consectetur aute duis labore occaecat excepteur aliquip amet veniam consectetur Lorem. Voluptate anim dolor amet sunt fugiat tempor. Ut amet tempor elit voluptate Lorem do. Laborum non nostrud minim veniam adipisicing anim dolore magna cupidatat cillum mollit. Esse culpa aute magna ex laborum excepteur nulla eiusmod. Sunt reprehenderit consequat et commodo eiusmod laborum id sit elit consectetur id. Nostrud nulla occaecat nostrud mollit laborum.
//     </p>
//   )
// }
function addPackage() {
  const [arrivalDate, setArrivalDate] = useState("");
  const [studentName, setStudentName] = useState("");
  const [parcelType, setParcelType] = useState("");
  const [postDetails, setPostDetails] = useState("");

  const handleSearch = () => {
    // Handle search logic here, using the current values of the form fields
    console.log("Searching for parcel with the following details:");
    console.log(`Arrival date: ${arrivalDate}`);
    console.log(`Student name: ${studentName}`);
    console.log(`Parcel type: ${parcelType}`);
    console.log(`Post details: ${postDetails}`);
  };

  return (
    <div className="parcel-search-container">
      <h1>Add Package Details</h1>
      <div className="form-field">
        <label htmlFor="arrivalDate">Date of Arrival:</label>
        <input
          id="arrivalDate"
          type="date"
          value={arrivalDate}
          onChange={(event) => setArrivalDate(event.target.value)}
        />
      </div>
      <div className="form-field">
        <label htmlFor="studentName">Student Name:</label>
        <input
          id="studentName"
          type="text"
          value={studentName}
          onChange={(event) => setStudentName(event.target.value)}
        />
      </div>
      <div className="form-field">
        <label htmlFor="parcelType">Type of Parcel:</label>
        <input
          id="parcelType"
          type="text"
          value={parcelType}
          onChange={(event) => setParcelType(event.target.value)}
        />
      </div>
      <div className="form-field">
        <label htmlFor="postDetails">Post Details:</label>
        <textarea
          id="postDetails"
          value={postDetails}
          onChange={(event) => setPostDetails(event.target.value)}
        />
      </div>
      <button className="search-button" onClick={handleSearch}>
        Add Package
      </button>
    </div>
  );

}

export default addPackage