import {Schema, arrayOf} from "normalizr";
import userSchema from "./user";

const trackInfoSchema = new Schema('feedInfo_entities');

trackInfoSchema.define({
    from_user: userSchema
});

export default trackInfoSchema;
