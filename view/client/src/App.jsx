import React, { useState } from "react";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      const allowedTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];

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

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("jobDescription", "Software Engineer Job Description");

    try {
      const response = await fetch("/upload", { method: "POST", body: formData });
      const result = await response.json();

      if (response.ok) {
        setMessage(`Upload successful! ATS Score: ${result.score}`);
      } else {
        setMessage(`Upload failed: ${result.error}`);
      }
    } catch (error) {
      setMessage("Error uploading file. Please try again.");
    }
  };

  return (
    <div className="App-header APP">
      <h1 style={{ fontSize: "2.5rem", color: "black" }}>Upload Your Resume</h1>

      <form onSubmit={handleSubmit} className="header">
        <input type="file" accept=".pdf, .docx" onChange={handleFileChange} />

        {/* Show file name after selection */}
        {file && (
          <p style={{ color: "green", fontWeight: "bold", marginTop: "10px" }}>
            {file.name}
          </p>
        )}

        {/* Upload button (disabled if no file selected) */}
        <button type="submit" style={{ marginTop: "10px", padding: "10px", background: "#007bff", color: "#fff", border: "none", cursor: "pointer", borderRadius: "5px" }}>
          Upload
        </button>
        {message && <p style={{ color: "red", marginTop: "0px", marginBottom: "31px", fontWeight: "bold" ,width:"100%"}}>{message}</p>}
      </form>

    </div>
  );
}

export default App;
