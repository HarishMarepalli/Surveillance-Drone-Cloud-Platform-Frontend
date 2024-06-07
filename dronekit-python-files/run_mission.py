import os
import subprocess
import threading

def execute_mission_command(instance, connect, mission_id):
    command = [
        "python", "start_mission.py",
        "--instance", instance,
        "--connect", connect,
        "--mission_id", mission_id
    ]
    subprocess.call(command)

def main():

    # Get the number of missions to simulate from the user
    num_missions = int(input("Number of Missions to Simulate: "))

    # Prompt for mission IDs
    mission_ids = []
    for i in range(num_missions):
        mission_id = input("Mission ID {}: ".format(i+1))
        mission_ids.append(mission_id)
        
     # Create threads to run the command for each mission in separate terminals
    threads = []
    for i, mission_id in enumerate(mission_ids):
        instance = "I{}".format(i)
        connect = "tcp:127.0.0.1:{}".format(5760 + i * 10)
        thread = threading.Thread(target=execute_mission_command, args=(instance, connect, mission_id))
        threads.append(thread)
        thread.start()

    for thread in threads:
        thread.join()

if __name__ == "__main__":
    main()
