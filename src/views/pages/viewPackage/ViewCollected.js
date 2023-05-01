import React from "react";
import "./viewCollected.css"; // import your custom styles

function viewCollected({ }) {
  const packages = [
    { id: 1, pickupDate: '2022-05-01', parcelType: 'Box', postDetails: 'Sent by John' },
    { id: 2, pickupDate: '2022-05-02', parcelType: 'Envelope', postDetails: 'Sent by Mary' },
    { id: 3, pickupDate: '2022-05-03', parcelType: 'Package', postDetails: 'Sent by Bob' },
  ];

  return (
    <div className="package-table">
      <h1>Collected Package Table</h1>
      <table>
        <thead>
          <tr>
            <th>S.No</th>
            <th>Date of Pickup</th>
            <th>Type of Parcel</th>
            <th>Post Details</th>
          </tr>
        </thead>
        <tbody>
          {packages.map((pkg, index) => (
            <tr key={pkg.id}>
              <td>{index + 1}</td>
              <td>{pkg.pickupDate}</td>
              <td>{pkg.parcelType}</td>
              <td>{pkg.postDetails}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default viewCollected;
