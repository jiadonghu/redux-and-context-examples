import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import './App.css';


////////// Context Example

// const { useContext, useState, createContext } = React
// const AppContext = createContext()

// function useAppContext() {
//   const context = useContext(AppContext)
//   if (!context)
//     throw new Error('useAppContext must be used within AppProvider!')
//   return context
// }

// function AppProvider(props) {
//   // the count for our counter component
//   const [count, setCount] = useState(0)
//   // this message never changes!
//   const [message, setMessage] = useState('Hello from Context!')
//   const value = {
//     count,
//     setCount,
//     message,
//     setMessage
//   }
//   return <AppContext.Provider value={value} {...props} />
// }

// function Message() {
//   const { message } = useAppContext()
//   // the text will render to a random color for
//   // each instance of the Message component
//   const getColor = () => (Math.floor(Math.random() * 255))
//   const style = {
//     color: `rgb(${getColor()},${getColor()},${getColor()})`
//   }
//   return (
//     <div>
//       <h4 style={style}>{message}</h4>
//     </div>
//   )
// }

// function Count() {
//   const { count, setCount } = useAppContext()
//   return (
//     <div>
//       <h3>Current count from context: {count}</h3>
//       <button onClick={() => setCount(count + 1)}>Increment</button>
//     </div>
//   )
// }

// function App() {
//   return (
//     <div>
//       <AppProvider>
//         <h2>Re-renders! 😩</h2>
//         <Message />
//         <Message />
//         <Message />
//         <Count />
//       </AppProvider>
//     </div>
//   )
// }

////////// Redux Hook Example Peer Component

function Message() {
  const message = useSelector(state => state.counter.message);
  // the text will render to a random color for
  // each instance of the Message component
  const getColor = () => (Math.floor(Math.random() * 255))
  const style = {
    color: `rgb(${getColor()},${getColor()},${getColor()})`
  }
  return (
    <div>
      <h4 style={style}>{message}</h4>
    </div>
  )
}

function Count() {
  const dispatch = useDispatch();
  const count = useSelector(state => state.counter.counter);
  return (
    <div>
      <h3>Current count from context: {count}</h3>
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>Increment</button>
    </div>
  )
}

function App() {
  return (
    <div>
      <h2>Re-renders! 😩</h2>
      <Message />
      <Message />
      <Message />
      <Count />
    </div>
  )
}



////////// Redux Hook Example Child Component Re-render 

// function Message() {
//   const message = useSelector(state => state.counter.message);
//   // the text will render to a random color for
//   // each instance of the Message component
//   const getColor = () => (Math.floor(Math.random() * 255))
//   const style = {
//     color: `rgb(${getColor()},${getColor()},${getColor()})`
//   }
//   return (
//     <div>
//       <h4 style={style}>{message}</h4>
//     </div>
//   )
// }

// function Count() {
//   const dispatch = useDispatch();
//   const count = useSelector(state => state.counter.counter);
//   return (
//     <div>
//       <h3>Current count from context: {count}</h3>
//       <button onClick={() => dispatch({ type: 'INCREMENT' })}>Increment</button>
//       <Message />
//     </div>
//   )
// }

// function App() {
//   return (
//     <div>
//       <h2>Re-renders! 😩</h2>
//       <Message />
//       <Message />
//       <Count />
//     </div>
//   )
// }

export default App;
