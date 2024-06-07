from __future__ import print_function
import time
import requests
import json
from datetime import datetime
from dronekit_sitl import SITL
from dronekit import connect, VehicleMode, LocationGlobalRelative
from bson import json_util
import random
import argparse

# Set up option parsing to get connection string
parser = argparse.ArgumentParser(description='Commands vehicle using vehicle.simple_goto.')
parser.add_argument('--connect', help="Vehicle connection target string. If not specified, SITL automatically started and used.")
parser.add_argument('--mission_id', help="Mission ID for which the simulation is to be started.")
args = parser.parse_args()

connection_string = args.connect
mission_id = args.mission_id

# Fetch mission details from the database based on the provided mission ID
# Example: You need to implement this part based on your database setup
def fetch_mission_details_from_database(mission_id):
    # Make a GET request to the API endpoint
    url = "http://172.27.80.1:5001/api/getonemission1/{}".format(mission_id)
    response = requests.get(url)

    # Check if the request was successful (status code 200)
    if response.status_code == 200:
        # Extract mission details from the response JSON
        mission_details = response.json()
        return mission_details
    else:
        # If request fails, print an error message and return None
        print("Failed to fetch mission details for mission ID {}. Status code: {}".format(mission_id, response.status_code))
        return None

mission_details = fetch_mission_details_from_database(mission_id)
# print(mission_details)
drone_id = mission_details[0]['drone_id']
# waypoint_0_lat = mission_details[0]["mission_waypoints"][0]['Latitude']
# sitl = None
sitl = SITL()
sitl.download('copter', '3.3', verbose=True)
sitl_args = ['-I0', '--model', 'quad', '--home=51.945102,-2.074558,0,180']
sitl.launch(sitl_args, await_ready=True, restart=True)

# Flag to track RTL mode
rtl_mode_ended = False

# Connect to the Vehicle
print('Connecting to vehicle on: %s' % connection_string)
vehicle = connect(connection_string, wait_ready=True)

# Function to get direction
def get_direction(heading):
    sectors = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
    index = int(round(heading / (360. / len(sectors))))
    return sectors[index % len(sectors)]

# Function to send telemetry data to the backend
def send_telemetry(data):
    url = 'http://172.27.80.1:5001/api/telemetry/{}'.format(mission_id)
    headers = {'Content-Type': 'application/json'}
    response = requests.post(url, data=json.dumps(data, default=json_util.default), headers=headers, verify=False)
    if response.status_code == 200:
        print('Telemetry data sent successfully.')
    else:
        print('Failed to send telemetry data.')

# Function to send live notifications data to the backend
def send_notification(data):
    url = 'http://172.27.80.1:5001/api/notification/{}'.format(mission_id)
    headers = {'Content-Type': 'application/json'}
    response = requests.post(url, data=json.dumps(data, default=json_util.default), headers=headers, verify=False)
    if response.status_code == 200:
        print('Notification sent successfully.')
    else:
        print('Failed to send the notification.')

def prepare_notification(message, msg_category, mav_command, msg_severity):
    notification_data = {
        'mission_id': mission_id,
        'message': message,
        'msg_category': msg_category,
        'mav_command': mav_command,
        'msg_severity': msg_severity,
        'timestamp': datetime.utcnow()
    }
    # send_notification(notification_data)

