import {useState} from 'react'
import {useEffect} from 'react'
import yellowBlob from './blob-yellow.png'
import blueBlob from './blob-blue.png'
import {nanoid} from "nanoid"
import Question from "./Question"
import './App.css'

function App() {

  const [questions, setQuestions] = useState([])
  const [screen, setScreen] = useState("prompt")
  const [points, setPoints] = useState(0)
  const [toggleReset, setToggleReset] = useState(false)

  useEffect(() => {

    for (let i = 0; i < questions.length; i++) {

      let q = questions[i]
      let a = q.answersArr
      for (let j = 0; j < a.length; j++) {

        if (a[j].isSelected && (a[j].check === "correct")) {

          setPoints(prevPoints => prevPoints + 1)
        }
      }
    }

  }, [questions])

  useEffect(() => {

    async function getQs() {

      const res = await fetch("https://opentdb.com/api.php?amount=5&category=9&difficulty=easy&type=multiple")
      const data = await res.json()

      setQuestions(data.results.map(questionObject => {

        const correct_pos = Math.floor(Math.random() * 4)
        const answers_arr = []
        
        for (let i = 0, j = 0; i < 4; i++) {
            
            if (i === correct_pos) {
                
                answers_arr[i] = {
                    id: nanoid(), 
                    text: questionObject.correct_answer, 
                    isSelected: false, 
                    check : "none"
                }
            }
            
            else {
                
                answers_arr[i] = {
                    id: nanoid(), 
                    text: questionObject.incorrect_answers[j], 
                    isSelected: false, 
                    check : "none"
                }
                
                j++
            }
        }
        
        return {question: questionObject.question, correctAns: questionObject.correct_answer, answersArr: answers_arr}
      }))
    }

    getQs()

  }, [toggleReset])
  
  function toggleSelect(questionText, id) {

    setQuestions(prevQuestions => prevQuestions.map(q => {

      if (q.question === questionText) {

        return {

          question: q.question,
          correctAns: q.correctAns,
          answersArr: q.answersArr.map(a => {

            if (a.id === id) {

              return {

                id: a.id,
                text: a.text,
                isSelected: !a.isSelected,
                check: a.check
              }
            }

            else {

              return {

                id: a.id,
                text: a.text,
                isSelected: false,
                check: a.check
              }
            }
          })
        }
      }

      else {

        return q
      }
    }))
  }

  function checkAnswers() {
        
    setQuestions(prevQuestions => prevQuestions.map(q => {

      return {

        question: q.question,
        correctAns: q.correctAns,
        answersArr: (q.answersArr).map(a => {

          if (a.isSelected) {

            if (a.text === q.correctAns) {

              return {

                id: a.id,
                text: a.text,
                isSelected: a.isSelected,
                check: "correct"
              }
            }

            else {

              return {

                id: a.id,
                text: a.text,
                isSelected: a.isSelected,
                check: "incorrect"
              }
            }
          }

          else {

            return a
          }
        })
      }
    }))

    setScreen("end")
  }

  function startQuiz() {
        
    setScreen("start")
  }

  function playAgain() {
        
    setToggleReset(prevState => !prevState)
    setPoints(0)
    setScreen("prompt")    
  }

  return (

    <main>

      <img className = "yellow-blob" src = {yellowBlob}/>
      <img className = "blue-blob" src = {blueBlob}/>

      <div className = "main-container">

        {(screen === "prompt") ? 

          <div className = "title">
            <h1>Quizzical</h1> 
            <p className = "description">5 MCQs to test your general knowledge!</p>
            <button onClick = {startQuiz} className = "start-button">Start quiz</button> 
          </div> 

        :

        (screen === "start") ?

          <div>

            {
              questions.map(

                qObj => {

                  return <Question
                  
                    key = {qObj.question}
                    ask = {qObj.question}
                    options = {qObj.answersArr}
                    toggle = {toggleSelect}
                  />
                }
              )
            }

            <button onClick = {checkAnswers} className = "check-button">Check answers</button>

          </div>

          :

          <div>

            {
              questions.map(

                qObj => {

                  return <Question
                  
                    key = {qObj.question}
                    ask = {qObj.question}
                    options = {qObj.answersArr}
                    toggle = {toggleSelect}
                  />
                }
              )
            }
            
            <div className = "score-line">
              <p className = "end-msg">You scored {points}/5 correct answers</p>
              <button onClick = {playAgain} className = "again-button">Play again</button>
            </div>
          </div>

        }

      </div>

    </main>
  )
}

export default App
