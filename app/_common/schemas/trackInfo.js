import {Schema, arrayOf} from "normalizr";
import userSchema from "./user";

const trackInfoSchema = new Schema('feedInfo');

trackInfoSchema.define({
    from_user: userSchema
});

export default trackInfoSchema;
