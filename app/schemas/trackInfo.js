import { Schema } from 'normalizr';
import userSchema from './user';

const trackInfoSchema = new Schema('track_info');

trackInfoSchema.define({
    user: userSchema,
    from: userSchema
});

export default trackInfoSchema;