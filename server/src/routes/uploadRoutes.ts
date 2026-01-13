import { Router, Request, Response } from 'express';
import { upload } from '../middleware/uploadMiddleware';
import { authenticateCallback } from '../middleware/authMiddleware';

const router = Router();

router.post('/', authenticateCallback, upload.single('file'), (req: Request, res: Response) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    // Return the file URL (assumes static file serving is set up)
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.json({ fileUrl, filename: req.file.filename, originalName: req.file.originalname });
});

export default router;
