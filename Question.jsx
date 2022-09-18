import './Question.css'

function Question(props) {

  const mcqs = (props.options).map(option => {
    
        const styles = (() => {
            
            if (option.isSelected) {
                
                if (option.check === "correct") {
                    
                    return {backgroundColor: "#94D7A2", border: "none"}
                }
                
                else if (option.check === "incorrect") {
                    
                    return {backgroundColor: "#F8BCBC", border: "none"}
                }
                
                else {
                    
                    return {backgroundColor: "#D6DBF5", border: "none"}
                }
            }
            
            else {

                return {backgroundColor: "#F5F7FB", border: "1px solid #4D5B9E"}
            }
      })() 

      return <div 
        style = {styles}
        onClick = {() => props.toggle(props.ask, option.id)} 
        key = {option.id} 
        className = "mcq">
      {option.text}</div>    
    }
  )

  return (

    <div className = "question-container">
        <h2>{props.ask}</h2>
        <div className = "mcq-container">
            {mcqs}
        </div>
        <hr/>
    </div>
  )
}

export default Question
