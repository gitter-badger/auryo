import {Schema, arrayOf} from "normalizr";
import userSchema from "./user";
import trackSchema from "./track";

const playlistSchema = new Schema('playlists');

playlistSchema.define({
  user: userSchema,
  tracks: arrayOf(trackSchema)
});

export default playlistSchema;
