import { useReducer } from "react"
import './App.css';
import DigitButton from "./DigitButton"
import OperationButton from "./OperationButton";

export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CHOOSE_OPERATION: 'choose-operation',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-digit',
  EVALUATE: 'evaluate'
}

function reducer(state, {type,payload}){
  switch(type){
    case ACTIONS.ADD_DIGIT:
      if(state.overwrite){
        return{
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        }

      }
      if(payload.digit === "0" && state.currentOperand === "0") return state
      if(state.currentOperand == null && payload.digit == "."){
        return{
          ...state,
          currentOperand: `0${payload.digit}`
        }
      }
      if(payload.digit === "." && state.currentOperand.includes(".")) return state
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`
      }

    case ACTIONS.CLEAR:
      return {}

    case ACTIONS.DELETE_DIGIT:
      if(state.overwrite){
        return{
          ...state,
          overwrite: false,
          currentOperand: null
        }
      }
      if(state.currentOperand == null){
        return state
      }

      if(state.currentOperand.length === 1){
        return {
          ...state,
          currentOperand: null,
        }
      }
      return {
        ...state,
        currentOperand: state.currentOperand.slice(0,-1),
      }
    
    case ACTIONS.CHOOSE_OPERATION:
      if(state.currentOperand == null && state.previousOperand == null){
        return state
      }

      if(state.previousOperand == null) {
        return{
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null,
        }
      }

      if(state.currentOperand == null || state.currentOperand == "") {
        return{
          ...state,
          operation: payload.operation,
          previousOperand : state.previousOperand,
        }
      }

      return{
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null
      }
    
      case ACTIONS.EVALUATE:
        if(state.previousOperand == null || state.currentOperand == null || state.operation == null){
          return state
        }
        return{
          ...state,
          overwrite: true,
          previousOperand: null,
          operation: null,
          currentOperand: evaluate(state),
        }
  }
}

function evaluate({currentOperand, previousOperand, operation}) {
  const prev = parseFloat(previousOperand)
  const current = parseFloat(currentOperand)

  

  if (isNaN(prev) || isNaN(current)) return ""
  let computation = ""
  switch (operation){
    case "+":
      computation = prev + current
      break
    case "-":
      computation = prev - current
      break
    case "*":
      computation = prev * current
      break
    case "÷":
      computation = prev / current
      break
  }



   return computation.toFixed(fixTo(previousOperand,currentOperand,operation)).toString()
}

function fixTo(previousOperand,currentOperand,operation){
  const [intP,decimalP] = previousOperand.split('.')
  const [intC,decimalC] = currentOperand.split('.')
  if(operation == "+" || operation == "-"){
    if(decimalC == null && decimalP == null){
      return 0
    }
    if(decimalC == null){
      return decimalP.length
     }
    if (decimalP == null) {
      return decimalC.length
    }
    return Math.max(decimalC.length,decimalP.length)
  }
  if(operation == "*"){
    if(decimalC == null && decimalP == null){
      return 0
    }
    if(decimalC == null){
      return decimalP.length
     }
    if (decimalP == null) {
      return decimalC.length
    }
    return decimalC.length+decimalP.length
  }

  if(operation == "÷"){
    if(decimalP == null){
      return intC.length + 2
    }
    return decimalP.length + intC.length + 2
  }
  return 0
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-IN",{
  maximumFractionDigits: 0,
})

function formatOperand(operand) {
  if(operand == null) return
  const [integer,decimal] = operand.split('.')
  if(decimal == null) return INTEGER_FORMATTER.format(integer)
  return`${INTEGER_FORMATTER.format(integer)}.${decimal}`
}

function App() {
  const [{currentOperand, previousOperand, operation}, dispatch] = useReducer(
    reducer,
    {}
  )
    return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">
          {formatOperand(previousOperand)} {operation}
        </div>
        <div className="current-operand">
          {formatOperand(currentOperand)}
        </div>
      </div>

      <button 
        className="span-two"
        onClick={() => dispatch({type: ACTIONS.CLEAR})}
      >
        AC
      </button>
      <button onClick={() => dispatch({type: ACTIONS.DELETE_DIGIT})}
      >
        DEL
      </button>
      
      <OperationButton operation="÷" dispatch={dispatch}></OperationButton>  
      <DigitButton digit="1" dispatch={dispatch}></DigitButton>
      <DigitButton digit="2" dispatch={dispatch}></DigitButton>
      <DigitButton digit="3" dispatch={dispatch}></DigitButton>
      <OperationButton operation="*" dispatch={dispatch}></OperationButton>  
      <DigitButton digit="4" dispatch={dispatch}></DigitButton>
      <DigitButton digit="5" dispatch={dispatch}></DigitButton>
      <DigitButton digit="6" dispatch={dispatch}></DigitButton>
      <OperationButton operation="+" dispatch={dispatch}></OperationButton>  
      <DigitButton digit="7" dispatch={dispatch}></DigitButton>
      <DigitButton digit="8" dispatch={dispatch}></DigitButton>
      <DigitButton digit="9" dispatch={dispatch}></DigitButton>
      <OperationButton operation="-" dispatch={dispatch}></OperationButton>  
      <DigitButton digit="." dispatch={dispatch}></DigitButton>
      <DigitButton digit="0" dispatch={dispatch}></DigitButton>
      <button className="span-two" onClick={() => dispatch({type: ACTIONS.EVALUATE})}>=</button>
    </div>
  );
}

export default App;
