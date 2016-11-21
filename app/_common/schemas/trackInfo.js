import {Schema,arrayOf} from "normalizr";
import userSchema from "./user";
import trackSchema from "./track";

const trackInfoSchema = new Schema('feedInfo', { assignEntity: function (output, key, value, input) {
  return output;
}});

trackInfoSchema.define({
  from_user: userSchema
});

export default trackInfoSchema;
