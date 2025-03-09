import express from 'express';
import DetectController from '../app/controllers/DetectController.js';
import multer from "multer";
import path from "path";

// ✅ Cấu hình Multer để lưu ảnh vào thư mục `uploads`
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "src/public/uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Đổi tên file tránh trùng lặp
    }
});

const upload = multer({ storage: storage });

const router = express.Router();

router.get('/', DetectController.index);
router.post('/predict', upload.single('image'), DetectController.predict);
router.post('/explain', DetectController.explain);
router.post('/chat', DetectController.chat);

export default router;
