from __future__ import print_function
import time
import requests
import json
from datetime import datetime
from dronekit import connect, VehicleMode, LocationGlobalRelative
from bson import json_util
import random

# Set up option parsing to get connection string
import argparse
parser = argparse.ArgumentParser(description='Commands vehicle using vehicle.simple_goto.')
parser.add_argument('--connect',
                    help="Vehicle connection target string. If not specified, SITL automatically started and used.")
args = parser.parse_args()

connection_string = args.connect
sitl = None

# Flag to track RTL mode
rtl_mode_ended = False

# Flight Start Time
flight_start_time = datetime.utcnow()

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
    url = 'http://172.23.32.1:5001/api/telemetry'
    headers = {'Content-Type': 'application/json'}
    response = requests.post(url, data=json.dumps(data, default=json_util.default), headers=headers, verify=False)
    if response.status_code == 200:
        print('Telemetry data sent successfully: ')
    else:
        print('Failed to send telemetry data: ')

def prepare_telemetry_init(vehicle, droneStatus, missionStatus):
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
    print("Live Telemetry: (DroneStatus: %s, MissionStatus: %s, Lat: %f, Long: %f, Alt: %f, BatteryLevel: %f, Speed: %f, GroundSpeed: %f, Heading: %d, Direction: %s, Pitch: %f, Roll: %f, Yaw: %f): " % (droneStatus, missionStatus,latitude, longitude, altitude, battery_level, speed, groundspeed, heading, get_direction(heading), pitch, roll, yaw))

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
        'drone_id': 'D001',
        'drone_status': droneStatus,
        'mission_id': 'M001',
        'mission_status': missionStatus,
        'telemetry': telemetry_data
    }
    send_telemetry(final_wrapper)

# Function to prepare telemetry data
def prepare_telemetry(vehicle, droneStatus, missionStatus):
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
        print("Live Telemetry: (DroneStatus: %s, MissionStatus: %s, Lat: %f, Long: %f, Alt: %f, BatteryLevel: %f, Speed: %f, GroundSpeed: %f, Heading: %d, Direction: %s, Pitch: %f, Roll: %f, Yaw: %f): " % (droneStatus, missionStatus,latitude, longitude, altitude, battery_level, speed, groundspeed, heading, get_direction(heading), pitch, roll, yaw))

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
            'drone_id': 'D001',
            'drone_status': droneStatus,
            'mission_id': 'M001',
            'mission_status': missionStatus,
            'telemetry': telemetry_data
        }
        # Send telemetry data to the backend
        send_telemetry(final_wrapper)

        time.sleep(2)
        cnt=cnt+2

# Callback function to handle mode change events
def mode_change_callback(self, attr_name, value):
    global rtl_mode_ended
    if value.name == 'AUTO':  # Change 'GUIDED' to the mode you expect after RTL
        rtl_mode_ended = True

# Add mode change callback
vehicle.add_attribute_listener('mode', mode_change_callback)

def arm_and_takeoff(aTargetAltitude):

    #Arms vehicle and fly to aTargetAltitude.
    print("Basic pre-arm checks")
    # Don't try to arm until autopilot is ready
    while not vehicle.is_armable:
        print(" Waiting for vehicle to initialise...")
        time.sleep(1)

    prepare_telemetry_init(vehicle, 'Connected', 'In Progress')

    print("Arming motors")
    # Copter should arm in GUIDED mode
    vehicle.mode = VehicleMode("GUIDED")
    vehicle.armed = True

    # Confirm vehicle armed before attempting to take off
    while not vehicle.armed:
        print(" Waiting for arming...")
        prepare_telemetry_init(vehicle, 'Connected', 'In Progress')
        time.sleep(1)

    print("Taking off!")
    vehicle.simple_takeoff(aTargetAltitude)  # Take off to target altitude
    prepare_telemetry_init(vehicle, 'Active', 'In Progress')
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

        prepare_telemetry_init(vehicle, 'Active', 'In Progress')

        # Break and return from function just below target altitude.
        if vehicle.location.global_relative_frame.alt >= aTargetAltitude * 0.95:
            print("Reached target altitude")
            break
        time.sleep(2)


arm_and_takeoff(20)

print("Set default/target airspeed to 10")
vehicle.airspeed = 10

print("Going towards first point for 30 seconds ...")
point1 = LocationGlobalRelative(37.33686072, -121.88083392, 20)
vehicle.simple_goto(point1)
prepare_telemetry(vehicle, 'Active', 'In Progress')

print("Going towards second point for 30 seconds (groundspeed set to 10 m/s) ...")
point2 = LocationGlobalRelative(37.33637771, -121.88198186, 20)
vehicle.simple_goto(point2, groundspeed=10)
prepare_telemetry(vehicle, 'Active', 'In Progress')

print("Going towards third point for 30 seconds (groundspeed set to 10 m/s) ...")
point3 = LocationGlobalRelative(37.33733782, -121.88273891, 20)
vehicle.simple_goto(point3, groundspeed=10)
prepare_telemetry(vehicle, 'Active', 'In Progress')

print("Going towards fourth point for 30 seconds (groundspeed set to 10 m/s) ...")
point4 = LocationGlobalRelative(37.33785447, -121.88176921, 20)
vehicle.simple_goto(point4, groundspeed=10)
prepare_telemetry(vehicle, 'Active', 'In Progress')

print("Returning to Launch")
vehicle.mode = VehicleMode("RTL")

# # Wait for RTL mode to end
# while not rtl_mode_ended:
#     prepare_telemetry(vehicle)
#     time.sleep(1)

while vehicle.armed:
    print(" Waiting for disarming...")
    prepare_telemetry_init(vehicle, 'Active', 'In Progress')
    time.sleep(1)

print("RTL mode ended")
prepare_telemetry_init(vehicle, 'Stopped', 'Completed')
# Close vehicle object before exiting script
print("Close vehicle object")
vehicle.close()