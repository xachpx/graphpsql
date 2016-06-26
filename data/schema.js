import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull
} from 'graphql';

import Db from './db';


const Post = new GraphQLObjectType({
  name: 'Post',
  description: 'Blog post',
  fields () {
    return {
      title: {
        type: GraphQLString,
        resolve (post) {
          return post.title;
        }
      },
      content: {
        type: GraphQLString,
        resolve (post) {
          return post.content;
        }
      },
      comment: {
        type: new GraphQLList(Comment),
        resolve (post) {
          return post.getComments();
        }
      }
    };
  }
});

const Comment = new GraphQLObjectType({
  name: 'Comment',
  description: 'This comment based by post ID',
  fields: () => {
    return {
      id: {
        type: GraphQLInt,
        resolve (comment) {
          return comment.id;
        }
      },
      content: {
        type: GraphQLString,
        resolve (comment) {
          return comment.content;
        }
      },
      posts: {
        type: new GraphQLList(Post),
        resolve (comment) {
          return comment.getPosts();
        }
      }
    };
  }
});

const Query = new GraphQLObjectType({
  name: 'Query',
  description: 'Root query object',
  fields: () => {
    return {
      Post: {
        type: new GraphQLList(Post),
        args: {
          id: {
            type: GraphQLInt
          },
          title: {
            type: GraphQLString
          }
        },
        resolve (root, args) {
          return Db.models.post.findAll({ where: args });
        }
      },
      comments: {
        type: new GraphQLList(Comment),
        resolve (root, args) {
          return Db.models.comment.findAll({ where: args });
        }
      }
    };
  }
});


const Schema = new GraphQLSchema({
  query: Query,
  // mutation: Mutation
});

export default Schema;