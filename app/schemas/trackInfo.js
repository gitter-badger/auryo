import { Schema } from 'normalizr';
import userSchema from './user';
import trackSchema from './track';

const trackInfoSchema = new Schema('track_info', { idAttribute: 'uuid' });

trackInfoSchema.define({
    user: userSchema,
    track: trackSchema
});

export default trackInfoSchema;