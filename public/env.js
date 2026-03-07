window.__ENV__ = {
  VITE_IS_TEST: "false", // Set to "true" for testing, "false" for production

  // Base URLS for API
  VITE_API_URL_TEST: "https://localhost:7236",
  VITE_API_URL_PROD: "https://scanandknowback.onrender.com",

  // Endpoint URLS
  VITE_SIGNUP_ENDPOINT: "/api/User/SignUp",
  VITE_LOGIN_ENDPOINT: "/api/User/Login",
  VITE_GETUSERBYID_ENDPOINT: "/api/User/GetUserById", 
  VITE_GETDEPARTMENTS_ENDPOINT: "/api/User/GetDepartments",
  VITE_GETDEPARTMENTBYID_ENDPOINT: "/api/User/GetDepartmentById",
  VITE_GETPOSITIONS_ENDPOINT: "/api/User/GetPositions",
  VITE_GETROOMS_ENDPOINT: "/api/User/GetRooms",
  VITE_CREATESCHEDULE_ENDPOINT: "/api/User/CreateSchedule",
  VITE_GETSCHEDULES_ENDPOINT: "/api/User/GetSchedulesByUserId",
  VITE_GETAVAILABLEROOMS_ENDPOINT: "/api/User/GetAvailableRooms",
  VITE_UPDATESCHEDULEBYID_ENDPOINT: "/api/User/UpdateScheduleById",
  VITE_GETROOMBYID_ENDPOINT: "/api/User/GetRoomById",
  VITE_UPDATESTARTOREND_ENDPOINT: "/api/User/UpdateStartOrEnd",
}
