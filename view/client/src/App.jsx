import React, { useState } from "react";
import Modal from "react-modal";
import "./App.css";

Modal.setAppElement("#root");

function App() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [jobModalIsOpen, setJobModalIsOpen] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [serverResponce, setServerResponce] = useState({});

  
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      const allowedTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ];

      if (!allowedTypes.includes(selectedFile.type)) {
        setMessage("Only PDF and DOCX files are allowed.");
        setFile(null);
        return;
      }

      if (selectedFile.size > 5 * 1024 * 1024) {
        setMessage("File size must be less than 5MB.");
        setFile(null);
        return;
      }

      setMessage("");
      setFile(selectedFile);
    }
  };
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      setMessage("Please select a valid file before uploading.");
      return;
    }

    if (!jobDescription.trim()) {
      setMessage("Please enter a job description.");
      return;
    }

    setIsUploading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("jobDescription", jobDescription);

    try {
      const response = await fetch("https://ai-ats-9i1p.onrender.com/getAtsScore", {
        method: "POST",
        body: formData
      });
      const result = await response.json();
      if (response.ok) {
        setModalIsOpen(true);
        setServerResponce(result);
        let res = await fetchSuggestion(formData, result);
        setServerResponce(res);
      } else {
        setMessage(`Upload failed: ${result.error}`);
      }
    } catch (error) {
      setMessage("Error uploading file. Please try again.");
    }

    setIsUploading(false);
  };
  const handleError = () => {
    setMessage("");
  }
  const fetchSuggestion = async (formData, result) => {
    const score = Number(result.score.split("/")[0]);
    let res = await fetch(`https://ai-ats-9i1p.onrender.com/suggestion/${score}`, {
      method: "POST",
      body: formData
    });
    let data = await res.json();
    return data;
  }
  return (
    <div className="App-header APP">
      <h1 style={{ fontSize: "2.5rem", color: "black", paddingBottom: "0px" }}>AI-ATS</h1>
      <form onSubmit={handleSubmit} className="header">
        <p style={{ fontSize: "1.5rem", color: "black" }}>Your Resume plzz...</p>
        <input type="file" accept=".pdf, .docx" onChange={handleFileChange} style={file ? {
          borderColor: "green", color: "black",
          fontWeight: "bold"
        } : {
          color: "black",
          fontWeight: "bold"
        }} />

        {file && (
          <p style={{ color: "green", fontWeight: "bold", marginTop: "10px" }}>
            {file.name}
          </p>
        )}

        {/* Job Description Section */}
        <button
          type="button"
          onClick={() => setJobModalIsOpen(true)}
          className="job_des_button"
          style={jobDescription ? { background: "green", disabled: "true" } : {}}
        //disabled={!!jobDescription}
        >
          {!jobDescription ? "Job Description" : "Job Described"}
        </button>

        {/* Upload Button */}
        <button
          type="submit"
          style={isUploading ? { background: "green" } : { background: "#007bff" }}
          disabled={isUploading}
          className="upload"
        >
          Upload
        </button>
      </form>

      {/* Centered Error/Success Message */}
      {message && (
        <div className="message">
          <span onClick={handleError} style={{ cursor: "pointer" }} >❌ </span>{message}
        </div>
      )}

      {/* Loader Modal */}
      {isUploading && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: "1000",
          }}
        >
          <div
            style={{
              background: "white",
              padding: "25px",
              borderRadius: "10px",
              textAlign: "center",
              fontSize: "25px",
              fontWeight: "bold",
              color: "black",
            }}
          >
            <div>
              <span className="loading-icon">⏳</span>
              <span> {serverResponce.score ? "Suggestions are fetching..." : "Please wait..."} </span>
              <span className="blinking-emoji">😊</span>
            </div>

          </div>
        </div>
      )}

      {/* Upload Response Modal */}
      <Modal
        style={{
          content: {
            width: "90%",
            height: "90%",
            margin: "auto",
            padding: "20px",
            textAlign: "center",
            borderRadius: "10px",
            boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)"
          }
        }}
      >
        <h2>{serverResponce.title}</h2>
        <p>{serverResponce.score}</p>
        <button
          onClick={() => {
            setModalIsOpen(false);
          }}
          style={{
            marginTop: "15px",
            padding: "8px 12px",
            background: "#007bff",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            borderRadius: "5px"
          }}
        >
          Close
        </button>
      </Modal>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => {
          setModalIsOpen(false)
          setServerResponce({});
        }}
        style={{
          content: {
            width: "60%",
            height: "65%",
            margin: "auto",
            padding: "20px",
            textAlign: "center",
            borderRadius: "10px",
            boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.2)",
            border: "3px solid #28a745",
            background: "#f8f9fa",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "relative"
          }
        }}
      >
        {/* Fixed Title & Score Section */}
        <div style={{
          width: "100%",
          textAlign: "center",
          position: "sticky",
          top: "0",
          background: "#f8f9fa",
          paddingBottom: "10px",
          borderBottom: "3px solid #28a745" // Green border for a clean look
        }}>
          <h2 style={{
            fontSize: "22px",
            fontWeight: "bold",
            color: "#333",
            marginBottom: "5px"
          }}>
            {serverResponce.title}
          </h2>

          <p
            style={{
              fontSize: "20px",
              fontWeight: "bold",
              color: serverResponce.score > 70 ? "green" : "red",
              background: "#e9ecef",
              padding: "4px 15px",
              borderRadius: "8px",
              display: "inline-block",
              margin: "0px",
              marginBottom: "5px",
            }}
          >
            Score: {serverResponce.score}
          </p>
        </div>


        {/* Suggestions Section */}
        <div style={{ width: "90%", padding: "15px", fontFamily: "Arial, sans-serif", textAlign: "left", overflowY: "auto", maxHeight: "400px" }}>

          {/* Missing Keywords */}
          <h3 style={{ color: "#007bff", marginBottom: "5px" }}>🔹 Missing Keywords</h3>
          {serverResponce.improvementSuggestions?.missing_keywords?.length > 0 ? (
            <ul style={{ paddingLeft: "20px", marginBottom: "10px" }}>
              {serverResponce.improvementSuggestions?.missing_keywords?.map((keyword, index) => (
                <li key={index} style={{ marginBottom: "5px" }}>✅ {keyword}</li>
              ))}
            </ul>
          ) : (
            <p style={{ color: "green", fontStyle: "italic" }}>✅ No missing keywords</p>
          )}

          {/* Experience Gaps */}
          <h3 style={{ color: "#007bff", marginBottom: "5px" }}>🔹 Experience Gaps</h3>
          {serverResponce.improvementSuggestions?.experience_gaps?.length > 0 ? (
            <ul style={{ paddingLeft: "20px", marginBottom: "10px" }}>
              {serverResponce.improvementSuggestions?.experience_gaps?.map((gap, index) => (
                <li key={index} style={{ marginBottom: "10px" }}>
                  <strong style={{ color: "#dc3545" }}>⚠ {gap.suggestion}</strong>
                  <br />
                  <small style={{ color: "#6c757d" }}>➤ {gap.reason}</small>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ color: "green", fontStyle: "italic" }}>✅ No experience gaps</p>
          )}

          {/* Technical Skills Suggestions */}
          <h3 style={{ color: "#007bff", marginBottom: "5px" }}>🔹 Technical Skills Suggestions</h3>
          {serverResponce.improvementSuggestions?.technical_skills_suggestions?.missing_skills?.length > 0 ? (
            <ul style={{ paddingLeft: "20px", marginBottom: "10px" }}>
              {serverResponce.improvementSuggestions?.technical_skills_suggestions?.missing_skills?.map((skill, index) => (
                <li key={index} style={{ marginBottom: "5px" }}>📌 {skill}</li>
              ))}
            </ul>
          ) : (
            <p style={{ color: "green", fontStyle: "italic" }}>✅ All required technical skills are covered</p>
          )}
        </div>

        {/* Close Button */}
        <button
          onClick={() => {
            setModalIsOpen(false);
            setServerResponce({});
          }}
          style={{
            marginTop: "15px",
            padding: "10px 20px",
            background: "#28a745",
            color: "#fff",
            fontSize: "16px",
            border: "none",
            cursor: "pointer",
            borderRadius: "5px",
            transition: "0.3s",
          }}
          onMouseOver={(e) => (e.target.style.background = "#218838")}
          onMouseOut={(e) => (e.target.style.background = "#28a745")}
        >
          Close
        </button>
      </Modal>

      {/* Job Description Modal */}
      <Modal
        isOpen={jobModalIsOpen}
        onRequestClose={() => setJobModalIsOpen(false)}
        style={{
          content: {
            width: "58%",
            height: "61%",
            margin: "auto",
            padding: "3px",
            textAlign: "center",
            borderRadius: "10px",
            boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)"
          }
        }}
      >
        <h2>Enter Job Description</h2>
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Enter job description here..."
          style={{
            width: "90%",
            height: "60%",
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            resize: "none",
          }}
        />
        <br />
        <button
          onClick={() => setJobModalIsOpen(false)}
          style={{
            marginTop: "10px",
            padding: "10px",
            background: "#28a745",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            borderRadius: "5px"
          }}
        >
          Save
        </button>
      </Modal>
    </div>
  );
}

export default App;
