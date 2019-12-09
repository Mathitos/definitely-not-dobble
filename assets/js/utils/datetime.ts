const getCurrentTime = (): string => {
  var currentdate = new Date()
  return `${currentdate.getHours()}: ${currentdate.getMinutes()}: ${currentdate.getSeconds()}`
}

export default {
  getCurrentTime,
}
