import * as mongoose from 'mongoose';
import { Schema, Document } from 'mongoose';
import { schemaOptions } from '../schema-default.options';
import { UserEntity } from './user.entity';

const userSchema = new Schema({
  firstName: Schema.Types.String,
  lastName: Schema.Types.String,
  email: Schema.Types.String,
  profilePicture: Schema.Types.String,
  tokens: [{
    providerId: Schema.Types.String,
    provider: Schema.Types.String,
    accessToken: Schema.Types.String,
    refreshToken: Schema.Types.String,
    valid: Schema.Types.Boolean,
    lastUsed: Schema.Types.Date
  }],
  password: Schema.Types.String,
  backofficeUser: {
    type: Schema.Types.Boolean,
    default: false
  },

  bio: Schema.Types.String,
  raw: Schema.Types.Mixed,
  location: Schema.Types.String,
  blog: Schema.Types.String,
  metadata: {
    company: Schema.Types.String,
    githubProfile: Schema.Types.String,
    githubFollowers: Schema.Types.Number,
    githubFollowing: Schema.Types.Number,
    githubPublicRepos: Schema.Types.Number,
    hireable: Schema.Types.String
  },
  starredRepos: [{
    name: Schema.Types.String,
    login: Schema.Types.String,
    url: Schema.Types.String,
    logo: Schema.Types.String,
    description: Schema.Types.String,
    stars: Schema.Types.Number,
    subscribed: {
      type: Schema.Types.Boolean,
      default: false
    }
  }]
}, schemaOptions);

export interface IUserDocument extends UserEntity, Document {
  _id: string;
}

export const User = mongoose.models.User || mongoose.model<IUserDocument>('User', userSchema);
