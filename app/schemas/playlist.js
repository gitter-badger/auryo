import {Schema} from 'normalizr';
import userSchema from './user';
import trackSchema from './track';

const playlistSchema = new Schema('playlists');

playlistSchema.define({
    user: userSchema,
    track:trackSchema
});

export default playlistSchema;