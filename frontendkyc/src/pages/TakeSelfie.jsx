import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, CheckCircle } from 'lucide-react';
import axios from 'axios';

const TakeSelfie = () => {
  const [selfie, setSelfie] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    startCamera();
    return () => stopCamera(); // Cleanup camera on unmount
  }, []);

  const startCamera = async () => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        streamRef.current = stream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("Please allow camera access.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const captureSelfie = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (!canvas || !video) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const selfieData = canvas.toDataURL('image/png'); // Convert to base64

    setSelfie(selfieData);
    stopCamera();
  };

  const handleConfirmSelfie = async () => {
    if (!selfie) {
      alert("No selfie captured.");
      return;
    }
  
    try {
      // Convert Base64 to Blob
      const byteString = atob(selfie.split(',')[1]); // Decode base64
      const mimeString = selfie.split(',')[0].split(':')[1].split(';')[0]; // Extract MIME type
      const arrayBuffer = new ArrayBuffer(byteString.length);
      const uint8Array = new Uint8Array(arrayBuffer);
  
      for (let i = 0; i < byteString.length; i++) {
        uint8Array[i] = byteString.charCodeAt(i);
      }
  
      const blob = new Blob([arrayBuffer], { type: mimeString });
      const file = new File([blob], "selfie.png", { type: mimeString });
  
      // Prepare FormData
      const formData = new FormData();
      formData.append("file", file);
  
      // Upload using Axios
      const uploadResponse = await axios.post("http://localhost:3000/api/uploadSelfie", formData);
  
      if (!uploadResponse.data.success) {
        alert("Selfie upload failed: " + data.message);
        return;
      }
  
      alert("Selfie uploaded successfully!");
      navigate("/additional-details");
  
    } catch (error) {
      alert("File upload failed: " + error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Take a Selfie</h2>

      {!selfie ? (
        <>
          <video ref={videoRef} className="w-64 h-64 rounded-lg shadow-lg mb-4" autoPlay />
          <canvas ref={canvasRef} style={{ display: 'none' }} />
          <button
            onClick={captureSelfie}
            className="flex items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            <Camera className="w-5 h-5" /> Capture Selfie
          </button>
        </>
      ) : (
        <>
          <img src={selfie} alt="Selfie" className="w-64 h-64 rounded-lg shadow-lg mb-4" />
          <button
            onClick={handleConfirmSelfie}
            className="flex items-center gap-2 bg-green-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-green-700 transition"
          >
            <CheckCircle className="w-5 h-5" /> Confirm & Proceed
          </button>
        </>
      )}
    </div>
  );
};

export default TakeSelfie;
