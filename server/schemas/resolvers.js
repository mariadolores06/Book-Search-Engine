const { User } = require("../models");
const { AuthenticationError } = require("apollo-server-express");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User
          .findOne({ _id: context.user._id })
          .select("-__v -password")
          .populate("books");
                
          return userData;
        };
        throw new AuthenticationError("You must be logged in!");
      },
    }, 

    Mutation: {
      login: async (parent, { email, password }) => {
        const user = await User.findOne({ email });
        if (!user) {
          throw new AuthenticationError("Incorrect login credentials!");
        };

        const correctPW = await user.isCorrectPassword(password);
          if (!correctPW) {
            throw new AuthenticationError("Incorrect login credentials!");
        };

        const token = signToken(user);
        return { token, user };
      },
        
      addUser: async (parent, args) => {
        try {
          const user = await User.create(args);
          const token = signToken(user);
          return { token, user };
        } catch (err) {
          console.log(err);
      }
      },

      saveBook: async (parent, args, context) => {
        if (context.user) {
          const updatedUser = await User.findByIdAndUpdate(
                { _id: context.user._id }, 
                { $addToSet: { savedBooks: args.input } },
                { new: true },
            );
              return updatedUser;
        }
        throw new AuthenticationError("You must be logged in to save books!");
      },

      removeBook: async (parent, args, context) => {
        if (context.user) {
          const updatedUser = await User.findOneAndUpdate(
            { _id: context.user._id },
            { $pull: { savedBooks: { bookId: args.bookId} } },
            { new: true },
          );
          return updatedUser;
        };
        throw new AuthenticationError("You must be logged in to delete books!");
      }
    },
};

module.exports = resolvers;