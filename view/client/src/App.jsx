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
      const response = await fetch("https://ai-ats-9i1p.onrender.com/upload", {
        method: "POST",
        body: formData
      });

      const result = await response.json();

      if (response.ok) {
        setModalIsOpen(true);
        setServerResponce(result);

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
              <span> Please wait... </span>
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
          onClick={() => setModalIsOpen(false)}
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
        onRequestClose={() => setModalIsOpen(false)}
        style={{
          content: {
            width: "58%",
            height: "61%",
            margin: "auto",
            padding: "3px",
            textAlign: "center",
            borderRadius: "10px",
            boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
            border: "3px solid green"
          }
        }}
      >
        <h2>{serverResponce.title}</h2>
        <p style={{ fontWeight: "bold", color: "blue" }}>{serverResponce.score}</p>
        <textarea
          placeholder={serverResponce.improvementSuggestions}
          style={{
            width: "90%",
            height: "48%",
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            resize: "none",
            border: "1px solid black",
            color: "black",
            fontWeight: "bold",
            fontFamily: "Arial",
            background: "white",
          }}
          disabled
        />
        <br />
        <button
          onClick={() => setModalIsOpen(false)}
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
