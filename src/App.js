import { useReducer } from 'react';
import DigitButton from './DigitButton';
import OperationButton from './OperationButton';
import './appCalc.scss';

export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CHOOSE_OPERATION: 'choose-operation',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-digit',
  EVALUATE: 'evaluate'
}

const INITIAL_STATE = {
  currentOperand: null,
  previousOperand: null,
  operation: null
};

function reducer(state = INITIAL_STATE, {type, payload}) {
  switch(type) {
    case ACTIONS.ADD_DIGIT: {
      if (payload.digit === '0' && state.currentOperand === '0') return state
      if (payload.digit === '.' && state.currentOperand != null && state.currentOperand.includes('.')) return state
      if (payload.digit !== '0' && state.currentOperand === '0')
      return {
        ...state,
        currentOperand: payload.digit,
      }
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`
      }
    }
    case ACTIONS.CHOOSE_OPERATION: {
      if ((state.previousOperand == null || state.previousOperand === "") && state.currentOperand == null) return state
      if (state.previousOperand == null || state.previousOperand === "") {
        return {
          ...state,
          operation: `${payload.operation}`,
          previousOperand: state.currentOperand,
          currentOperand: null
        }
      }
      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation
        }
      }
      return {
        ...state,
        // previousOperand: evaluate(state),
        operation: payload.operation
      }
    }
    case ACTIONS.EVALUATE: {
      if (state.operation === null || state.operation === undefined) {
        if(state.currentOperand === null) return state
        if (state.previousOperand === "" || (state.currentOperand !== null || state.currentOperand !== undefined || state.currentOperand !== "")) {
          return {
            ...state,
            previousOperand: state.currentOperand
          }
        } return state
      } else {
        if (state.previousOperand !== null && state.currentOperand !== null) {
          return {
            ...state,
            previousOperand: evaluate(state),
            operation: null,
            currentOperand: null
          }
        }
      }

      // if ((state.operation === null || state.operation === undefined) || (state.currentOperand === undefined || state.currentOperand === null || state.currentOperand === "0")) {
      //   return {
      //     ...state
      //   }
      // }
      // if (
      //   (state.operation !== null && state.currentOperand !== null && state.previousOperand === undefined) ||
      //   (state.operation !== null && state.previousOperand !== "" && state.currentOperand !== null && state.currentOperand !== undefined && state.currentOperand !== "")
      //   ) {
      //   return {
      //     ...state,
      //     previousOperand: state.currentOperand,
      //     currentOperand: null
      //   }
      // }
      // if (state.operation !== null && state.previousOperand !== null && state.currentOperand !== null) {
      //   return {
      //     ...state,
      //     previousOperand: evaluate(state),
      //     operation: null,
      //     currentOperand: null
      //   }
      // }
    }
    case ACTIONS.CLEAR: {
      // return {}
      return {
        ...state,
        currentOperand: '0',
        previousOperand: '',
        operation: null
      }
    }
    case ACTIONS.DELETE_DIGIT: {
      if(state.currentOperand != null) {
        return {
          ...state,
          currentOperand: state.currentOperand.slice(0, -1)
        }
      }
    }
    default:
      return state
  }
}

const evaluate = ({currentOperand, previousOperand, operation}) => {
  const prev = parseFloat(previousOperand)
  const current = parseFloat(currentOperand)
  if(isNaN(prev) || isNaN(current)) return ""
  let computation = ""
  switch(operation) {
    case '+':
      computation = prev + current
      break
    case '-':
      computation = prev - current
      break
    case '*':
      computation = prev * current
      break
    case '÷':
      computation = prev / current
      break
    default: break
  }
  return computation.toString()
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
})

function formatOperand(operand) {
  if (operand == null) return
  const [integer, decimal] = operand.split('.')
  if (decimal == null) return INTEGER_FORMATTER.format(integer)
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}

// dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit: 1 }});
function App() {
  const [{currentOperand, previousOperand, operation}, dispatch] = useReducer(reducer, {});
  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">{formatOperand(previousOperand)} {operation}</div>
        <div className="current-operand">{formatOperand(currentOperand)}</div>
      </div>
      <button className="span-two" onClick={() => dispatch({ type: ACTIONS.CLEAR })}>AC</button>
      <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>DEL</button>
      <OperationButton operation="÷" dispatch={dispatch} />
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <OperationButton operation="*" dispatch={dispatch} />
      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <OperationButton operation="+" dispatch={dispatch} />
      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <OperationButton operation="-" dispatch={dispatch} />
      <DigitButton digit="." dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />
      <button className="span-two" onClick={() => dispatch({ type: ACTIONS.EVALUATE })}>=</button>
    </div>
  );
}

export default App;
