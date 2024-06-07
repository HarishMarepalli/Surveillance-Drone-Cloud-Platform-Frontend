export const BASE_URL = "https://dronecloudbackend.adaptable.app";
// export const BASE_URL = "http://localhost:5001";
export const API_ENDPOINTS = {

    //mission-menu-manager.js
    createUpdateMissionPlan: "/api/createMissionPlanNew",
    //cesium.js, modifyMission/index.jsx
    getOneMissionForPlanner: "/api/getonemissionforplanner",
    //LoginPage.js
    getUserProfile: "/api/getuserProfile",
    login: "/api/login",
    //MapBoxDynamic.jsx
    getLineCoordsForMission: "/api/getlinecoordsformission",
    //MissionDetailsCard.jsx
    getMissionsForUser: "/api/getmissionsforuser",
    //addMap/index.jsx, addMap2/index.jsx
    addMap: "/api/addMap",
    //createDrone/index.jsx
    addDrone: "/api/adddrone",
    //createMission/index.jsx, modifyMission/index.jsx
    getServiceTypesForAllDrones: "/api/getservicetypesforalldrones1",
    //createMission2/index.jsx, deleteMapByName/index.jsx
    getAllMaps: "/api/getAllMaps",
    createMissionPlan: "/api/createMissionPlan",
    //createSchedule/index.jsx
    fetchMissionOptions: "/api/missionOptions",
    fetchDroneOptions: "/api/droneOptions",
    addSchedule: "/api/addschedule",
    //dashboard/index.jsx
    countDrones: "/api/countdrones",
    countUsers: "/api/countusers",
    countMissions: "/api/countmissions",
    getAllMissionPlans: "/api/getAllMissionPlans",
    //deleteAllMaps/index.jsx
    deleteAllMaps: "/api/deleteAllMaps",
    //deleteAllMissions/index.jsx
    deleteAllMissionPlans: "/api/deleteAllMissionPlans",
    //deleteMapByName/index.jsx
    deleteMapByName: "/api/deleteMapByName",
    //deleteMissionById/index.jsx
    deleteMissionPlanById: "/api/deleteMissionPlanById",
    //EditDrone/index.jsx
    getDrones: "/api/drones",
    //EditSchedule/index.jsx
    getSchedules: "/api/schedules",
    //missionDashboard/index.jsx
    getAllMissionsForGivenUser: "/api/getallmissionsforgivenuser",
    //trackingConfiguration/index.jsx
    configureTracking: "/api/configuretracking",
    getConfiguredTracking: "/api/getconfiguredtracking",
    //trackingDashboard/index.jsx
    getAllDronesPerUserForMap: "/api/getalldronesperuserformap",
    getRecentNotifications : "/api/getrecentnotifications",
    //trackingDrone/index.jsx
    getOneDrone: "/api/getonedrone1",
    getOneMission: "/api/getonemission1",
    getNotificationsForMission: "/api/getnotificationsformission",
    //VideoDashboard.js, VideoDashboard2.js
    videoList: "/api/videoList",
    getVideos: "/api/videos",
    //VideoUpload.js
    videoUpload: "/api/upload",
    //viewDrone/index.jsx
    getAllDrones: "/api/getalldrones1",
    //viewDrone2/index.jsx
    viewDrone : "/api/viewdrone",
    //viewMissions/index.jsx
    deleteMissionForUser: "/api/deletemissionforuser",
    deleteConfigurationForMission: "/api/deleteconfigurationformission",
    deleteNotificationsForMission: "/api/deletenotificationsformission",
    //viewSchedules/index.jsx
    viewSchedules: "/api/viewschedule",
    //RegisterPage.js
    signUp: "/api/signup",
  // Add more API endpoints here as needed
};
