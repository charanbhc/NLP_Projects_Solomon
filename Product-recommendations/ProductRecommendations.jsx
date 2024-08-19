import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { toast } from 'react-hot-toast';
import BeatLoader from "react-spinners/BeatLoader";
import { BASE_URL } from "../config";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Productrecommendations } from "../../src/Explanation2";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import CodeEditor2 from "../components/CodeEditor2";
import Compiler from "../components/Compiler";
import { pageInformationAPI } from "../GetPageInfo";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// Function to parse CSV string into an array of objects-
const parseCSV = (csv) => {
  const lines = csv.split("\n");
  const headers = lines[0].split(",");
  return lines.slice(1).map(line => {
    const values = line.split(",");
    return headers.reduce((object, header, index) => {
      object[header] = values[index];
      return object;
    }, {});
  });
};

const ProductRecommendations = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [whatIsItWhereIsItUsed, setWhatIsItWhereIsItUsed] = useState(null)
  const [editorHtml, setEditorHtml] = useState('');
  const [loading, setLoading] = useState(false);
  const [inputData, setInputData] = useState("");
  const [processedText, setProcessedText] = useState([]);
  const [compilerVisible, setCompilerVisible] = useState(false);
  const [toggle1, setToggle1] = useState(false);
  const [toggle2, setToggle2] = useState(false);
  const [toggle3, setToggle3] = useState(false);

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token not found.");
        return;
      }
      if (!inputData) {
        toast.error("Please provide some text to extract Event");
        return;
      }
      const requestData = {
        name: inputData, // Make sure to include the required parameter
      };
      setLoading(true);
      const response = await axios.post(
        BASE_URL + "/api/user/product-recommendations",
        requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (typeof response.data === "string") {
        const parsedData = parseCSV(response.data);
        setProcessedText(parsedData);
      } else {
        console.error("Response data is not in the expected format:", response.data);
      }
    } catch (error) {
      console.error("An error occurred:", error);
      if (error.response) {
        console.error("Server responded with:", error.response.data);
      }
      toast.error("An error occurred while processing the request.");
    } finally {
      setLoading(false);
    }
  };

  const renderTable = () => {
    if (processedText.length === 0) {
      return null; // Return null if processedText is empty
    }
    return (
      <table className="w-full border-2 border-[#044661] rounded-t-lg">
        <thead className="bg-cyan-600 text-white">
          <tr>
            <th className="font-semibold p-2">Name</th>
            <th className="font-semibold p-2">Brand</th>
            <th className="font-semibold p-2">Categories</th>
            <th className="font-semibold p-2">Price ($)</th>
            <th className="font-semibold p-2">Date</th>
            <th className="font-semibold p-2">Manufacturer</th>
          </tr>
        </thead>
        <tbody>
          {processedText.map((item, index) => (
            <tr key={index} className="border-t">
              <td className="p-2">{item.name}</td>
              <td className="p-2">{item.brand}</td>
              <td className="p-2">{item.categories}</td>
              <td className="p-2">{item.price}</td>
              <td className="p-2">{item.dateAdded}</td>
              <td className="p-2">{item.manufacturer}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };
  useEffect(() => {
    getWhatIsItAndWhereIsItUsed()
    const adminStatus = localStorage.getItem("isAdmin") === 'true';
    setIsAdmin(adminStatus);
    console.log(adminStatus);
  }, []);

  const quillRef = useRef(null);

  const getWhatIsItAndWhereIsItUsed = () => {
    var body = JSON.stringify({
      pagePath: "product-recommendations"
    })
    const getResponse = pageInformationAPI(body, "/api/user/pageInformation/getInfo")
    getResponse
      .then(response => { return Promise.all([response.status, response.json()]) })
      .then(res => {
        console.log(res[1].whatIsItAndWhereItIsUsed)
        setWhatIsItWhereIsItUsed(res[1].whatIsItAndWhereItIsUsed)
        setEditorHtml(res[1].whatIsItAndWhereItIsUsed)
      });
  };
  const saveWhatIsItAndWhereIsItUsed = (value) => {
    var body = JSON.stringify({
      pagePath: "product-recommendations",
      whatIsItAndWhereItIsUsed: value
    })
    
    const getResponse = pageInformationAPI(body, "/api/user/pageInformation/addOrUpdateInfo")
    getResponse
      .then(response => { return Promise.all([response.status, response.json()]) })
      .then(res => {
        console.log(res[1])
      });
  }
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
  const handleChangeValue = (value) => {
    setWhatIsItWhereIsItUsed(value);
  };
  const handleChange1 = (e) => {
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
            <h2 className="text-xl">Electronic Product Recommendations</h2>
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
                            <ReactQuill
                                  value={whatIsItWhereIsItUsed}
                                  theme="snow"
                                  onChange={handleChange1}
                                  modules={isAdmin ? { toolbar: true } : { toolbar: false }} // Enable the toolbar
                            />
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
                <div className="bg-white p-10 rounded-b-lg shadow-lg shadow-gray-500">
                  <table className="w-full border-[#044661] border-2 mb-4 mt-4">
                    <div className="bg-white p-10 shadow-lg shadow-gray-500">
                      <table className="w-full border-[#044661] border-2 rounded-t-lg">
                        <thead className="bg-cyan-600 text-white">
                          <tr>
                            <th className="font-semibold p-2">
                              Enter the electronic product name to get the
                              recommendations
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-t">
                            <td className="p-2">
                              <textarea
                                className="w-full h-5 border-transparent focus:outline-none focus:ring-0 focus:border-transparent"
                                placeholder="Enter the product name to get the recommendations...."
                                value={inputData}
                                onChange={(e) => setInputData(e.target.value)}
                                style={{ fontSize: '20px' }}
                              ></textarea>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <div className="flex justify-center mb-10 mt-10">
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handleSubmit}
                          
                        >
                          Get Recommendation
                        </Button>
                      </div>
                      {loading && <div>Loading...</div>}
                      {renderTable()}
                    </div>
                  </table>
                </div>
              </AccordionDetails>
            </Accordion>

            <Accordion
              expanded={toggle3}
              onChange={handleToggle3}
              slotProps={{ transition: { unmountOnExit: true } }}
              sx={{
                "& .MuiAccordion-region": {
                  height: toggle3 ? "auto" : 0,
                },
                "& .MuiAccordionDetails-root": {
                  display: toggle3 ? "block" : "none",
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
                "& .MuiAccordion-region": {
                  height: compilerVisible ? "auto" : 0,
                },
                "& .MuiAccordionDetails-root": {
                  display: compilerVisible ? "block" : "none",
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

export default ProductRecommendations;
