import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import BeatLoader from "react-spinners/BeatLoader";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import CodeEditor2 from "../components/CodeEditor2";
import Compiler from "../components/Compiler";
import { ADDNORM } from "../../src/Explanation2";
import { pageInformationAPI } from "../GetPageInfo";
import ReactQuill from 'react-quill';
import { toast } from 'react-hot-toast';
import { BASE_URL } from '../config';

const AddNorm = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [numbers, setNumbers] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toggle1, setToggle1] = useState(false);
  const [toggle2, setToggle2] = useState(false);
  const [toggle3, setToggle3] = useState(false);
  const [compilerVisible, setCompilerVisible] = useState(true);
  const [whatIsItWhereIsItUsed, setWhatIsItWhereIsItUsed] = useState(null);
  const [editorHtml, setEditorHtml] = useState('');

  useEffect(() => {
    getWhatIsItAndWhereIsItUsed("catalog-review-analysis");
    const adminStatus = localStorage.getItem("isAdmin") === 'true';
    setIsAdmin(adminStatus);
    console.log(adminStatus);
  }, []);
  
  const handleInputChange = (e) => {
    setNumbers(e.target.value);
  };

  const getWhatIsItAndWhereIsItUsed = () => {
    var body = JSON.stringify({
      pagePath: "add-norm"
    })
    const getResponse = pageInformationAPI(body, "/api/user/pageInformation/getInfo")
    getResponse
      .then(response => { return Promise.all([response.status, response.json()]) })
      .then(res => {
        console.log(res[1].whatIsItAndWhereItIsUsed)
        setWhatIsItWhereIsItUsed(res[1].whatIsItAndWhereItIsUsed)
      });
  };
  const handleChange = (e) => {
    setEditorHtml(e);
    setWhatIsItWhereIsItUsed(e)
  };
  const saveValue = () => {
    console.log(editorHtml)
    saveWhatIsItAndWhereIsItUsed(editorHtml)
  };
  const handleSaveClick = () => {
    saveValue();
    toast.success('Data Modified Successfully!');
  };

  const saveWhatIsItAndWhereIsItUsed = (value) => {
    var body = JSON.stringify({
      pagePath: "add-norm",
      whatIsItAndWhereItIsUsed: value
    })
    
    const getResponse = pageInformationAPI(body, "/api/user/pageInformation/addOrUpdateInfo")
    getResponse
      .then(response => { return Promise.all([response.status, response.json()]) })
      .then(res => {
        console.log(res[1])
      });
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    const numberArray = numbers.split(',').map(num => parseFloat(num.trim()));

    if (numberArray.some(isNaN)) {
      setError('Please enter a comma-separated list of valid numbers.');
      return;
    }
   
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication token not found. Please log in.");
        return;
      }

      setLoading(true);
      const res = await axios.post(
        `${BASE_URL}/api/user/add-norm`, // Updated to use BASE_URL
        { numbers: numberArray },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setResponse(res.data);
      setError(null); // Clear any previous errors
    } catch (err) {
      if (err.response) {
        // Server responded with a status other than 2xx
        setError(err.response.data);
      } else if (err.request) {
        // Request was made but no response was received
        setError("No response received from the server.");
      } else {
        // Something else caused the error
        setError("Error occurred while connecting to the server.");
      }
      setResponse(null); // Clear any previous responses
    } finally {
      setLoading(false);
    }
  };

  const handleToggleCompiler = () => {
    setCompilerVisible(!compilerVisible);
  };

  const handleToggle1 = () => {
    setToggle1(!toggle1);
  };

  const handleToggle2 = () => {
    setToggle2(!toggle2);
  };

  const handleToggle3 = () => {
    setToggle3(!toggle3);
  };

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
            <h2 className="text-xl">ADD NORM</h2>
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

            <Accordion expanded={toggle2} onChange={handleToggle2}>
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
                  Test It
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div className="flex flex-col items-center">
                  <h2 className="mb-2">Numbers (comma-separated):</h2>
                  <form onSubmit={handleSubmit} className="flex flex-col items-center">
                    <div className="mb-2">
                      <label htmlFor="numbers" className="sr-only">Numbers:</label>
                      <input
                        type="text"
                        id="numbers"
                        value={numbers}
                        onChange={handleInputChange}
                        placeholder="e.g. 1, 2, 3, 4"
                        className="border border-gray-300 p-2 rounded-md"
                        style={{ width: "80%" }}
                      />
                    </div>
                    <button type="submit" className="bg-[#0891b2] text-white px-4 py-2 rounded-md">
                      Submit
                    </button>
                  </form>
                  {response && (
                    <div>
                      <h3>Response:</h3>
                      <table className="border-collapse border border-gray-300 w-full mt-4">
                        <thead>
                          <tr className="bg-cyan-500 text-white">
                            <th className="border border-gray-300 px-4 py-2">Input Tensor</th>
                            <th className="border border-gray-300 px-4 py-2">Learned Tensor</th>
                            <th className="border border-gray-300 px-4 py-2">Added Tensor</th>
                            <th className="border border-gray-300 px-4 py-2">Normalized Output</th>
                          </tr>
                        </thead>
                        <tbody>
                          {response.input_tensor.map((val, idx) => (
                            <tr key={idx} className="border border-gray-300">
                              <td className="border border-gray-300 px-4 py-2">{response.input_tensor[idx]}</td>
                              <td className="border border-gray-300 px-4 py-2">{response.learned_tensor[idx]}</td>
                              <td className="border border-gray-300 px-4 py-2">{response.added_tensor[idx]}</td>
                              <td className="border border-gray-300 px-4 py-2">{response.normalized_output[idx]}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <div className="mt-4">
                        <h4>Statistics:</h4>
                        <p>Mean: {response.mean}</p>
                        <p>Standard Deviation: {response.std_dev}</p>
                      </div>
                      <div className="mt-4">
                        <h4>Normalization Steps:</h4>
                        <ol className="list-decimal list-inside">
                          {Object.entries(response.normalization_steps).map(([step, description], index) => (
                            <li key={index} className="mt-2">{description}</li>
                          ))}
                        </ol>
                      </div>
                    </div>
                  )}
                  {error && (
                    <div>
                      <h3>Error:</h3>
                      <pre>{JSON.stringify(error, null, 2)}</pre>
                    </div>
                  )}
                </div>
              </AccordionDetails>
            </Accordion>

            <Accordion expanded={toggle3} onChange={handleToggle3}>
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
                  Generate Code with AI Model
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <CodeEditor2 />
              </AccordionDetails>
            </Accordion>

            <Accordion expanded={compilerVisible} onChange={handleToggleCompiler}>
              <AccordionSummary
                expandIcon={<ArrowDropDownIcon className="text-white" />}
                aria-controls="panel1bh-header"
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

export default AddNorm;