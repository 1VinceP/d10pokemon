import React, { Component } from 'react';
import Axios from 'axios';

class Fun extends Component {
   constructor() {

      this.state = {
         todos: [1, 2, 3, 4, 5, 6],
         filteredTodos: [1, 2, 3, 4, 5, 6],
      }
   }

   componentDidMount() {
      this.getTodos()

      this.setState({
         todos: Data,
         filteredTodos: data
      })
   }

   filterActive() {}

   filterCompoleted() {}

   delete() {

      this.getTodos()
   }

   anotherone() {
      this.getTodos()
   }

   getTodos() {
      Axios.get()
   }

   render() {
      const list = this.state.filteredTodos.map...
      return (
         <div>{list}</div>
      )
   }
}