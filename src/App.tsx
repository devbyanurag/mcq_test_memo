import { useState } from 'react'
import QuizApp from './components/QuizApp'

const App = () => {
  const [show, setShow] = useState('')
  return (
    <div>
      {show!="anurag"&&<h1>Enter the Code</h1>}
      <input type="text" onChange={e=>setShow(e.target.value.toLowerCase())}/>
    {
      show=="anurag" && <QuizApp/>
    }

    </div>
  )
}

export default App