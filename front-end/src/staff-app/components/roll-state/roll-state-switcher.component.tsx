import React, { useState } from "react"
import { RolllStateType } from "shared/models/roll"
import { RollStateIcon } from "staff-app/components/roll-state/roll-state-icon.component"

interface Props {
  initialState?: RolllStateType
  size?: number,
  defaultState: RolllStateType,
  onStateChange?: (newState: RolllStateType) => void
}
export const RollStateSwitcher: React.FC<Props> = ({ defaultState, size = 40, onStateChange }) => {
  // console.log("IM  DEFAULT -----",defaultState)
  const [rollState, setRollState] = useState(defaultState)


  const nextState = () => {
    const states: RolllStateType[] = ["present", "late", "absent"]
    if (rollState === "unmark" || rollState === "absent") return states[0]
    const matchingIndex = states.findIndex((s) => s === rollState)
    return matchingIndex > -1 ? states[matchingIndex + 1] : states[0]
  }

  const onClick = () => {
    const next = nextState()
    setRollState(next)
    if (onStateChange) {
      onStateChange(next)
    }
  }
  const stateColor = defaultState !== "unmark" ? defaultState : rollState
  return <RollStateIcon type={stateColor} size={size} onClick={onClick} />
}
