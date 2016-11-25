import {Schema} from "normalizr";
import userSchema from "./user";

const commentSchema = new Schema('comment_entities');

commentSchema.define({
    user: userSchema,
});

export default commentSchema;