def prepare_telemetry_init(vehicle, drone_id, mission_id, droneStatus, missionStatus):
    latitude = 0.0 if vehicle.location.global_frame.lat == None else vehicle.location.global_frame.lat
    longitude = 0.0 if vehicle.location.global_frame.lon == None else vehicle.location.global_frame.lon
    altitude = 0.0 if vehicle.location.global_frame.alt == None else vehicle.location.global_frame.alt
    battery_level = 0.0 if vehicle.battery.level == None else vehicle.battery.level
    battery_voltage = 0.0 if vehicle.battery.voltage == None else vehicle.battery.voltage
    battery_current = 0.0 if vehicle.battery.current == None else vehicle.battery.current
    speed = 0.0 if vehicle.airspeed == None else vehicle.airspeed
    groundspeed = 0.0 if vehicle.groundspeed == None else vehicle.groundspeed
    heading = 0 if vehicle.heading == None else vehicle.heading
    pitch = 0.0 if vehicle.attitude.pitch == None else vehicle.attitude.pitch
    roll = 0.0 if vehicle.attitude.roll == None else vehicle.attitude.roll
    yaw = 0.0 if vehicle.attitude.yaw == None else vehicle.attitude.yaw
    print("Live Telemetry: (MissionID: %s, DroneStatus: %s, MissionStatus: %s, Lat: %f, Long: %f, Alt: %f, BatteryLevel: %f, Speed: %f, GroundSpeed: %f, Heading: %d, Direction: %s, Pitch: %f, Roll: %f, Yaw: %f): " % (mission_id, droneStatus, missionStatus,latitude, longitude, altitude, battery_level, speed, groundspeed, heading, get_direction(heading), pitch, roll, yaw))

    telemetry_data = {
        'location': {
            'latitude': latitude,
            'longitude': longitude,
            'altitude': altitude
        },
        'position': {
            'heading': heading,
            'direction': get_direction(heading),
            'pitch': pitch,
            'roll': roll,
            'yaw': yaw
        },
        'velocity': {
            'airspeed': speed,
            'groundspeed': groundspeed,
            'velocityX': 0.0 if vehicle.velocity[0] == None else vehicle.velocity[0],
            'velocityY': 0.0 if vehicle.velocity[1] == None else vehicle.velocity[1],
            'velocityZ': 0.0 if vehicle.velocity[2] == None else vehicle.velocity[2]
        },
        'iot': {
            'temperature': random.uniform(20, 30),  # Simulated temperature data
            'humidity': random.uniform(40, 60),     # Simulated humidity data
            'pressure': random.uniform(950, 1050),  # Simulated pressure data
            'soundLevel': random.uniform(40, 80),   # Simulated sound level data
            'battery': battery_level
        },
        'health': {
            'flightTime': (datetime.utcnow() - flight_start_time).total_seconds(),
            'motorPerformance': random.uniform(0, 100),  # Simulated motor performance data
            'propellerCondition': random.uniform(0, 100),  # Simulated propeller condition data
            'cameraHealth': 'Good',  # Simulated camera health data
            'batteryvoltage': battery_voltage,  # Simulated voltage level data
            'batterycurrent': battery_current,     # Simulated current draw data
            'signalStrength': random.uniform(0, 100)  # Simulated signal strength data
        },
        'timestamp': datetime.utcnow()
    }

    final_wrapper = {
        'drone_id': drone_id,
        'drone_status': droneStatus,
        'mission_id': mission_id,
        'mission_status': missionStatus,
        'telemetry': telemetry_data
    }
    # send_telemetry(final_wrapper)

