import { Router } from "express";
import {
  getAllQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  getQuestionByIndex,
  addPostToQuestionById
} from "../controllers/question.controller.js";
import { authorizedRoles, verifyjwt } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();

// Routes for '/api/v1/questions'
router.route('/')
  .get(getAllQuestions)
  .post(
    verifyjwt,                  // Middleware to verify JWT token
    authorizedRoles('ADMIN'),   // Middleware to authorize based on roles
    createQuestion              // Controller function to create a new question
  );

// Routes for '/api/v1/questions/:id'
router.route('/:id')
  .get(
    verifyjwt,      // Middleware to verify JWT token
    getQuestionById // Controller function to get a question by ID
  )
  .put(
    verifyjwt,                  // Middleware to verify JWT token
    authorizedRoles('ADMIN'),   // Middleware to authorize based on roles
    updateQuestion              // Controller function to update a question by ID
  )
  .delete(
    verifyjwt,                  // Middleware to verify JWT token
    authorizedRoles('ADMIN'),   // Middleware to authorize based on roles
    deleteQuestion              // Controller function to delete a question by ID
  )
  .post(
    verifyjwt,                  // Middleware to verify JWT token
    authorizedRoles('ADMIN'),   // Middleware to authorize based on roles
    upload.single('thumbnail'), // Middleware to handle file upload
    addPostToQuestionById       // Controller function to add a post to a question by ID
  );

router.route('/filter/:index').get(getQuestionByIndex);

export default router;
