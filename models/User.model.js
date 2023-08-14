const { Schema, model } = require('mongoose')

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true
    },
    email: {
      type: String,
      unique: true,
      required: true
    },
    password: String,
    avatar: {
      type: String,
      default: 'https://i.stack.imgur.com/l60Hf.png'
    },
    role: {
      type: String,
      enum: ['USER', 'ADMIN'],
      default: 'USER'
    },

    favs: [{
      type: Schema.Types.ObjectId,
      ref: 'Recipe'
    }],
    bio: {
      type: String, default: "bio missing"
    }
  },
  {
    timestamps: true
  }
);


module.exports = model('User', userSchema)