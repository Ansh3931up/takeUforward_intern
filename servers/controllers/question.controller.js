import ApiResponse from "../utilities/ApiResponse.js";
import ApiError from "../utilities/ApiError.js";
import { asyncHandler } from "../utilities/asyncHandler.js";
import { Question } from "../module/Question.js"; // Sequelize Question model
import { uploadOnCloudinary } from "../utilities/cloudinary.js";
// import generateUniqueIndex from "../utilities/generateunique.js"; // Import the unique index generator

async function generateUniqueIndex() {
    let index;
    let isUnique = false;

    while (!isUnique) {
        index = Math.floor(Math.random() * 1000000); // Generate a random index

        // Check if the index is already in use
        const existingQuestion = await Question.findOne({ where: { index } });

        if (!existingQuestion) {
            isUnique = true; // The index is unique
        }
    }

    return index;
}

const getAllQuestions = asyncHandler(async (req, res) => {
    const questions = await Question.findAll({
        attributes: { exclude: ['posts'] }
    });

    return res
        .status(200)
        .json(new ApiResponse(200, questions, "All questions present"));
});

const getQuestionById = asyncHandler(async (req, res) => {
    const questionId = req.params.id;
    const question = await Question.findByPk(questionId);

    if (!question) {
        throw new ApiError(404, 'Question not found');
    }

    return res
        .status(200)
        .json(new ApiResponse(200, question, "Question found"));
});

const getQuestionByIndex = asyncHandler(async (req, res) => {
    const { index } = req.params;
    const question = await Question.findOne({ where: { index } });

    if (!question) {
        throw new ApiError(404, 'Question not found');
    }

    return res
        .status(200)
        .json(new ApiResponse(200, question, "Question found"));
});

const createQuestion = asyncHandler(async (req, res) => {
    const { title, description } = req.body;

    if ([title, description].some(items => items?.trim() === "")) {
        throw new ApiError(404, "Incomplete information");
    }

    const index = await generateUniqueIndex(); // Generate a unique index

    const newQuestion = await Question.create({
        title,
        description,
        index,
    });

    if (!newQuestion) {
        throw new ApiError(404, "Question not created");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, newQuestion, "Question created successfully"));
});

const updateQuestion = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const updatedQuestion = await Question.update(req.body, {
        where: { id },
        returning: true,
        individualHooks: true
    });

    if (!updatedQuestion[1][0]) {
        throw new ApiError(404, "Question not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, updatedQuestion[1][0], "Updated successfully"));
});

const deleteQuestion = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const deleted = await Question.destroy({ where: { id } });

    if (!deleted) {
        throw new ApiError(404, "Question not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, "Question deleted successfully"));
});

const addPostToQuestionById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;

    if (!title || !description) {
        throw new ApiError(400, "Title or description missing");
    }

    const question = await Question.findByPk(id);

    if (!question) {
        throw new ApiError(404, "Question not found");
    }

    const thumbnailLocalPath = req.file?.path;

    if (!thumbnailLocalPath) {
        throw new ApiError(400, "Thumbnail path not found");
    }

    const { secure_url: thumbnailUrl } = await uploadOnCloudinary(thumbnailLocalPath);

    if (!thumbnailUrl) {
        throw new ApiError(400, "Failed to upload thumbnail to Cloudinary");
    }

    // Assuming 'posts' is an array of JSON objects in a TEXT or JSON field
    const posts = question.posts ? JSON.parse(question.posts) : [];
    posts.push({ title, description, thumbnail: thumbnailUrl });

    await question.update({
        posts: JSON.stringify(posts),
        numberofposts: posts.length
    });

    return res.status(200).json(new ApiResponse(200, question, "Post added successfully"));
});

export {
    getAllQuestions,
    getQuestionById,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    addPostToQuestionById,
    getQuestionByIndex,
};
