import React, { useState, useEffect } from "react";
import SignaturePad from "react-signature-canvas";
import axios from "axios";
import './App.css';

const api = axios.create({
  baseURL: "https://warmpro-api.onrender.com"
});

function App() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [sigCustomer, setSigCustomer] = useState(null);
  const [sigInstaller, setSigInstaller] = useState(null);

  useEffect(() => {
    async function fetchJobs() {
      const res = await api.get("/jobs");
      setJobs(res.data);
    }
    fetchJobs();
  }, []);

  const submitSignatures = async () => {
    if (!sigCustomer || !sigInstaller) return alert("Signature pads not ready");
    const customerSignature = sigCustomer.getTrimmedCanvas().toDataURL("image/png");
    const installerSignature = sigInstaller.getTrimmedCanvas().toDataURL("image/png");
    await api.post(`/jobs/${selectedJob.id}/signatures`, { customerSignature, installerSignature });
    alert("Signatures submitted!");
  };

  return (
    <div className="App">
      <h1>WarmPro Installer App</h1>
      {!selectedJob ? (
        <>
          <h2>Select a Job</h2>
          {jobs.map(job => (
            <div key={job.id} className="job" onClick={() => setSelectedJob(job)}>
              <h3>{job.customerName}</h3>
              <p>{job.address}</p>
            </div>
          ))}
        </>
      ) : (
        <>
          <h2>{selectedJob.customerName}</h2>
          <p>{selectedJob.address}</p>
          <h3>Customer Signature</h3>
          <SignaturePad ref={setSigCustomer} canvasProps={{ className: "sigCanvas" }} />
          <h3>Installer Signature</h3>
          <SignaturePad ref={setSigInstaller} canvasProps={{ className: "sigCanvas" }} />
          <button onClick={submitSignatures}>Submit Signatures</button>
          <button onClick={() => setSelectedJob(null)}>Back</button>
        </>
      )}
    </div>
  );
}

export default App;
