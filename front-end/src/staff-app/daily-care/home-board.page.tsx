import React, { useState, useEffect } from "react"
import styled from "styled-components"
import Button from "@material-ui/core/ButtonBase"
import TextField from "@material-ui/core/TextField"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Spacing, BorderRadius, FontWeight } from "shared/styles/styles"
import { Colors } from "shared/styles/colors"
import { CenteredContainer } from "shared/components/centered-container/centered-container.component"
import { Person } from "shared/models/person"
import { useApi } from "shared/hooks/use-api"
import { StudentListTile } from "staff-app/components/student-list-tile/student-list-tile.component"
import { ActiveRollOverlay, ActiveRollAction } from "staff-app/components/active-roll-overlay/active-roll-overlay.component"

export const HomeBoardPage: React.FC = () => {
  const [isRollMode, setIsRollMode] = useState(false)
  const [getStudents, data, loadState] = useApi<{ students: Person[] }>({ url: "get-homeboard-students" })
  const [isSorted, setSorted] = useState(false)
  const [sortedInfo, setSortedInfo] = useState([])
  const [searchKey, setSearchKey] = useState('');
  const [filteredData, setFilteredData] = useState(sortedInfo || data?.students)
  const [roleFilter, setRoleFilter] = useState("");
  const [attendance, setAttendance] = useState({
    // all: data?.students,
    present: [],
    late: [],
    absent: [],
  })
  const [defaultAttendanceColor, setDeafaultAttendanceColor] = useState ("unmark")
  
  useEffect(() => {
    void getStudents()
  }, [getStudents])


  const onToolbarAction = (action: ToolbarAction) => {
    if (action === "roll") {
      setIsRollMode(true)
    } else if (action === "sort" && loadState === "loaded") {
      const payload = (sortedInfo && sortedInfo.length > 0) ? sortedInfo : data?.students
      // console.log('-------_SORTED_INFO-------', sortedInfo?.length || 0)
      // console.log('-------DATA.STUDENTS-------', data?.students?.length || 0)
      // console.log('SORT_PAYLOAD', payload)
      const sortedData = isSorted ? sortedInfo.reverse() : mergeSort(payload)
      setSortedInfo(sortedData)
      setSorted(!isSorted)
      // console.log('------------IS_SORTED---------', isSorted)
    }
  }

  /**
   * @todo Change to switch
   */
  const onActiveRollAction = (action: ActiveRollAction) => {
    if (action === "exit") {
      setIsRollMode(false)
    }
    if (action === "exit") {
      setIsRollMode(false)
      alert("Completed")
    }
  }
  /**
   * @todo
   * MOve to utils
   */
  function merge(left: any, right: any) {
    let arr = []
    while (left.length && right.length) {
      if (left[0].first_name < right[0]?.first_name) {
        arr.push(left.shift())
      } else {
        arr.push(right.shift())
      }
    }
    // console.log("Final=====", [...arr, ...left, ...right])
    return [...arr, ...left, ...right]
  }
  function mergeSort(array: any): any {

    const half = array.length / 2

    // Base case or terminating case
    if (array.length < 2) {
      return array
    }

    const left = array.splice(0, half)
    return merge(mergeSort(left), mergeSort(array))
  }

  /**
   * @todo
   * Add helper for lowercase
   */
  const onInputChange = (e: any) => {
    var filterPayload: any = data?.students

    setSearchKey(e);

    console.log('----------_FILTER PAYLOAD----------', data?.students)
    filterPayload = filterPayload.filter((element: any) => {
      const { first_name, last_name } = element
      return first_name.toLowerCase().includes(e.toLowerCase()) || last_name.toLowerCase().includes(e.toLowerCase())

    });

    // setSortedInfo(filterPayload)
    console.log('-----__FILTERED ARRAY_______', filterPayload)
  }
  const rollData = [
    { type: "all", count: data?.students.length || sortedInfo.length },
    { type: "present", count: attendance?.present?.length || 0 },
    { type: "late", count: attendance?.late?.length || 0 },
    { type: "absent", count: attendance?.absent?.length || 0 },
  ]  
  /**
   * move to utils
   */
  function groupBy(array: any, key: string) {
    return array.reduce((hash: any, obj: any) => {
      if (obj[key] === undefined) return hash;
      return Object.assign(hash, { [obj[key]]: (hash[obj[key]] || []).concat(obj) })
    }, {})
  }
  const onAttendance = (state?: string, student?: any) => {
    console.log(state, student)
    var allStudentData = data?.students || student
    var tempFilter: any = []
    if (filteredData.length === 0) {
      tempFilter.push({ ...student, attendance: state })
      allStudentData && allStudentData.map((students: any) => {
        console.log(students.id,'-------', student.id)
        if(students.id === student.id) {
          return students["attendance"] = state;
        }
      });
    } else {
    
      tempFilter = filteredData.filter((e: any) => e?.id !== student?.id)
      tempFilter = [...tempFilter, { ...student, attendance: state }]

      allStudentData && allStudentData.map((students: any) => {
        console.log(students.id,'-------', student.id)
        if(students.id === student.id) {
          return students["attendance"] = state;
        }
      });
    }
    allStudentData.length > 0 && setSortedInfo(allStudentData)
    console.log('---------SORTEDINFO_______', allStudentData)

    
     setFilteredData(tempFilter)
    setAttendance(groupBy(tempFilter, "attendance"))
    // })

  }
  const iconClick = (value: any) => {
    switch (value) {
      case 'present':
        setRoleFilter("present")
        setDeafaultAttendanceColor('present')
        break;
      case 'late':
        setRoleFilter("late")
        setDeafaultAttendanceColor('late')
        break; 
      case 'absent':
        setRoleFilter("absent")
        setDeafaultAttendanceColor('absent')
        break;
        case 'all':
          setRoleFilter("all")
          setDeafaultAttendanceColor('unmark')
          break;
      default:
        break;
    }
  }


  var updatedPayload: any = [];
  var allData: any = [];
  console.log('---------ATTENDANCE--------', attendance)
  if (loadState === "loaded") {
    updatedPayload = sortedInfo.length > 0 ? sortedInfo : data?.students || [];
    allData = updatedPayload;



    if (searchKey.length > 0) {
      updatedPayload = updatedPayload.filter((element: any) => {
        const { first_name, last_name } = element
        const name = (`${first_name} ${last_name}`).toLowerCase()
        return name.includes(searchKey.toLowerCase())
      });
    }
    if(roleFilter.length > 0) {
      updatedPayload = (roleFilter === "present") ? attendance?.present : (roleFilter === "absent") ? attendance?.absent 
                        : (roleFilter === "late") ? attendance.late : updatedPayload
    }

    console.log('---------UPDATED PAYLOAD-------', updatedPayload)
    console.log('-----ALLDTA---', allData)
  }

  return (
    <>
      <S.PageContainer>
        <Toolbar onItemClick={onToolbarAction} onInputChange={onInputChange} />

        {loadState === "loading" && (
          <CenteredContainer>
            <FontAwesomeIcon icon="spinner" size="2x" spin />
          </CenteredContainer>
        )}
        {loadState === "loaded" && data?.students && (
          <>
            {
              updatedPayload.length > 0 ?
                updatedPayload.map((s: any) => (
                  <StudentListTile rollState={s.attendance} defaultState={defaultAttendanceColor} isRollMode={isRollMode} student={s} onAttendance={(state?: string, student?: Object) => onAttendance(state, student)} />
                ))
                :
                  <CenteredContainer>
                    <div>{`No Records Found`}</div>
                  </CenteredContainer>

              }
          </>
        )}

        {loadState === "error" && (
          <CenteredContainer>
            <div>Failed to load</div>
          </CenteredContainer>
        )}
      </S.PageContainer>
      <ActiveRollOverlay isActive={isRollMode} onItemClick={onActiveRollAction} rollData={rollData} onIconClick={(value: any)=>iconClick(value)} />
    </>
  )
}

