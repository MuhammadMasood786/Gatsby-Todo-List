import React, { useEffect, useState } from "react"
import gql from 'graphql-tag'
import { useMutation, useQuery } from '@apollo/client'


const GET_TODOS = gql
  `
{
   todos {
        id,
        task,
       status
      }
}
`

const ADD_TODO = gql
  `
{
  mutation addTodo(task:String!){
    addTodo(task:$task){
      task
    }
  }
}
`

