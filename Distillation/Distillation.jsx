import React, { useState, useEffect, useRef } from "react";
import axios from 'axios';
import BeatLoader from "react-spinners/BeatLoader";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BASE_URL } from '../config';
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ReactQuill from 'react-quill'; // Import ReactQuill for rich text editor
import 'react-quill/dist/quill.snow.css'; // Import ReactQuill styles
import CodeEditor2 from './CodeEditor2'; // Adjust path as necessary
import Compiler from './Compiler'; // Adjust path as necessary
import { pageInformationAPI } from "../GetPageInfo";

const DistillationForm = () => {
  const [whatIsItWhereIsItUsed, setWhatIsItWhereIsItUsed] = useState(null);
  const [editorHtml, setEditorHtml] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [inputData, setInputData] = useState('');
  const [loading, setLoading] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const [toggle1, setToggle1] = useState(true);
  const [toggle2, setToggle2] = useState(false);
  const [toggle3, setToggle3] = useState(false);
  const [compilerVisible, setCompilerVisible] = useState(false);
  
  const handleToggle1 = () => setToggle1(!toggle1);
  const handleToggle2 = () => setToggle2(!toggle2);
  const handleToggle3 = () => setToggle3(!toggle3);
  const handleToggleCompiler = () => setCompilerVisible(!compilerVisible);

  useEffect(() => {
    getWhatIsItAndWhereIsItUsed("distillation");
    const adminStatus = localStorage.getItem("isAdmin") === 'true';
    setIsAdmin(adminStatus);
    console.log(adminStatus);
  }, []);
  const getWhatIsItAndWhereIsItUsed = () => {
    var body = JSON.stringify({
      pagePath: "distillation"
    })
    const getResponse = pageInformationAPI(body, "/api/user/pageInformation/getInfo")
    getResponse
      .then(response => { return Promise.all([response.status, response.json()]) })
      .then(res => {
        console.log(res[1].whatIsItAndWhereItIsUsed)
        setWhatIsItWhereIsItUsed(res[1].whatIsItAndWhereItIsUsed)
      });
  };

  const handleSubmitCatalog = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token not found.');
        return;
      }
      if (!inputData) {
        toast.error('Please provide some text to extract Event');
        return;
      }
      const requestData = { text: inputData };
      setLoading(true);

      const response = await axios.post(
        `${BASE_URL}/api/user/distillation`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setResponseData(response.data);
      setLoading(false);
      toast.success('Request successful!');
    } catch (error) {
      setLoading(false);
      toast.error('An error occurred while processing your request.');
      console.error('Error:', error);
    }
  };
  const handleSaveClick = () => {
    saveValue();
    toast.success('Data Modified Successfully!');
  };
  const handleChange = (e) => {
    setEditorHtml(e);
    setWhatIsItWhereIsItUsed(e)
  };
  const saveValue = () => {
    console.log(editorHtml)
    saveWhatIsItAndWhereIsItUsed(editorHtml)
  };
  const saveWhatIsItAndWhereIsItUsed = (value) => {
    var body = JSON.stringify({
      pagePath: "distillation",
      whatIsItAndWhereItIsUsed: value
    })
    
    const getResponse = pageInformationAPI(body, "/api/user/pageInformation/addOrUpdateInfo")
    getResponse
      .then(response => { return Promise.all([response.status, response.json()]) })
      .then(res => {
        console.log(res[1])
      });
  }

  return (
    <div>{loading ? (
      <div className="flex justify-center items-center h-screen">
        <div>
          <BeatLoader loading={loading} className="text-cyan-900 text-3xl" />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
      ) : (
        <div className="font-sans items-center text-left bg-slate-100 min-h-screen">
        <div className="container mx-auto md:w-1/2 lg:w-full xl:w-full pt-10 pl-8 pr-8">
          <div className="text-center rounded-t-xl py-4 w-full bg-[#044661] text-white">
            <h2 className="text-xl">Distillation</h2>
          </div>
          <div className="bg-white p-1 rounded-b-lg shadow-lg shadow-gray-500">
            <div className="mb-8" style={{ backgroundColor: "white" }}></div>
            <Accordion
              expanded={toggle1}
              onChange={handleToggle1}
              slotProps={{ transition: { unmountOnExit: true } }}
              sx={{
                "& .MuiAccordion-region": { height: toggle1 ? "auto" : 0 },
                "& .MuiAccordionDetails-root": {
                  display: toggle1 ? "block" : "none",
                },
              }}
            >
              <AccordionSummary
                expandIcon={<ArrowDropDownIcon className="text-white" />}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
                sx={{ backgroundColor: "#0891b2" }}
              >
                <Typography
                  sx={{
                    color: "white",
                    marginLeft: "2px",
                    textAlign: "center",
                    fontWeight: "600",
                    fontSize: "1rem",
                  }}
                >
                  What Is It and Where Can You Use It
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div className="flex flex-col items-center">
                  <table className="w-full rounded-lg text-center shadow-md overflow-hidden mb-100">
                    <thead className="text-md text-white border-2 border-gray-300 bg-cyan-500 h-10">
                      <tr>
                        <th className="font-semibold border-2 border-gray-300">
                          Introduction and Usage
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-center border-2 h-30 overflow-y-scroll border-gray-300">
                      <tr>
                        <td>
                        {isAdmin && (
                        <button
                          className="bg-[#1976d2] hover:bg-[#1868b7] text-white px-4 py-2 rounded"
                          style={{
                            background: "rgb(4, 70, 97)",
                            width: "61px",
                            margin: "7.5px 20px 0px 0px",
                            float: "right",
                            padding: "3px",
                            color: "white",
                            height: "26px",
                            borderRadius: "5px",
                          }}
                          type="button"
                          onClick={handleSaveClick}
                        >
                          Save
                        </button>
                      )}
                      <div className="react-quill-container">
                      <div className="react-quill-container">
                            <ReactQuill
                              value={whatIsItWhereIsItUsed}
                              theme="snow"
                              onChange={handleChange}
                              modules={isAdmin ? { toolbar: true } : { toolbar: false }} // Enable the toolbar
                            />
                           </div>
                          </div>

                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </AccordionDetails>
            </Accordion>
              <Accordion
                expanded={toggle2}
                onChange={handleToggle2}
                slotProps={{ transition: { unmountOnExit: true } }}
                sx={{
                  "& .MuiAccordion-region": { height: toggle2 ? "auto" : 0 },
                  "& .MuiAccordionDetails-root": {
                    display: toggle2 ? "block" : "none",
                  },
                }}
              >
                <AccordionSummary
                  expandIcon={<ArrowDropDownIcon className="text-white" />}
                  aria-controls="panel2bh-content"
                  id="panel2bh-header"
                  sx={{ backgroundColor: "#0891b2" }}
                >
                  <Typography
                    sx={{
                      color: "white",
                      marginLeft: "2px",
                      textAlign: "center",
                      fontWeight: "600",
                      fontSize: "1rem",
                    }}
                  >
                    Test It
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <div>
                    <h1 className="text-lg font-bold mb-2">Text Distillation</h1>
                    <textarea
                      value={inputData}
                      onChange={(e) => setInputData(e.target.value)}
                      placeholder="Enter text here"
                      rows="5"
                      cols="50"
                      className="border rounded-md p-2 w-full mb-2"
                    />
                    <br />
                    <button
                      onClick={handleSubmitCatalog}
                      disabled={loading}
                      className={`bg-blue-500 text-white px-4 py-2 rounded-md ${loading ? 'bg-blue-300' : ''}`}
                    >
                      {loading ? 'Processing...' : 'Submit'}
                    </button>
                    {responseData && (
                      <div className="mt-4 p-4 border rounded-md bg-gray-100">
                        <h2 className="text-xl font-semibold mb-2">Response Data</h2>
                        <div>
                          <p><strong>Original Text:</strong> {responseData.original_text}</p>
                          <p><strong>Student Model:</strong></p>
                          <p>Cleaned Text: {responseData.student_model.cleaned_text}</p>
                          <p>Inference Time: {responseData.student_model.inference_time.toFixed(4)} seconds</p>
                          <p>Model Size: {responseData.student_model.model_size_MB.toFixed(2)} MB</p>
                          <p><strong>Teacher Model:</strong></p>
                          <p>Cleaned Text: {responseData.teacher_model.cleaned_text}</p>
                          <p>Inference Time: {responseData.teacher_model.inference_time.toFixed(4)} seconds</p>
                          <p>Model Size: {responseData.teacher_model.model_size_MB.toFixed(2)} MB</p>
                        </div>
                      </div>
                    )}
                    <ToastContainer />
                  </div>
                </AccordionDetails>
              </Accordion>

              <Accordion
                expanded={toggle3}
                onChange={handleToggle3}
                slotProps={{ transition: { unmountOnExit: true } }}
                sx={{
                  "& .MuiAccordion-region": { height: toggle3 ? "auto" : 0 },
                  "& .MuiAccordionDetails-root": {
                    display: toggle3 ? "block" : "none",
                  },
                }}
              >
                <AccordionSummary
                  expandIcon={<ArrowDropDownIcon className="text-white" />}
                  aria-controls="panel3bh-content"
                  id="panel3bh-header"
                  sx={{ backgroundColor: "#0891b2" }}
                >
                  <Typography
                    sx={{
                      color: "white",
                      marginLeft: "2px",
                      textAlign: "center",
                      fontWeight: "600",
                      fontSize: "1rem",
                    }}
                  >
                    Generate Code with AI Model
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <CodeEditor2 />
                </AccordionDetails>
              </Accordion>

              <Accordion
                expanded={compilerVisible}
                onChange={handleToggleCompiler}
                slotProps={{ transition: { unmountOnExit: true } }}
                sx={{
                  "& .MuiAccordion-region": { height: compilerVisible ? "auto" : 0 },
                  "& .MuiAccordionDetails-root": {
                    display: compilerVisible ? "block" : "none",
                  },
                }}
              >
                <AccordionSummary
                  expandIcon={<ArrowDropDownIcon className="text-white" />}
                  aria-controls="panel4bh-content"
                  id="panel4bh-header"
                  sx={{ backgroundColor: "#0891b2" }}
                >
                  <Typography
                    sx={{
                      color: "white",
                      marginLeft: "2px",
                      textAlign: "center",
                      fontWeight: "600",
                      fontSize: "1rem",
                    }}
                  >
                    Try It
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {compilerVisible && <Compiler />}
                </AccordionDetails>
              </Accordion>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DistillationForm;
