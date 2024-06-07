import requests
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
    
# Example usage:
mission_id = "M008"  # Specify the mission ID you want to fetch
mission_details = fetch_mission_details_from_database(mission_id)
if mission_details:
    print("Mission details fetched successfully:")
    print(mission_details)
else:
    print("Failed to fetch mission details.")