import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import left from "../../logo/upload.png";
import right from "../../logo/data-encryption.png";

const Dashboard = () => {
  const [rightImageVisible, setRightImageVisible] = useState(false);
  const navigate = useNavigate();

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setRightImageVisible(true);
    }
  };

  const triggerFileUpload = () => {
    document.getElementById('file-input').click();
  };

  const handleRightImageClick = () => {
    navigate('/new-page');
  };

  return (
    <div className="flex h-screen">
      <div
        className="flex-1 flex items-center justify-center cursor-pointer">
        <div 
        className="w-52 h-52 hover:scale-110 transition-transform duration-300 " onClick={triggerFileUpload}>
        
        <img
          src={left}
          alt="Left Placeholder"
          className="max-w-1/2 max-h-1/2"
        />
        
        <input
          id="file-input"
          type="file"
          className="hidden"
          onChange={handleFileUpload}
        />
        <h1 className='text-3xl text-[#041014] font-mono '>Upload file </h1>
      </div>

      </div>
      <div className="flex-1 flex items-center justify-center">
        <div className="w-52 h-52 hover:scale-110 transition-transform duration-300">
          {rightImageVisible && (
            <>
              <img
                src={right}
                alt="Right Placeholder"
                className="max-w-1/2 max-h-1/2 cursor-pointer"
                onClick={handleRightImageClick}
              />
              <h2 className='text-2xl text-[#041014] font-mono mt-4'>Access secured file</h2>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
