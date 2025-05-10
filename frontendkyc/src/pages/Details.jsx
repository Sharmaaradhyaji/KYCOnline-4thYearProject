import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Details = () => {
  const [fatherName, setFatherName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [panNumber, setPanNumber] = useState("");
  const [adhaarNumber, setAdhaarNumber] = useState("");
  const [gender, setGender] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [panImage, setPanImage] = useState(null);
  const [adhaarImage, setAdhaarImage] = useState(null);
  const [selfieImage, setSelfieImage] = useState(null);
  const [signature, setSignature] = useState(null)


  const videoRef = useRef(null); // Reference for the video element
  const canvasRef = useRef(null); // Reference for the canvas element
  const navigate = useNavigate();

  // Start video stream for capturing selfie
  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((err) => {
          console.error("Error accessing webcam: ", err);
        });
    }
  }, []);

  // Capture selfie from video stream
  const captureSelfie = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    // Set canvas dimensions to match the video element
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert the canvas to an image (Base64 string or Blob)
    const imageData = canvas.toDataURL("image/jpeg");

    // Convert the Base64 string to a Blob (for file upload)
    fetch(imageData)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], "selfie.jpg", { type: "image/jpeg" });
        setSelfieImage(file); // Save the file for uploading
      });
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    setIsSubmitting(true);

    if(age < 18) {
      alert("You must be at least 18 years old to submit KYC details.");
      return;
    }

    const formData = new FormData();
    formData.append("fatherName", fatherName);
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("phoneNumber", phoneNumber);
    formData.append("address", address);
    formData.append("email", email);
    formData.append("age", age);
    formData.append("panNumber", panNumber);
    formData.append("adhaarNumber", adhaarNumber);
    formData.append("gender", gender);

    if (panImage) formData.append("panImage", panImage);
    if (adhaarImage) formData.append("adhaarImage", adhaarImage);
    if (selfieImage) formData.append("selfieImage", selfieImage);
    if (signature) formData.append("signature", signature);


    try {
      const response = await axios.post(
        "http://localhost:3000/kyc/add-details",
        formData,
      );

      if (response.data.message === "KYC details added successfully") {
        alert("Form submitted successfully!");
        navigate(`/kyc-details/${response.data.kycId}`);
      } else {
        alert("Submission failed: " + response.data.message);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error submitting form: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-semibold text-center mb-8">ADD Details</h1>

      <form onSubmit={handleSubmit}>
        {/* Father Name */}
        <div className="mb-6">
          <label
            htmlFor="fatherName"
            className="block text-sm font-medium text-gray-700"
          >
            Father's Name
          </label>
          <input
            id="fatherName"
            type="text"
            value={fatherName}
            onChange={(event) => setFatherName(event.target.value)}
            className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter Father's Name"
            required
          />
        </div>

        {/* First Name */}
        <div className="mb-6">
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-gray-700"
          >
            First Name
          </label>
          <input
            id="firstName"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)} 
            className="mt-1 w-full px-4 py-2 border rounded-lg"
            placeholder="Enter First Name"
            required
          />
        </div>

        {/* Last Name */}
        <div className="mb-6">
          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-gray-700"
          >
            Last Name
          </label>
          <input
            id="lastName"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="mt-1 w-full px-4 py-2 border rounded-lg"
            placeholder="Enter Last Name"
            required
          />
        </div>

        {/* Email */}
        <div className="mb-6">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter Email"
            required
          />
        </div>

        {/* Age */}
        <div className="mb-6">
          <label
            htmlFor="age"
            className="block text-sm font-medium text-gray-700"
          >
            Age
          </label>
          <input
            id="age"
            type="number"
            value={age}
            onChange={(event) => setAge(event.target.value)}
            className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter Age"
            required
          />
        </div>

        {/* Gender */}
        <div className="mb-6">
          <label
            htmlFor="gender"
            className="block text-sm font-medium text-gray-700"
          >
            Gender
          </label>
          <select
            id="gender"
            value={gender}
            onChange={(event) => setGender(event.target.value)}
            className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Address */}
        <div className="mb-6">
          <label
            htmlFor="address"
            className="block text-sm font-medium text-gray-700"
          >
            Address
          </label>
          <input
            id="address"
            type="text"
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter Address"
            required
          />
        </div>

        {/* PAN Number */}
        <div className="mb-6">
          <label
            htmlFor="panNumber"
            className="block text-sm font-medium text-gray-700"
          >
            Pan Number
          </label>
          <input
            id="panNumber"
            type="text"
            value={panNumber}
            onChange={(event) => setPanNumber(event.target.value)}
            className="mt-1 w-full px-4 py-2 border rounded-lg"
            placeholder="Enter Pan Number"
            required
          />
        </div>

        {/* Aadhar Number */}
        <div className="mb-6">
          <label
            htmlFor="aadharNumber"
            className="block text-sm font-medium text-gray-700"
          >
            Aadhar Number
          </label>
          <input
            id="aadharNumber"
            type="text"
            value={adhaarNumber}
            onChange={(event) => setAdhaarNumber(event.target.value)}
            className="mt-1 w-full px-4 py-2 border rounded-lg"
            placeholder="Enter Aadhar Number"
            required
          />
        </div>

        {/* Phone Number */}
        <div className="mb-6">
          <label
            htmlFor="phoneNumber"
            className="block text-sm font-medium text-gray-700"
          >
            Phone Number
          </label>
          <input
            id="phoneNumber"
            type="text"
            value={phoneNumber}
            onChange={(event) => setPhoneNumber(event.target.value)}
            className="mt-1 w-full px-4 py-2 border rounded-lg"
            placeholder="Enter Phone Number"
            required
          />
        </div>

        {/* Document Uploads */}
        <div className="mb-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Upload ADHAAR CARD
            </label>
            <input
              type="file"
              onChange={(e) => setAdhaarImage(e.target.files[0])}
              className="mt-2 p-2 border rounded-lg w-full"
            />
            {adhaarImage && (
              <p className="mt-2 text-sm text-gray-500">{adhaarImage.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Upload PAN CARD
            </label>
            <input
              type="file"
              onChange={(e) => setPanImage(e.target.files[0])}
              className="mt-2 p-2 border rounded-lg w-full"
            />
            {panImage && (
              <p className="mt-2 text-sm text-gray-500">{panImage.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Upload Signature
            </label>
            <input
              type="file"
              onChange={(e) => setSignature(e.target.files[0])}
              className="mt-2 p-2 border rounded-lg w-full"
            />
            {signature && (
              <p className="mt-2 text-sm text-gray-500">{signature.name}</p>
            )}
          </div>
        </div>

        {/* Selfie Capture */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">
            Capture Selfie
          </label>
          <div className="relative">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-64 bg-gray-200 rounded-lg"
            />
            <canvas ref={canvasRef} style={{ display: "none" }} />
          </div>
          <button
            type="button"
            onClick={captureSelfie}
            className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Capture Selfie
          </button>
          {selfieImage && (
            <div className="mt-4">
              <img
                src={URL.createObjectURL(selfieImage)}
                alt="Captured Selfie"
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          )}
        </div>

        <button
  type="submit"
  disabled={isSubmitting}
  className={`w-full py-2 px-4 font-semibold rounded-lg focus:outline-none 
    ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
>
  {isSubmitting ? "Submitting..." : "Submit"}
</button>

      </form>
    </div>
  );
};

export default Details;
