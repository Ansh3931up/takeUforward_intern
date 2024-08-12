// utilities/generateUniqueIndex.js
import { Question } from "../module/Question.js";

const generateUniqueIndex = async () => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let index;

    do {
        index = '';
        for (let i = 0; i < 3; i++) {
            index += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
        }
        // Check if this index already exists in the database
        const existingQuestion = await Question.findOne({ index });
        if (!existingQuestion) break;
    } while (true);

    return index;
};

export default generateUniqueIndex;