type ToolbarAction = "roll" | "sort" | "search"
interface ToolbarProps {
  onItemClick: (action: ToolbarAction, value?: string) => void
  onInputChange: (value?: string) => any
}

const Toolbar: React.FC<ToolbarProps> = (props) => {
  const { onItemClick, onInputChange } = props
  return (
    <S.ToolbarContainer>
      <div onClick={() => onItemClick("sort")}>First Name</div>
      <div style={{ display: "flex" }}> <TextField onChange={(e) => { onInputChange(e.target.value) }} required style={{ backgroundColor: "#fff" }} /> &nbsp; <div style={{ display: "flex", justifyContent: "center", alignItems: "center", cursor: "pointer" }} onClick={() => onItemClick("search")}>Search</div></div>
      <S.Button onClick={() => onItemClick("roll")}>Start Roll</S.Button>
    </S.ToolbarContainer>
  )
}

const S = {
  PageContainer: styled.div`
    display: flex;
    flex-direction: column;
    width: 50%;
    margin: ${Spacing.u4} auto 140px;
  `,
  ToolbarContainer: styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    background-color: ${Colors.blue.base};
    padding: 6px 14px;
    font-weight: ${FontWeight.strong};
    border-radius: ${BorderRadius.default};
  `,
  Button: styled(Button)`
    && {
      padding: ${Spacing.u2};
      font-weight: ${FontWeight.strong};
      border-radius: ${BorderRadius.default};
    }
  `,
}
