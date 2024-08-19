import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { pageInformationAPI } from "../GetPageInfo";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { toast } from 'react-hot-toast';
import BeatLoader from "react-spinners/BeatLoader";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import CodeEditor2 from "../components/CodeEditor2";
import Compiler from "../components/Compiler";
import { Recurrentneuralnetworks } from "../../src/Explanation2";
import { BASE_URL } from "../config";

const RecurrentNeuralNetworks = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [whatIsItWhereIsItUsed, setWhatIsItWhereIsItUsed] = useState(null)
    const [editorHtml, setEditorHtml] = useState('');
    const [loading, setLoading] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [ticker, setTicker] = useState('');
    const [imageSrc, setImageSrc] = useState('');
    const [error, setError] = useState('');
    const [compilerVisible, setCompilerVisible] = useState(false);
    const [toggle1, setToggle1] = useState(false);
    const [toggle2, setToggle2] = useState(false);
    const [toggle3, setToggle3] = useState(false);
    useEffect(() => {
        getWhatIsItAndWhereIsItUsed()
        const adminStatus = localStorage.getItem("isAdmin") === 'true';
        setIsAdmin(adminStatus);
        console.log(adminStatus);
      }, []);
    
      const quillRef = useRef(null);
    
      const getWhatIsItAndWhereIsItUsed = () => {
        var body = JSON.stringify({
          pagePath: "recurrent-neural-networks"
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
          pagePath: "recurrent-neural-networks",
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

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("Token not found.");
                return;
            }

            const end_date = new Date().toISOString().split('T')[0]; // Set end date to current date

            const response = await axios.post(`${BASE_URL}/api/user/recurrent-neural-networks`, {
                start_date: startDate,
                ticker: ticker
            }, {
                responseType: 'arraybuffer',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response && response.data) {
                const base64Image = arrayBufferToBase64(response.data);
                setImageSrc(`data:image/png;base64,${base64Image}`);
            } else {
                setError('Image data not found in response');
            }
        } catch (err) {
            setError(err.response?.data?.error || err.message);
        }
    };

    // Function to convert ArrayBuffer to base64
    const arrayBufferToBase64 = (buffer) => {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    };
    const handleChangeValue = (value) => {
        setWhatIsItWhereIsItUsed(value);
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
        <div className="font-sans items-center text-left bg-slate-100 min-h-screen">
            {loading ? (
                <div className="flex justify-center items-center h-screen">
                    <div>
                        <BeatLoader loading={loading} className="text-cyan-900 text-3xl" />
                        <p className="mt-4 text-gray-600">Loading...</p>
                    </div>
                </div>
            ) : (
                <div className="container mx-auto md:w-1/2 lg:w-full xl:w-full pt-10 pl-8 pr-8">
                    <div className="text-center rounded-t-xl py-4 w-full bg-[#044661] text-white">
                        <h2 className="text-xl">Recurrent Neural Networks</h2>
                    </div>
                    <div className="bg-white p-1 rounded-b-lg">
                        <Accordion
                            expanded={toggle1}
                            onChange={handleToggle1}
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
                                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", backgroundColor: "#fff" }}>
                                    <div style={{ width: "90%", maxWidth: "800px", padding: "20px", backgroundColor: "#fff", borderRadius: "10px" }}>
                                        <h2 style={{ color: "#333", textAlign: "center", marginBottom: "20px" }}>Recurrent Neural Networks - Stock Prediction</h2>
                                        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column" }}>
                                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
                                                <div style={{ flex: 2, marginRight: "10px" }}>
                                                    <label htmlFor="startDate" style={{ marginBottom: "10px", display: "block", fontWeight: "bold" }}>Start Date:</label>
                                                    <input
                                                        type="date"
                                                        id="startDate"
                                                        value={startDate}
                                                        min="1900-01-01"
                                                        max="2017-12-31"
                                                        onChange={(e) => setStartDate(e.target.value)}
                                                        required
                                                        style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc", width: "100%" }}
                                                    />
                                                </div>
                                                <div style={{ flex: 3 }}>
                                                    <label htmlFor="ticker" style={{ marginBottom: "10px", display: "block", fontWeight: "bold" }}>Stock:</label>
                                                    <select
                                                        id="ticker"
                                                        value={ticker}
                                                        onChange={(e) => setTicker(e.target.value)}
                                                        required
                                                        style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc", width: "100%" }}
                                                    >
                                                        <option value="">Select a Stock</option>
                                                        <option value="AAPL">AAPL (Apple Inc.)</option>
                                                        <option value="GOOGL">GOOGL (Alphabet Inc.)</option>
                                                        <option value="MSFT">MSFT (Microsoft Corporation)</option>
                                                        <option value="RELIANCE.BO">RELIANCE.BO (Reliance Industries Limited)</option>
                                                        <option value="TCS.BO">TCS.BO (Tata Consultancy Services Limited)</option>
                                                        <option value="HDFCBANK.BO">HDFCBANK.BO (HDFC Bank Limited)</option>
                                                        {/* Add more options as needed */}
                                                    </select>
                                                </div>
                                            </div>
                                            <button type="submit" style={{ backgroundColor: "#0891b2", color: "#fff", padding: "15px", borderRadius: "5px", border: "none", cursor: "pointer", fontWeight: "bold" }}>Submit</button>
                                        </form>
                                        {error && <div style={{ color: "red", marginTop: "20px", textAlign: "center" }}>Error: {error}</div>}
                                        {imageSrc && <img src={imageSrc} alt="Chart" style={{ display: "block", marginTop: "20px", maxWidth: "100%", borderRadius: "10px" }} />}
                                    </div>
                                </div>
                            </AccordionDetails>
                        </Accordion>

                        <Accordion
                            expanded={toggle3}
                            onChange={handleToggle3}
                            sx={{
                                "& .MuiAccordion-region": { height: toggle3 ? "auto" : 0 },
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
                            sx={{
                                "& .MuiAccordion-region": { height: compilerVisible ? "auto" : 0 },
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
            )}
        </div>
    );
};

export default RecurrentNeuralNetworks;
