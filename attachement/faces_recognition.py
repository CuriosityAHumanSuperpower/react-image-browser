import os
import json
import face_recognition
import hashlib
from PIL import Image
from datetime import datetime
import numpy as np

# CONST
#======
IMAGE_EXT = ('.png', '.jpg', '.jpeg')  # Supported image extensions
FACE_ID_JSON = "face_recognition.json"  # File where face IDs and data will be stored

# FUNCTIONS
#==========

def hash_face_encoding(face_encoding):
    """
    This function takes a face encoding and returns a hash value as the face_id (first 20 characters).
    """
    face_encoding_str = str(face_encoding)  # Convert face encoding to a string
    return hashlib.sha1(face_encoding_str.encode('utf-8')).hexdigest()[:20]  # Hash and get the first 20 characters

def save_face_image(face_image, face_id, output_dir):
    """
    Save the detected face image to a specified directory with the face_id as filename.
    """
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    image_path = os.path.join(output_dir, f"{face_id}.jpg")
    pil_image = Image.fromarray(face_image)
    pil_image.save(image_path)

def get_image_in_folder(folder_path):
    """
    Get all image file paths in a given folder and its subdirectories.
    """
    images_path = []
    
    for root, dirs, files in os.walk(folder_path):
        for file in files:
            if file.lower().endswith(IMAGE_EXT):
                image_path = os.path.join(root, file)
                images_path.append(image_path)

    print("> Nombre d'images : \t{number}".format(number=len(images_path)))
    return images_path

def find_faces_in_images(folder_path):
    """
    Find faces in all images of a folder, return the list of faces with their encodings and image paths.
    """
    faces = []
    images_path = get_image_in_folder(folder_path)

    for image_path in images_path:
        image = face_recognition.load_image_file(image_path)
        # Find all face encodings in the image
        face_locations = face_recognition.face_locations(image)
        face_encodings = face_recognition.face_encodings(image, face_locations)

        for face_encoding, face_location in zip(face_encodings, face_locations):
            face_image = image[face_location[0]:face_location[2], face_location[3]:face_location[1]]
            faces.append({
                "path": image_path,
                "face_encoding": face_encoding,
                "face_image": face_image
            })
    
    print("> Nombre de visages : \t{number}".format(number=len(faces)))
    return faces

def load_face_id_json():
    """
    Load existing face data from the JSON file, converting face_encodings back to lists of floats.
    """
    if os.path.exists(FACE_ID_JSON):
        with open(FACE_ID_JSON, 'r', encoding='utf-8') as f:
            face_data = json.load(f)
            # Convert string back to list for each face encoding
            for face_id, data in face_data.items():
                # Ensure face_encoding is a list of floats
                data['face_encoding'] = list(data['face_encoding'])
            return face_data
    return {}

def update_face_id_json(people_data):
    """
    Save updated face data into JSON file, ensuring face_encodings are stored as lists.
    """
    with open(FACE_ID_JSON, 'w', encoding='utf-8') as f:
        # Convert numpy arrays to lists before saving
        for face_id, data in people_data.items():
            # Ensure face_encoding is always a list
            if isinstance(data['face_encoding'], np.ndarray):  
                data['face_encoding'] = data['face_encoding'].tolist()  # Convert NumPy array to list
            elif not isinstance(data['face_encoding'], list):
                raise TypeError("face_encoding must be a list or a NumPy array")
        json.dump(people_data, f, indent=4, ensure_ascii=False)

def gather_matches(faces, tolerance=0.6, output_face_images='./output'):
    """
    Compare faces to the known faces, add new faces to the JSON, and update with matching images.
    """
    # Load existing face data from JSON
    face_data = load_face_id_json()

    known_faces = []  # List to store face encodings
    known_faces_id = []  # List to store face ids

    # Populate known faces from the loaded JSON
    for face_id, data in face_data.items():
        known_faces.append(data['face_encoding'])
        known_faces_id.append(face_id)

    for face in faces:
        face_encoding = face["face_encoding"]
        
        # Check if the face matches an existing face
        matches = face_recognition.compare_faces(known_faces, face_encoding, tolerance)
        
        if True in matches:
            # Use the existing face_id if a match is found
            face_id = known_faces_id[matches.index(True)]
            if face["path"] not in face_data[face_id]["pictures"] : 
                face_data[face_id]["pictures"].append(face["path"])
        else:
            # If no match, create a new face_id
            face_id = hash_face_encoding(face_encoding)  # Get face_id from hash function
            known_faces.append(face_encoding)
            known_faces_id.append(face_id)
            face_data[face_id] = {
                "face_encoding": face_encoding,
                "pictures": [face["path"]]
            }

            # Save the face image with the new face_id
            save_face_image(face["face_image"], face_id, output_face_images)

    #Info
    print("> Nombre de personnes : {number}".format(number=len(known_faces)))

    # Save the updated face data to the JSON file
    update_face_id_json(face_data)

    return face_data

# MAIN
#=====
if __name__ == "__main__":
    # Process images from folders
    if True:
        with open("folders_kev.csv", 'r', encoding='utf-8') as file:
            lines = file.readlines()
            for line in lines:
                path = line.replace('\n', '')
                print('> Dossier : \t\t"{path}"'.format(path=path))
                if False rue : #convert heic to jpg
                    os.system('heif-convert "{path}\*\*\*.heic" -f jpg'.format(path=path))
                if True:
                    faces = find_faces_in_images(path)
                    people = gather_matches(faces)