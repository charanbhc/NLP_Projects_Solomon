import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { FaEye } from "react-icons/fa";
import { toast } from "react-hot-toast";
import BeatLoader from "react-spinners/BeatLoader";
import TextHighlighter from "./TextHighlighter";
import { RiDeleteBin6Line } from "react-icons/ri";
import { BASE_URL } from "../config";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Dataacquisition } from "../../src/Explanation2";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import CodeEditor2 from "../components/CodeEditor2";
import Compiler from "../components/Compiler";
import { pageInformationAPI } from "../GetPageInfo";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const ReinforcedLearning = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [texttoextract, settexttoextract] = useState("");
  const [data, setdata] = useState("");
  const [Dropvalue, setDropvalue] = useState(null);
  const [wordsToHighlight, setwordsToHighlight] = useState([]);
  const [selectedOption, setSelectedOption] = useState("option1");
  const [wordsToHighlight1, setwordsToHighlight1] = useState(null);
  const [wordsToHighlight2, setwordsToHighlight2] = useState(null);
  const [whatIsItWhereIsItUsed, setWhatIsItWhereIsItUsed] = useState(null);
  const [editorHtml, setEditorHtml] = useState("");

  useEffect(() => {
    getWhatIsItAndWhereIsItUsed();
    const adminStatus = localStorage.getItem("isAdmin") === "true";
    setIsAdmin(adminStatus);
    console.log(adminStatus);
  }, []);

  const quillRef = useRef(null);

  const getWhatIsItAndWhereIsItUsed = () => {
    var body = JSON.stringify({
      pagePath: "keyphrase-extraction",
    });
    const getResponse = pageInformationAPI(
      body,
      "/api/user/pageInformation/getInfo"
    );
    getResponse
      .then((response) => Promise.all([response.status, response.json()]))
      .then((res) => {
        console.log(res[1].whatIsItAndWhereItIsUsed);
        setWhatIsItWhereIsItUsed(res[1].whatIsItAndWhereItIsUsed);
        setEditorHtml(res[1].whatIsItAndWhereItIsUsed)
      });
  };

  const saveWhatIsItAndWhereIsItUsed = (value) => {
    var body = JSON.stringify({
      pagePath: "keyphrase-extraction",
      whatIsItAndWhereItIsUsed: value,
    });

    const getResponse = pageInformationAPI(
      body,
      "/api/user/pageInformation/addOrUpdateInfo"
    );
    getResponse
      .then((response) => Promise.all([response.status, response.json()]))
      .then((res) => {
        console.log(res[1]);
      });
  };

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
    if (e.target.value === "1") {
      setwordsToHighlight(wordsToHighlight1);
    } else {
      setwordsToHighlight(wordsToHighlight2);
    }
  };

  const load = () => {
    return (
      <div
        className={`flex justify-center items-center h-screen ${loading ? "block" : "hidden"}`}
      >
        <div className="">
          <BeatLoader loading={loading} className="text-cyan-900 text-3xl" />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  };

  const handleChangeValue = (value) => {
    setWhatIsItWhereIsItUsed(value);
  };

  const handleSubmit = async () => {
    if (!texttoextract) {
      setshowSD(false);
      toast.error("Please Input some text to Extract");
      return;
    } else {
      try {
        setLoading(true);
        console.log(texttoextract);
        const data = {
          input_text: texttoextract,
        };
        const token = localStorage.getItem("token");
        const response = await axios.post(
          BASE_URL + "/api/user/keyphrase-extraction",
          data,
          {
            headers: {
              "Content-type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
          {
            timeout: 5000,
          }
        );

        if (response.data) {
          setdata(response.data.keyphrases);
          toast.success("Response Generated Successfully");
          const sgrankTextArray = response.data.keyphrases["sgrank_output"].map(
            (item) => item[0]
          );
          const textrankTextArray = response.data.keyphrases[
            "textrank_output"
          ].map((item) => item[0]);
          setshowSD(true);
          setwordsToHighlight1(textrankTextArray);
          setwordsToHighlight2(sgrankTextArray);
        }
      } catch (error) {
        console.error(error);
        toast.error(error.response.data.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleChange = (e) => {
    setDropvalue(e.target.value);
  };

  const [showSD, setshowSD] = useState(false);

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
    setWhatIsItWhereIsItUsed(e);
  };

  const saveValue = () => {
    console.log(editorHtml);
    saveWhatIsItAndWhereIsItUsed(editorHtml);
  };

  const handleSaveClick = () => {
    saveValue();
    toast.success("Data Modified Successfully!");
  };

  return (
    <div>
      {loading ? (
        load()
      ) : (
        <div className="font-sans items-center text-left bg-slate-100 h-screen">
          <div className="container mx-auto  md:w-1/2 lg:w-full xl:w-full pt-10 pl-8 pr-8 ">
            <div className="text-center rounded-t-xl py-4 w-full bg-[#044661] text-white">
              <h2 className="text-xl">Reinforced Learning</h2>
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
                                modules={
                                  isAdmin
                                    ? { toolbar: true }
                                    : { toolbar: false }
                                } // Enable the toolbar
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
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <TicTacToeGame />
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

// Tic Tac Toe Game Component
const TicTacToeGame = () => {
  const initialBoard = Array(9).fill(null);
  const [board, setBoard] = useState(initialBoard);
  const [xIsNext, setXIsNext] = useState(true);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (!xIsNext && !gameOver) {
      // Computer's turn (O)
      const timeout = setTimeout(() => {
        makeComputerMove();
      }, 500); // Adjust delay as needed

      return () => clearTimeout(timeout);
    }
  }, [xIsNext, gameOver]);

  const handleClick = (index) => {
    if (calculateWinner(board) || board[index] || !xIsNext) {
      return;
    }
    const newBoard = [...board];
    newBoard[index] = "X";
    setBoard(newBoard);
    setXIsNext(false);
  };

  const makeComputerMove = () => {
    // Simple AI: picks the first available empty square
    const availableMoves = board.reduce((acc, _, index) => {
      if (!board[index]) {
        acc.push(index);
      }
      return acc;
    }, []);

    const randomIndex = Math.floor(Math.random() * availableMoves.length);
    const newBoard = [...board];
    newBoard[availableMoves[randomIndex]] = "O";
    setBoard(newBoard);
    setXIsNext(true);
  };

  useEffect(() => {
    const winner = calculateWinner(board);
    if (winner) {
      setGameOver(true);
    } else if (!board.includes(null)) {
      setGameOver(true);
    }
  }, [board]);

  const resetGame = () => {
    setBoard(initialBoard);
    setXIsNext(true);
    setGameOver(false);
  };

  const renderSquare = (index) => {
    return (
      <button
        style={{
          background: "#fff",
          border: "1px solid #999",
          fontSize: "24px",
          fontWeight: "bold",
          lineHeight: "34px",
          height: "100px",
          width: "100px",
          padding: "0",
          margin: "0",
          textAlign: "center",
          userSelect: "none",
          outline: "none",
        }}
        onClick={() => handleClick(index)}
        disabled={board[index] !== null || !xIsNext || gameOver}
      >
        {board[index]}
      </button>
    );
  };

  const winner = calculateWinner(board);
  const status = winner
    ? `Winner: ${winner}`
    : gameOver
      ? "Game Over - Draw"
      : `Next player: ${xIsNext ? "X" : "O"}`;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ display: "flex" }}>
          {renderSquare(0)}
          {renderSquare(1)}
          {renderSquare(2)}
        </div>
        <div style={{ display: "flex" }}>
          {renderSquare(3)}
          {renderSquare(4)}
          {renderSquare(5)}
        </div>
        <div style={{ display: "flex" }}>
          {renderSquare(6)}
          {renderSquare(7)}
          {renderSquare(8)}
        </div>
      </div>
      <div
        style={{
          marginTop: "20px",
          fontSize: "24px",
          fontWeight: "bold",
        }}
      >
        {status}
      </div>
      {(winner || gameOver) && (
        <button
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            fontSize: "16px",
            background: "#4CAF50",
            color: "white",
            border: "none",
            cursor: "pointer",
            borderRadius: "5px",
            outline: "none",
          }}
          onClick={resetGame}
        >
          Restart Game
        </button>
      )}
    </div>
  );
};

const calculateWinner = (squares) => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
};

export default ReinforcedLearning;
