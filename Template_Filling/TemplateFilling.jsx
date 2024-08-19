import toast from "react-hot-toast";
import React, { useState, useEffect, useRef } from "react";
import { pageInformationAPI } from "../GetPageInfo";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import BeatLoader from "react-spinners/BeatLoader";
import axios from "axios";
import { BASE_URL } from "../config";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { TemplateFillingDescription } from "../../src/Explanation2";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import CodeEditor2 from "../components/CodeEditor2";
import Compiler from "../components/Compiler";

const TemplateFilling = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [whatIsItWhereIsItUsed, setWhatIsItWhereIsItUsed] = useState(null)
  const [editorHtml, setEditorHtml] = useState('');
  let [loading, setLoading] = useState(false);
  const [baseText, setbaseText] = useState('');
  const [templateText, settemplateText] = useState('');
  const [filledText, setfilledText] = useState('');
  const [Result, setResult] = useState(false);
  const contentEditableRef = useRef();

  useEffect(() => {
    getWhatIsItAndWhereIsItUsed()
    const adminStatus = localStorage.getItem("isAdmin") === 'true';
    setIsAdmin(adminStatus);
    console.log(adminStatus);
  }, []);

  const quillRef = useRef(null);

  const getWhatIsItAndWhereIsItUsed = () => {
    var body = JSON.stringify({
      pagePath: "template-filling"
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
      pagePath: "template-filling",
      whatIsItAndWhereItIsUsed: value
    })
    
    const getResponse = pageInformationAPI(body, "/api/user/pageInformation/addOrUpdateInfo")
    getResponse
      .then(response => { return Promise.all([response.status, response.json()]) })
      .then(res => {
        console.log(res[1])
      });
  }
  // spinner
  const load = () => {
    return (
      <div className={`flex justify-center items-center h-screen ${loading ? 'block' : 'hidden'}`}>
        <div className="">
          <BeatLoader loading={loading} className="text-cyan-900 text-3xl" />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }
  const handleChangeValue = (value) => {
    setWhatIsItWhereIsItUsed(value);
  };
  const handleBaseTextChange = (event) => {
    setbaseText(event.target.value);
  }

  const handleTemplateTextChange = (event) => {
    settemplateText(event.target.value);
  }

  const handleFill = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      const response = await axios.post(
        BASE_URL + "/api/user/template-filling",
        {
          baseText,
          templateText,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response && response.data) {
        const sanitizedText = response.data.filled_text.replace(/(\r\n|\n|\r)/gm, '');
        const formattedText = sanitizedText.replace(/<([^>]*)>/g, (match, content) => {
          return `<b>${content}</b>`;
        }).replace(/{|}/g, '');

        setfilledText(formattedText);
        setResult(true);
        toast.success('Template filled successfully!');
      } else {
        toast.error('Invalid response format');
      }
    } catch (error) {
      toast.error(error.response ? error.response.data.message : 'An error occurred while filling the template.');
      console.error("Error Occurred while filling template:", error);
    } finally {
      setLoading(false);
    }
  };

  const [compilerVisible, setCompilerVisible] = useState(false);
  const [toggle1, setToggle1] = useState(false);
  const [toggle2, setToggle2] = useState(false);
  const [toggle3, setToggle3] = useState(false);


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
    <div>
      {loading ? load() : (
        <div>
          <div className="font-sans items-center text-left bg-slate-200 h-screen">
            <div className="container mx-auto w-full md:w-full lg:w-full xl:w-full pt-10 pl-8 pr-8 ">
              <div className="text-center rounded-t-xl py-4 w-full bg-[#044661] text-white">
                <h2 className="text-xl">Template Filling</h2>
              </div>
              <div className=" bg-white p-1 rounded-b-lg shadow-lg shadow-gray-500  ">
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
                      {" "}
                      What Is It and Where Can You Use It
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <div className="flex flex-col items-center">
                      <table className="w-full rounded-lg text-center shadow-md overflow-hidden mb-100">
                        <thead className="text-md text-white border-2  border-gray-300 bg-cyan-500 h-10">
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
                    <div className=" bg-white p-10 rounded-b-lg shadow-lg shadow-gray-500">
                      <div className="pb-16">
                        <table className="w-full border-cyan-600 border-2 rounded-t-lg">
                          <th className="font-semibold text-m text-white bg-cyan-600 text-center pl-1">Base Text</th>
                          <tr>
                            <td>
                              <textarea
                                placeholder=""
                                value={baseText}
                                onChange={handleBaseTextChange}
                                className="w-full h-40 border-transparent focus:outline-none focus:ring-0 focus:border-transparent resize-none"
                              ></textarea>
                            </td>
                          </tr>
                        </table>
                      </div>
                      <div>
                        <table className="w-full border-cyan-600 border-2 rounded-t-lg">
                          <th className="font-semibold text-m text-white text-center bg-cyan-600 pl-1">Template Text to Fill</th>
                          <tr>
                            <td>
                              <textarea
                                placeholder=""
                                value={templateText}
                                onChange={handleTemplateTextChange}
                                className="w-full h-40 border-transparent focus:outline-none focus:ring-0 focus:border-transparent resize-none"
                              ></textarea>
                            </td>
                          </tr>
                        </table>
                      </div>
                      <div className="flex justify-center py-8 px-8">
                        <button onClick={handleFill} className="bg-[#1976d2] hover:bg-[#1868b7] text-white px-4 py-2 rounded text-md font-bold">
                          Fill the Template
                        </button>
                      </div>
                      {Result ? (
                        <div>
                          <table className="w-full border-cyan-600 border-2 rounded-t-lg">
                            <th className="font-semibold text-m text-white text-center bg-cyan-600 pl-1">Filled Text</th>
                            <tr>
                              <td>
                                <div
                                  dangerouslySetInnerHTML={{ __html: filledText }}
                                  className="w-full h-56 border-transparent focus:outline-none focus:ring-0 focus:border-transparent"
                                />
                              </td>
                            </tr>
                          </table>
                        </div>
                      ) : " "
                      }
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
                  <AccordionDetails> <CodeEditor2 /></AccordionDetails>
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
        </div>
      )}
    </div>
  );
};

export default TemplateFilling;
