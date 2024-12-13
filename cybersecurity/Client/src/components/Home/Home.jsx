import React from 'react';
import heroImage from "../../logo/rb.png"; // Replace with your actual image path
import { useNavigate } from 'react-router';
const Home = () => {
 const navigate=useNavigate();
  const fontStyle = {
    fontFamily: 'Anton, sans-serif',
  };

  const lexend = {
    fontFamily: 'Lexend Giga, sans-serif',
  };
  const features = [
    { id: 1, title: 'Secure File Upload', description: 'Upload your files in a secure environment, ensuring complete privacy and safety of your data.' },
    { id: 2, title: 'Encryption at Rest and Transit', description: 'All files are encrypted both at rest and in transit, protecting your data from unauthorized access.' },
    { id: 3, title: 'Collaborative Access Control', description: 'Grant controlled access to files with specific permissions for different users to ensure data confidentiality.' },
    { id: 4, title: 'Audit Logs', description: 'View detailed logs of who accessed the files and what actions were performed, ensuring full traceability.' },
    
  ];

  const handleClick = () => {
    navigate('/dashboard');  
  }; 

  return (
    <>
      {/* Hero Section */}
      <section className="bg-[#0570B8] text-white py-20">
        <div className="container mx-auto px-6 lg:px-20 flex flex-col lg:flex-row items-center">
          {/* Text Section */}
          <div className="w-full lg:w-1/2 mb-12 lg:mb-0">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 leading-snug" style={fontStyle}>
              Secure Your Data with Ease
            </h1>
            <p className="text-lg text-gray-300 mb-6" style={lexend}>
              Upload, encrypt, and securely share your files while keeping your data private.
            </p>
            <button className="px-6 py-3 text-3xl bg-[#041014] text-white rounded-mdh hover:scale-110 transition-transform duration-300">
              Get Started
            </button>
          </div>

          {/* Image Section */}
          <div className="w-full lg:w-1/2">
            <img
              src={heroImage}
              alt="Hero"
              className="w-full max-w-lg mx-auto lg:mx-0"
            />
          </div>
        </div>
      </section>
 <section className="bg-[#0570B8] text-white mx-auto mt-0 mb-48">
      <div className="container mx-auto px-6 lg:px-20">
        <h2 className="text-4xl font-bold text-center text-[#00171f] mb-10">Our Key Features</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {features.map((feature) => (
            <div key={feature.id} className="flex items-start space-x-6 bg-[#00171f] p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-3xl font-bold text-[#00a8e8]">{feature.id}</div>
              <div>
                <h3 className="text-2xl font-semibold text-white mb-4">{feature.title}</h3>
                <p className="text-lg text-gray-300">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
    </section>
      
      
      
    </>
  );
};

export default Home;
