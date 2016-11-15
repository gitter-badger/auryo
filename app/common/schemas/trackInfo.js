import {Schema,arrayOf} from "normalizr";
import userSchema from "./user";
import trackSchema from "./track";

const trackInfoSchema = new Schema('feedInfo', {idAttribute: "uuid"});

trackInfoSchema.define({
  user: userSchema,
  track: trackSchema
});

export default trackInfoSchema;
