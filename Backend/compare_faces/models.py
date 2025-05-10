import face_recognition_models
import os

print("Models location:", face_recognition_models.__path__)
print("Files in models folder:", os.listdir(face_recognition_models.__path__[0]))
