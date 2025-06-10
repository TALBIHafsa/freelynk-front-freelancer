import NavBar from "../../components/navbar2/Navbar";
import React from "react";

export default function ClientCard() {
  return (
    <div style={{ backgroundColor: "#e6e6e6", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <NavBar/>
      <div style={{ position: "absolute", width: "100%", height: "150px", backgroundColor: "#2c3574", top: "calc(50% - 75px)", zIndex: 0 }}></div>

      <div style={{
        position: "relative",
        backgroundColor: "#f3f4f3",
        borderRadius: "10px",
        width: "350px",
        height:"400px",
        padding: "30px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        marginTop:"55px",
        zIndex: 1
      }}>
        <div style={{ display: "flex", marginBottom: "20px" }}>
          {/* Avatar */}
          <div style={{ marginRight: "20px" }}>
            <img src="/assets/account.png" style={{
              width: "100px",
              height: "100px",
              borderRadius: "50%",
            }} alt="Profile" />
          </div>

          {/* Client Info Section */}
          <div style={{ textAlign: "left", flex: 1 , marginTop:"20px"}}>
            <h2 style={{ margin: "5px 0", color: "#666769", fontSize: "22px" }}>Client Name</h2>
            

          </div>
        </div>

        {/* Details Section */}
        <div style={{ textAlign: "left",  paddingTop: "15px",marginTop:"40px",marginLeft:"40px" }}>
          <DetailItem label="Location" value="Rabat, Morocco" />
          <DetailItem label="Email" value="client@mail.com" />
          <DetailItem label="Languages" value="English" />
        </div>
      </div>
    </div>
  );
}

function DetailItem({ label, value }) {
  return (
    <div style={{ marginBottom: "30px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div>
        <span style={{ color: "#ef9b5e", fontWeight: "bold" }}>{label} : </span>
        <span style={{ color: "#333" }}>{value}</span>
      </div>
    </div>
  );
}