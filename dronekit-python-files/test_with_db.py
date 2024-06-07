from __future__ import print_function
import time
from dronekit import connect, VehicleMode, LocationGlobalRelative
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

uri = "mongodb+srv://gaocloudgsr:gaocloudgsr@cluster0.vax6b4a.mongodb.net/?retryWrites=true&w=majority"

# Set up option parsing to get connection string
import argparse
parser = argparse.ArgumentParser(description='Commands vehicle using vehicle.simple_goto.')
parser.add_argument('--connect',
                    help="Vehicle connection target string. If not specified, SITL automatically started and used.")
args = parser.parse_args()

connection_string = args.connect
sitl = None


# Start SITL if no connection string specified
# if not connection_string:
#     import dronekit_sitl
#     sitl = dronekit_sitl.start_default()
#     connection_string = sitl.connection_string()

# Connect to MongoDB
client = MongoClient(uri, server_api=ServerApi('1'))  # Update with your MongoDB connection string
db = client['campus-test']  # Replace 'your_database' with your actual database name
collection = db['telemetry_data']  # Collection where you want to store telemetry data

# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)

# Connect to the Vehicle
print('Connecting to vehicle on: %s' % connection_string)
vehicle = connect(connection_string, wait_ready=True)


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
        # Break and return from function just below target altitude.
        if vehicle.location.global_relative_frame.alt >= aTargetAltitude * 0.95:
            print("Reached target altitude")
            break
        time.sleep(1)


arm_and_takeoff(20)

print("Set default/target airspeed to 10")
vehicle.airspeed = 10

print("Going towards first point for 30 seconds ...")
point1 = LocationGlobalRelative(37.337870, -121.881555, 20)
vehicle.simple_goto(point1)

# sleep so we can see the change in map
#time.sleep(30)
cnt = 0
while cnt<=30:
    latitude = vehicle.location.global_frame.lat
    longitude = vehicle.location.global_frame.lon
    altitude = vehicle.location.global_frame.alt
    battery_level = vehicle.battery.level
    speed = vehicle.airspeed

    telemetry_data = {
        'altitude': altitude,
        'latitude': latitude,
        'longitude': longitude,
        'battery': battery_level,
        'speed': speed
        # Add other telemetry data fields as needed
    }
    print("Live Telemetry: (Lat: %f, Long: %f, Alt: %f, Battery: %f, Speed: %f): " % (latitude, longitude, altitude, battery_level, speed))
    collection.insert_one(telemetry_data)
    time.sleep(1)
    cnt=cnt+1

print("Going towards second point for 30 seconds (groundspeed set to 10 m/s) ...")
point2 = LocationGlobalRelative(37.336882, -121.880790, 20)
vehicle.simple_goto(point2, groundspeed=10)

# sleep so we can see the change in map
#time.sleep(30)
cnt = 0
while cnt<=30:
    latitude = vehicle.location.global_frame.lat
    longitude = vehicle.location.global_frame.lon
    altitude = vehicle.location.global_frame.alt
    battery_level = vehicle.battery.level
    speed = vehicle.airspeed

    telemetry_data = {
        'altitude': altitude,
        'latitude': latitude,
        'longitude': longitude,
        'battery': battery_level,
        'speed': speed
        # Add other telemetry data fields as needed
    }
    print("Live Telemetry: (Lat: %f, Long: %f, Alt: %f, Battery: %f, Speed: %f): " % (latitude, longitude, altitude, battery_level, speed))
    collection.insert_one(telemetry_data)
    time.sleep(1)
    cnt=cnt+1

print("Going towards third point for 30 seconds (groundspeed set to 10 m/s) ...")
point3 = LocationGlobalRelative(37.336312, -121.881983, 20)
vehicle.simple_goto(point3, groundspeed=10)

# sleep so we can see the change in map
#time.sleep(30)
cnt = 0
while cnt<=30:
    latitude = vehicle.location.global_frame.lat
    longitude = vehicle.location.global_frame.lon
    altitude = vehicle.location.global_frame.alt
    battery_level = vehicle.battery.level
    speed = vehicle.airspeed

    telemetry_data = {
        'altitude': altitude,
        'latitude': latitude,
        'longitude': longitude,
        'battery': battery_level,
        'speed': speed
        # Add other telemetry data fields as needed
    }
    print("Live Telemetry: (Lat: %f, Long: %f, Alt: %f, Battery: %f, Speed: %f): " % (latitude, longitude, altitude, battery_level, speed))
    collection.insert_one(telemetry_data)
    time.sleep(1)
    cnt=cnt+1

print("Returning to Launch")
vehicle.mode = VehicleMode("RTL")

# Close vehicle object before exiting script
print("Close vehicle object")
vehicle.close()

# Shut down simulator if it was started.
# if sitl:
#     sitl.stop()