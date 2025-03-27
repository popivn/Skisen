import os
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'

import numpy as np
import tensorflow as tf
import cv2
from fastapi import FastAPI, File, UploadFile
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
from pathlib import Path
from fastapi.staticfiles import StaticFiles
from PIL import Image, ImageDraw
from ultralytics import YOLO  

tf.get_logger().setLevel('ERROR')

# Khởi tạo FastAPI app
app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")

# Định nghĩa đường dẫn đến model đã lưu
MODEL_RESNET_PATH = Path("models/resnet.keras")
MODEL_YOLO_PATH = Path("models/yolo.pt")

# Kiểm tra mô hình có tồn tại không
if not MODEL_RESNET_PATH.exists():
    raise FileNotFoundError(f"Không tìm thấy mô hình ResNet tại {MODEL_RESNET_PATH}")
if not MODEL_YOLO_PATH.exists():
    raise FileNotFoundError(f"Không tìm thấy mô hình YOLO tại {MODEL_YOLO_PATH}")

# Load mô hình YOLO
model_yolo = YOLO(str(MODEL_YOLO_PATH))

# Load mô hình ResNet
model_resnet = load_model(str(MODEL_RESNET_PATH), compile=False)

labels_map = {0: "Acne", 1: "Chickenpox", 2: "Monkeypox", 3: "Measles"}

# Hàm tiền xử lý ảnh cho ResNet
def preprocess_image(img: Image.Image):
    img = img.resize((224, 224))  
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = tf.keras.applications.resnet.preprocess_input(img_array)  
    return img_array

# Hàm tạo Grad-CAM++
def generate_gradcam(model, img_array, class_idx):
    grad_model = tf.keras.models.Model(
        inputs=[model.inputs],
        outputs=[model.get_layer("conv5_block3_out").output, model.output]
    )
    
    with tf.GradientTape() as tape:
        conv_outputs, predictions = grad_model(img_array)
        loss = predictions[:, class_idx]
    
    grads = tape.gradient(loss, conv_outputs)[0]
    weights = tf.reduce_mean(grads, axis=(0, 1))
    cam = np.dot(conv_outputs[0], weights)
    
    cam = np.maximum(cam, 0)
    cam = (cam - cam.min()) / (cam.max() - cam.min())
    cam = cv2.resize(cam, (224, 224))
    return cam

# API nhận ảnh từ người dùng và xử lý với YOLO + ResNet + Grad-CAM++
@app.post("/analyze/")
async def analyze(file: UploadFile = File(...)):
    img = Image.open(file.file).convert("RGB")
    
    results = model_yolo(img)
    detections = results[0].boxes.data.cpu().numpy()
    
    predictions = []
    draw = ImageDraw.Draw(img)
    
    for box in detections:
        x1, y1, x2, y2, score, class_id = box
        x1, y1, x2, y2 = int(x1), int(y1), int(x2), int(y2)

        cropped_img = img.crop((x1, y1, x2, y2))
        processed_image = preprocess_image(cropped_img)

        prediction = model_resnet.predict(processed_image)
        predicted_class = int(np.argmax(prediction))
        predicted_label = labels_map[predicted_class]
        confidence = float(np.max(prediction) * 100)

        # Tạo Grad-CAM++
        heatmap = generate_gradcam(model_resnet, processed_image, predicted_class)
        heatmap = np.uint8(255 * heatmap)
        heatmap = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)
        cropped_array = np.array(cropped_img.resize((224, 224)))
        superimposed_img = cv2.addWeighted(cropped_array, 0.6, heatmap, 0.4, 0)
        superimposed_img = Image.fromarray(superimposed_img)

        gradcam_path = f"static/gradcam/gradcam_{x1}_{y1}.png"
        superimposed_img.save(gradcam_path)
        
        draw.rectangle([x1, y1, x2, y2], outline="red", width=3)
        draw.text((x1, y1 - 10), f"{predicted_label} ({confidence:.2f}%)", fill="red")

        predictions.append({
            "x1": x1, "y1": y1, "x2": x2, "y2": y2,
            "predicted_class": predicted_label,
            "confidence": round(confidence, 2),
            "gradcam_image": f"http://localhost:5000/{gradcam_path}"
        })
    
    output_path = "static/result_detected.png"
    img.save(output_path)
    
    return {
        "detections": predictions,
        "output_image": f"http://localhost:5000/{output_path}",
    }
