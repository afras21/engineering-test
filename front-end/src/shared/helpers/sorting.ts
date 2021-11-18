export const merge = (left: any, right: any) => {
  let arr = []
  while (left.length && right.length) {
    if (left[0].first_name < right[0]?.first_name) {
      arr.push(left.shift())
    } else {
      arr.push(right.shift())
    }
  }
  return [...arr, ...left, ...right]
}
export const mergeSort = (array: any): any => {

  const half = array.length / 2

  // Base case or terminating case
  if (array.length < 2) {
    return array
  }

  const left = array.splice(0, half)
  return merge(mergeSort(left), mergeSort(array))
}

