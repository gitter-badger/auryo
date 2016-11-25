import {Schema} from "normalizr";
import userSchema from "./user";

const trackSchema = new Schema('tracks');

trackSchema.define({
    user: userSchema,
    //publisher_metadata: new Schema('publisher_metadata',{idAttribute: "urn"})
});

export default trackSchema;
