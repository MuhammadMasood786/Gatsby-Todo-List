const { ApolloServer, gql } = require('apollo-server-lambda')
const faunadb = require('faunadb'),
  q = faunadb.query
require('dotenv').config();

const typeDefs = gql`
  type Query {
    todos: [Todo!]
  }
  type Mutatuion{
    addTodo(task:String!):Todo
  }
  type Todo {
    id: ID!
    task: String!
    status: Boolean!
  }
`



const resolvers = {
  Query: {
    todos: async (context, args, roots) => {
      try {
        var adminClient = new faunadb.Client({ secret: process.env.FAUNADB_SECRET_KEY })
        const result = await adminClient.query(
          q.Map(
            q.Paginate(q.Match(q.Index('TodoList'))),
            q.Lambda(x => q.Get(x))
          )
        )

        console.log(result.data)
      } catch (error) {
        console.log(error)
      }
    }

  },
  Mutation: {
    addtodo: async (_, { task }) => {
      try {
        var adminClient = new faunadb.Client({ secret: process.env.FAUNADB_SECRET_KEY })
        const result = await adminClient.query(
          q.Create(
            q.Collection('todos'),
            {
              data: {
                task: task,
                state: true
              }
            }
          )
        )
        return result.ref.data
      } catch (error) {
        console.log(err)
      }
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

const handler = server.createHandler()

module.exports = { handler }