# Function to prepare telemetry data
def prepare_telemetry(vehicle, drone_id, mission_id, aTargetAltitude, droneStatus, missionStatus):
    cnt = 0
    while cnt<=30:
        latitude = 0.0 if vehicle.location.global_frame.lat == None else vehicle.location.global_frame.lat
        longitude = 0.0 if vehicle.location.global_frame.lon == None else vehicle.location.global_frame.lon
        altitude = 0.0 if vehicle.location.global_frame.alt == None else vehicle.location.global_frame.alt
        battery_level = 0.0 if vehicle.battery.level == None else vehicle.battery.level
        battery_voltage = 0.0 if vehicle.battery.voltage == None else vehicle.battery.voltage
        battery_current = 0.0 if vehicle.battery.current == None else vehicle.battery.current
        speed = 0.0 if vehicle.airspeed == None else vehicle.airspeed
        groundspeed = 0.0 if vehicle.groundspeed == None else vehicle.groundspeed
        heading = 0 if vehicle.heading == None else vehicle.heading
        pitch = 0.0 if vehicle.attitude.pitch == None else vehicle.attitude.pitch
        roll = 0.0 if vehicle.attitude.roll == None else vehicle.attitude.roll
        yaw = 0.0 if vehicle.attitude.yaw == None else vehicle.attitude.yaw
        print("Live Telemetry: (MissionID: %s, DroneStatus: %s, MissionStatus: %s, Lat: %f, Long: %f, Alt: %f, BatteryLevel: %f, Speed: %f, GroundSpeed: %f, Heading: %d, Direction: %s, Pitch: %f, Roll: %f, Yaw: %f): " % (mission_id, droneStatus, missionStatus,latitude, longitude, altitude, battery_level, speed, groundspeed, heading, get_direction(heading), pitch, roll, yaw))

        telemetry_data = {
            'location': {
                'latitude': latitude,
                'longitude': longitude,
                'altitude': altitude
            },
            'position': {
                'heading': heading,
                'direction': get_direction(heading),
                'pitch': pitch,
                'roll': roll,
                'yaw': yaw
            },
            'velocity': {
                'airspeed': speed,
                'groundspeed': groundspeed,
                'velocityX': 0.0 if vehicle.velocity[0] == None else vehicle.velocity[0],
                'velocityY': 0.0 if vehicle.velocity[1] == None else vehicle.velocity[1],
                'velocityZ': 0.0 if vehicle.velocity[2] == None else vehicle.velocity[2]
            },
            'iot': {
                'temperature': random.uniform(20, 30),  # Simulated temperature data
                'humidity': random.uniform(40, 60),     # Simulated humidity data
                'pressure': random.uniform(950, 1050),  # Simulated pressure data
                'soundLevel': random.uniform(40, 80),   # Simulated sound level data
                'battery': battery_level
            },
            'health': {
                'flightTime': round((datetime.utcnow() - flight_start_time).total_seconds()),
                'motorPerformance': random.uniform(0, 100),  # Simulated motor performance data
                'propellerCondition': random.uniform(0, 100),  # Simulated propeller condition data
                'cameraHealth': 'Good',  # Simulated camera health data
                'batteryvoltage': battery_voltage,  # Simulated voltage level data
                'batterycurrent': battery_current,     # Simulated current draw data
                'signalStrength': random.uniform(0, 100)  # Simulated signal strength data
            },
            'timestamp': datetime.utcnow()
        }

        final_wrapper = {
            'drone_id': drone_id,
            'drone_status': droneStatus,
            'mission_id': mission_id,
            'mission_status': missionStatus,
            'telemetry': telemetry_data
        }
        
        # Send telemetry data to the backend
        # send_telemetry(final_wrapper)

        # while True:
        #     print(" Altitude: ", vehicle.location.global_relative_frame.alt)
            
        #     # telemetry_data = {
        #     #     'latitude': vehicle.location.global_relative_frame.lat,
        #     #     'longitude': vehicle.location.global_relative_frame.lon,
        #     #     'altitude': vehicle.location.global_relative_frame.alt,
        #     #     'battery': vehicle.battery.level,
        #     #     'speed': vehicle.airspeed,
        #     #     'timestamp': datetime.utcnow()
        #     # }
        #     # # Send telemetry data to the backend
        #     # send_telemetry(telemetry_data)

        #     # prepare_telemetry_init(vehicle, drone_id, mission_id, 'Active', 'In Progress')

        #     # Break and return from function just below target altitude.
        #     if vehicle.location.global_relative_frame.alt >= aTargetAltitude * 0.95:
        #         # print("Reached target altitude")
        #         # prepare_notification("Reached Target Altitude", "Navigation", "GLOBAL_POSITION_INT", 0)
        #         break
        #     time.sleep(2)

        time.sleep(2)
        cnt=cnt+2

# Callback function to handle mode change events
def mode_change_callback(self, attr_name, value):
    global rtl_mode_ended
    if value.name == 'AUTO':  # Change 'GUIDED' to the mode you expect after RTL
        rtl_mode_ended = True

# Add mode change callback
vehicle.add_attribute_listener('mode', mode_change_callback)

