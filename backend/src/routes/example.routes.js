import { Router } from 'express';
import {
  getItems,
  getItemById,
  createItem,
  deleteItem
} from '../controllers/example.controller.js';

const router = Router();

router.get('/', getItems);
router.get('/:id', getItemById);
router.post('/', createItem);
router.delete('/:id', deleteItem);

export default router;
