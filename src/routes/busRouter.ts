import express from 'express';

const router = express.Router();

router.get('/', async (req, res) => {
  return res.status(200).json({
    message: 'hello',
  });
});

export const busRouter = router;