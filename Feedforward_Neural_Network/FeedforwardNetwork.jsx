import React, { useState, useEffect, useRef } from 'react';
import { BASE_URL } from '../config';
import { TextField, Button, Typography } from '@mui/material';
import axios from 'axios';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { toast } from 'react-hot-toast';
import BeatLoader from 'react-spinners/BeatLoader';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import CodeEditor2 from '../components/CodeEditor2';
import Compiler from '../components/Compiler';
import { pageInformationAPI } from '../GetPageInfo';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const FeedforwardNetworkComponent = () => {
  const [sepalLength, setSepalLength] = useState('');
  const [sepalWidth, setSepalWidth] = useState('');
  const [petalLength, setPetalLength] = useState('');
  const [petalWidth, setPetalWidth] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [imageURL, setImageURL] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [whatIsItWhereIsItUsed, setWhatIsItWhereIsItUsed] = useState('');
  const [isAdmin, setIsAdmin] = useState(true);
  const [expandedAccordion, setExpandedAccordion] = useState(false);
  const [toggle1, setToggle1] = useState(false);
  const [compilerVisible, setCompilerVisible] = useState(false);
  const [toggle2, setToggle2] = useState(false);
  const [editorHtml, setEditorHtml] = useState('');

  const imageLinks = {
    setosa: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/Irissetosa1.jpg',
    versicolor: 'https://upload.wikimedia.org/wikipedia/commons/4/41/Iris_versicolor_3.jpg',
    virginica: 'https://upload.wikimedia.org/wikipedia/commons/9/9f/Iris_virginica.jpg',
  };

  useEffect(() => {
    getWhatIsItAndWhereIsItUsed();
    return () => {
      setWhatIsItWhereIsItUsed('');
      setPrediction(null);
      setImageURL(null);
      setError(null);
    };
  }, []);

  const quillRef = useRef(null);

  const getWhatIsItAndWhereIsItUsed = async () => {
    try {
      const body = JSON.stringify({ pagePath: 'feedforward-network' });
      const response = await pageInformationAPI(body, '/api/user/pageInformation/getInfo');
      const data = await response.json();
      setWhatIsItWhereIsItUsed(data.whatIsItAndWhereItIsUsed);
      
    } catch (error) {
      console.error('Error fetching information:', error);
    }
  };
  const saveValue = () => {
    console.log(editorHtml)
    saveWhatIsItAndWhereIsItUsed(editorHtml)
  };
  const handleSaveClick = () => {
    saveValue();
    toast.success('Data Modified Successfully!');
  };

  const saveWhatIsItAndWhereIsItUsed = async (value) => {
    try {
      const body = JSON.stringify({
        pagePath: 'feedforward-network',
        whatIsItAndWhereIsItUsed: value,
      });
      await pageInformationAPI(body, '/api/user/pageInformation/addOrUpdateInfo');
    } catch (error) {
      console.error('Error saving information:', error);
    }
  };

  const load = () => (
    <div className={`flex justify-center items-center h-screen ${loading ? 'block' : 'hidden'}`}>
      <div>
        <BeatLoader loading={loading} className="text-cyan-900 text-3xl" />
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  );

  const handleChange = (e) => {
    setEditorHtml(e);
    setWhatIsItWhereIsItUsed(e)
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPrediction(null);
    setImageURL(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token not found.');
        setError('Token not found.');
        setLoading(false);
        return;
      }

      const data = {
        sepal_length: parseFloat(sepalLength),
        sepal_width: parseFloat(sepalWidth),
        petal_length: parseFloat(petalLength),
        petal_width: parseFloat(petalWidth),
      };

      console.log('Sending data to API:', data);

      const response = await axios.post(`${BASE_URL}/api/user/feedforward-network`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('API response:', response.data);

      if (response.data && response.data.class) {
        const predictedClass = response.data.class;
        setPrediction(predictedClass);
        setImageURL(imageLinks[predictedClass]);
        setError(null);
      } else {
        console.error('Unexpected response format:', response.data);
        setError('Invalid response from API');
      }
    } catch (err) {
      console.error('Error occurred:', err);
      setError(err.response ? err.response.data.error : 'Error occurred');
      setPrediction(null);
      setImageURL(null);
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


  return (
    <div>
      {loading ? load() : (
        <div className="font-sans items-center text-left bg-slate-100 h-screen">
          <div className="container mx-auto md:w-1/2 lg:w-full xl:w-full pt-10 pl-8 pr-8">
            <div className="text-center rounded-t-xl py-4 w-full bg-[#044661] text-white">
              <h2 className="text-xl">Feedforward Network</h2>
            </div>

            <div className="bg-white p-1 rounded-b-lg shadow-lg shadow-gray-500">
              {/* Block 1: Information */}
              <Accordion
                expanded={expandedAccordion === 'panel1'}
                onChange={(event, isExpanded) => setExpandedAccordion(isExpanded ? 'panel1' : false)}
                sx={{
                  "& .MuiAccordion-region": { height: "auto" },
                  "& .MuiAccordionDetails-root": { display: "block" },
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

              {/* Block 2: Prediction */}
              <Accordion
                expanded={toggle2}
                onChange={handleToggle2}
                slotProps={{ transition: { unmountOnExit: true } }}
                sx={{
                  "& .MuiAccordion-region": { height: toggle2 ? "auto" : 0 },
                  "& .MuiAccordionDetails-root": { display: toggle2 ? "block" : "none" },
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
                  <div className="py-4 px-8">
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <TextField
                        label="Sepal Length"
                        variant="outlined"
                        fullWidth
                        type="number"
                        value={sepalLength}
                        onChange={(e) => setSepalLength(e.target.value)}
                      />
                      <TextField
                        label="Sepal Width"
                        variant="outlined"
                        fullWidth
                        type="number"
                        value={sepalWidth}
                        onChange={(e) => setSepalWidth(e.target.value)}
                      />
                      <TextField
                        label="Petal Length"
                        variant="outlined"
                        fullWidth
                        type="number"
                        value={petalLength}
                        onChange={(e) => setPetalLength(e.target.value)}
                      />
                      <TextField
                        label="Petal Width"
                        variant="outlined"
                        fullWidth
                        type="number"
                        value={petalWidth}
                        onChange={(e) => setPetalWidth(e.target.value)}
                      />
               
    <Button
      type="submit"
      variant="contained"
      color="primary"
      startIcon={<CloudUploadIcon />}
    >
      Predict
    </Button>
  </form>

  {error && <Typography color="error">{error}</Typography>}
  {prediction && (
    <div className="mt-4 flex flex-col items-center">
      <Typography variant="h6">Prediction: {prediction}</Typography>
      <img src={imageURL} alt={prediction} className="mt-2 w-48 h-48 object-cover" />
    </div>
  )}
</div>
               </AccordionDetails>
              </Accordion>

              {/* Block 3: Generate Code */}
              <Accordion
                expanded={toggle1}
                onChange={() => setToggle1(!toggle1)}
                sx={{
                  "& .MuiAccordion-region": { height: toggle1 ? "auto" : 0 },
                  "& .MuiAccordionDetails-root": { display: toggle1 ? "block" : "none" },
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

              {/* Block 4: Try It */}
              <Accordion
                expanded={compilerVisible}
                onChange={handleToggleCompiler}
                sx={{
                  "& .MuiAccordion-region": { height: compilerVisible ? "auto" : 0 },
                  "& .MuiAccordionDetails-root": { display: compilerVisible ? "block" : "none" },
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
                  <Compiler />
                </AccordionDetails>
              </Accordion>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedforwardNetworkComponent;