# Function to arm and takeoff
def arm_and_takeoff(aTargetAltitude):
    
    #Arms vehicle and fly to aTargetAltitude.
    print("Basic pre-arm checks")
    prepare_notification("Initializing the Vehicle", "Control", "MAV_SYS_STATUS_PREARM_CHECK", 0)
    # Don't try to arm until autopilot is ready
    while not vehicle.is_armable:
        print(" Waiting for vehicle to initialise...")
        time.sleep(1)

    prepare_telemetry_init(vehicle, drone_id, mission_id, 'Connected', 'In Progress')
    prepare_notification("Arming the Vehicle", "Control", "MAV_MODE_GUIDED_ARMED", 0)

    print("Arming motors")
    # Copter should arm in GUIDED mode
    vehicle.mode = VehicleMode("GUIDED")
    vehicle.armed = True

    # Confirm vehicle armed before attempting to take off
    while not vehicle.armed:
        print(" Waiting for arming...")
        prepare_telemetry_init(vehicle, drone_id, mission_id, 'Connected', 'In Progress')
        time.sleep(1)

    print("Taking off!")
    prepare_notification("Take Off Initiated from Deck Station", "Control", "MAV_CMD_NAV_TAKEOFF", 0)
    vehicle.simple_takeoff(aTargetAltitude)  # Take off to target altitude
    prepare_telemetry_init(vehicle, drone_id, mission_id, 'Active', 'In Progress')
    # Wait until the vehicle reaches a safe height before processing the goto
    #  (otherwise the command after Vehicle.simple_takeoff will execute
    #   immediately).
    while True:
        print(" Altitude: ", vehicle.location.global_relative_frame.alt)
        
        # telemetry_data = {
        #     'latitude': vehicle.location.global_relative_frame.lat,
        #     'longitude': vehicle.location.global_relative_frame.lon,
        #     'altitude': vehicle.location.global_relative_frame.alt,
        #     'battery': vehicle.battery.level,
        #     'speed': vehicle.airspeed,
        #     'timestamp': datetime.utcnow()
        # }
        # # Send telemetry data to the backend
        # send_telemetry(telemetry_data)

        prepare_telemetry_init(vehicle, drone_id, mission_id, 'Active', 'In Progress')

        # Break and return from function just below target altitude.
        if vehicle.location.global_relative_frame.alt >= aTargetAltitude * 0.95:
            print("Reached target altitude")
            prepare_notification("Reached Target Altitude", "Navigation", "GLOBAL_POSITION_INT", 0)
            break
        time.sleep(2)

# Function to navigate through waypoints
def navigate_to_waypoints(waypoints):
    for i in range(1, len(waypoints)):
        waypoint = waypoints[i]
        print(waypoint)
        point = LocationGlobalRelative(waypoint['latitude'], waypoint['longitude'], waypoint['altitude'])

        print("Going towards waypoint {} for 30 seconds ...".format(i))
        prepare_notification("Going Towards Waypoint {}".format(i), "Control", "MAV_CMD_NAV_WAYPOINT", 0)
        vehicle.simple_goto(point, waypoint['speed'])
        prepare_telemetry(vehicle, drone_id, mission_id, waypoint['altitude'], 'Active', 'In Progress')

        camera_action = waypoint['camera_actions']
        if camera_action == 1:
            prepare_notification("Image Captured At Waypoint {}".format(i), "Action", "CAMERA_IMAGE_CAPTURED", 0)
        elif camera_action == 2:
            prepare_notification("Video Capture Started At Waypoint {}".format(i), "Action", "CAMERA_VIDEO_CAPTURE_START", 0)
        elif camera_action == 3:
            prepare_notification("Video Capture Ended At Waypoint {}".format(i), "Action", "CAMERA_VIDEO_CAPTURE_END", 0)

        cnt = 0
        while cnt <= 20:
            time.sleep(1)
            cnt += 2

# Function to return to launch
def return_to_launch():
    print("Returning to Launch")
    prepare_notification("Returning to Deck Station", "Control", "MAV_CMD_NAV_RETURN_TO_LAUNCH", 0)
    vehicle.mode = VehicleMode("RTL")

    time.sleep(2)
    prepare_notification("Disarming the Vehicle", "Control", "MAV_MODE_GUIDED_DISARMED", 0)
    while vehicle.armed:
        print(" Waiting for disarming...")
        prepare_telemetry_init(vehicle, drone_id, mission_id, 'Active', 'In Progress')
        time.sleep(1)

    print("RTL mode ended")
    prepare_notification("Vehicle Landed", "Control", "MAV_CMD_NAV_LAND", 0)
    prepare_telemetry_init(vehicle, drone_id, mission_id, 'Stopped', 'Completed')
    # Close vehicle object before exiting script
    print("Close vehicle object")

# Your mission execution starts here
# Flight Start Time
flight_start_time = datetime.utcnow()
# arm_and_takeoff(mission_details[0]["mission_waypoints"][0]['altitude'])
arm_and_takeoff(20)

print("Set default/target airspeed to 10")
prepare_notification("Airspeed Set to 10m/s", "Navigation", "MAV_CMD_DO_CHANGE_SPEED", 0)
vehicle.airspeed = 10

navigate_to_waypoints(mission_details[0]["mission_waypoints"])

return_to_launch()

# Close vehicle object before exiting script
vehicle.close()
