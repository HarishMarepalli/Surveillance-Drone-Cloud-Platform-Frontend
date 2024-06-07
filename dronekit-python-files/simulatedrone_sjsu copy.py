from __future__ import print_function
import time
import requests
import json
from datetime import datetime
from dronekit import connect, VehicleMode, LocationGlobalRelative
from bson import json_util

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

# Connect to the Vehicle
print('Connecting to vehicle on: %s' % connection_string)
vehicle = connect(connection_string, wait_ready=True)

# Function to send telemetry data to the backend
def send_telemetry(data):
    url = 'http://172.19.112.1:5001/api/telemetry'
    headers = {'Content-Type': 'application/json'}
    response = requests.post(url, data=json.dumps(data, default=json_util.default), headers=headers, verify=False)
    if response.status_code == 200:
        print('Telemetry data sent successfully: ')
    else:
        print('Failed to send telemetry data: ')

# Function to prepare telemetry data
def prepare_telemetry(vehicle):
    cnt = 0
    while cnt<=30:
        latitude = vehicle.location.global_frame.lat
        longitude = vehicle.location.global_frame.lon
        altitude = vehicle.location.global_frame.alt
        battery_level = vehicle.battery.level
        speed = vehicle.airspeed
        print("Live Telemetry: (Lat: %f, Long: %f, Alt: %f, Battery: %f, Speed: %f): " % (latitude, longitude, altitude, battery_level, speed))

        telemetry_data = {
            'latitude': vehicle.location.global_relative_frame.lat,
            'longitude': vehicle.location.global_relative_frame.lon,
            'altitude': vehicle.location.global_relative_frame.alt,
            'battery': vehicle.battery.level,
            'speed': vehicle.airspeed,
            'timestamp': datetime.utcnow()
        }
        # Send telemetry data to the backend
        send_telemetry(telemetry_data)

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

    print("Arming motors")
    # Copter should arm in GUIDED mode
    vehicle.mode = VehicleMode("GUIDED")
    vehicle.armed = True

    # Confirm vehicle armed before attempting to take off
    while not vehicle.armed:
        print(" Waiting for arming...")
        time.sleep(1)

    print("Taking off!")
    vehicle.simple_takeoff(aTargetAltitude)  # Take off to target altitude

    # Wait until the vehicle reaches a safe height before processing the goto
    #  (otherwise the command after Vehicle.simple_takeoff will execute
    #   immediately).
    while True:
        print(" Altitude: ", vehicle.location.global_relative_frame.alt)
        
        telemetry_data = {
            'latitude': vehicle.location.global_relative_frame.lat,
            'longitude': vehicle.location.global_relative_frame.lon,
            'altitude': vehicle.location.global_relative_frame.alt,
            'battery': vehicle.battery.level,
            'speed': vehicle.airspeed,
            'timestamp': datetime.utcnow()
        }
        # Send telemetry data to the backend
        send_telemetry(telemetry_data)

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
prepare_telemetry(vehicle)

print("Going towards second point for 30 seconds (groundspeed set to 10 m/s) ...")
point2 = LocationGlobalRelative(37.33637771, -121.88198186, 20)
vehicle.simple_goto(point2, groundspeed=10)
prepare_telemetry(vehicle)

print("Going towards third point for 30 seconds (groundspeed set to 10 m/s) ...")
point3 = LocationGlobalRelative(37.33733782, -121.88273891, 20)
vehicle.simple_goto(point3, groundspeed=10)
prepare_telemetry(vehicle)

print("Going towards fourth point for 30 seconds (groundspeed set to 10 m/s) ...")
point4 = LocationGlobalRelative(37.33785447, -121.88176921, 20)
vehicle.simple_goto(point4, groundspeed=10)
prepare_telemetry(vehicle)

print("Returning to Launch")
vehicle.mode = VehicleMode("RTL")

# # Wait for RTL mode to end
# while not rtl_mode_ended:
#     prepare_telemetry(vehicle)
#     time.sleep(1)

while vehicle.armed:
    print(" Waiting for disarming...")
    prepare_telemetry(vehicle)
    time.sleep(1)

print("RTL mode ended")

# Close vehicle object before exiting script
print("Close vehicle object")
vehicle.close()