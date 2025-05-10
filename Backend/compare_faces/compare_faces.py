import requests
import cv2
import numpy as np
from PIL import Image
from flask import Flask, request, jsonify
from skimage.metrics import structural_similarity as ssim

app = Flask(__name__)

# Load image from URL
def load_image_from_url(url):
    try:
        response = requests.get(url, stream=True)
        image = Image.open(response.raw).convert("RGB")
        return np.array(image)
    except Exception as e:
        raise Exception(f"Error loading image from URL: {e}")

# Resize and grayscale
def preprocess_image(image):
    resized_image = cv2.resize(image, (800, 1200))
    gray_image = cv2.cvtColor(resized_image, cv2.COLOR_BGR2GRAY)
    return gray_image

# Face detection using Haar Cascade
def detect_faces_using_haar(image):
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    faces = face_cascade.detectMultiScale(image, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))
    return faces

# Compare faces using SSIM
def compare_faces_with_ssim(pan_image, selfie_image, original_pan, original_selfie):
    pan_faces = detect_faces_using_haar(pan_image)
    selfie_faces = detect_faces_using_haar(selfie_image)

    print(f"PAN faces detected: {len(pan_faces)}")
    print(f"Selfie faces detected: {len(selfie_faces)}")

    try:
        if len(pan_faces) == 1 and len(selfie_faces) == 1:
            # Use face crop
            pan_face = pan_faces[0]
            selfie_face = selfie_faces[0]

            pan_crop = original_pan[pan_face[1]:pan_face[1]+pan_face[3], pan_face[0]:pan_face[0]+pan_face[2]]
            selfie_crop = original_selfie[selfie_face[1]:selfie_face[1]+selfie_face[3], selfie_face[0]:selfie_face[0]+selfie_face[2]]
        else:
            # Fallback to full image
            pan_crop = original_pan
            selfie_crop = original_selfie

        # Resize and convert to grayscale
        pan_crop_resized = cv2.resize(pan_crop, (200, 200))
        selfie_crop_resized = cv2.resize(selfie_crop, (200, 200))

        # Save debug crops
        cv2.imwrite("debug_pan.jpg", pan_crop_resized)
        cv2.imwrite("debug_selfie.jpg", selfie_crop_resized)

        pan_gray = cv2.cvtColor(pan_crop_resized, cv2.COLOR_BGR2GRAY)
        selfie_gray = cv2.cvtColor(selfie_crop_resized, cv2.COLOR_BGR2GRAY)

        # SSIM score
        similarity_index, _ = ssim(pan_gray, selfie_gray, full=True)

        print(f"SSIM score: {similarity_index}")

        return similarity_index

    except Exception as e:
        print(f"Error during face comparison: {e}")
        return 0.0  # Return 0 if anything fails

# Route
@app.route('/compare-faces', methods=['POST'])
def compare_faces():
    data = request.get_json()
    pan_url = data.get("panImageUrl")
    selfie_url = data.get("selfieImageUrl")

    if not pan_url or not selfie_url:
        return jsonify({"error": "Both PAN and selfie image URLs are required"}), 400

    try:
        # Load original color images
        pan_image = load_image_from_url(pan_url)
        selfie_image = load_image_from_url(selfie_url)

        # Preprocess for detection
        pan_image_gray = preprocess_image(pan_image)
        selfie_image_gray = preprocess_image(selfie_image)

        # Compare using SSIM
        similarity_score = compare_faces_with_ssim(pan_image_gray, selfie_image_gray, pan_image, selfie_image)

        return jsonify({
            "similarity_index": round(similarity_score, 4)
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
