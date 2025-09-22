import requests
import time
import random
import stashapi.log as log

# GraphQL endpoint URL
endpoint_url = "http://localhost:9999/graphql"

# GraphQL query to retrieve tags with a marker count greater than 0
tags_with_markers_query = """
query findTags {
    findTags(tag_filter: {marker_count: {modifier: GREATER_THAN, value: 0}  }, filter: {per_page: -1}) {
        tags{
            id
       		name
        	image_path
        	scene_marker_count
    	}
    }
}
"""

# GraphQL query to find scene markers by tag id
find_markers_tag_id_query = """
query find_Markers_tag_id ($tag_id: ID!) {
    findSceneMarkers(
        filter: { per_page: -1 },
        scene_marker_filter: {
            tags: {
                value: [$tag_id],
                modifier: INCLUDES
            }
        }
    ){
        scene_markers {
            id
            stream
            title
            primary_tag { id }
        }
    }
}
"""

# GraphQL mutation to update tag image
tag_update_mutation = """
mutation tagUpdate($id: ID!, $image: String!) {
    tagUpdate(input: { id: $id, image: $image }) {
        id
    }
}
"""

def fetch_graphql_data(query, variables=None):
    try:
        response = requests.post(endpoint_url, json={'query': query, 'variables': variables})
        response.raise_for_status()  # Raise an exception for non-2xx responses
        data = response.json()
        if "errors" in data:
            for error in data["errors"]:
                log.error(f"GraphQL Error: {error.get('message')}")
            return None
        return data
    except Exception as e:
        log.error(f"Error fetching GraphQL data: {e}")
        return None
        

def update_tag_image(tag_id, stream):
    variables = {"id": tag_id, "image": stream}
    try:
        response = requests.post(endpoint_url, json={'query': tag_update_mutation, 'variables': variables})
        response.raise_for_status()
        return response.json()
    except Exception as e:
        log.error(f"Error updating tag image: {e}")
        return None
        
def calculate_eta(total_tags, total_markers, current_tag_index, current_marker_index, start_time):
    tags_remaining = total_tags - current_tag_index
    markers_remaining = total_markers - current_marker_index
    total_remaining = tags_remaining + markers_remaining
    elapsed_time = time.time() - start_time
    if total_remaining == 0:
        return 0
    avg_time_per_item = elapsed_time / (total_tags + total_markers)
    eta = avg_time_per_item * total_remaining
    return int(eta)
    
def main():
    # Fetch tags with marker count greater than 0
    tags_data = fetch_graphql_data(tags_with_markers_query)
    if not tags_data:
        return
        
    tags = tags_data.get("data", {}).get("findTags", {}).get("tags", [])
    total_tags = len(tags)
    total_markers = 0
    
    # Determine total number of markers
    for tag in tags:
        tag_id = tag.get("id")
        scene_markers_data = fetch_graphql_data(find_markers_tag_id_query, variables={"tag_id": tag_id})
        if scene_markers_data:
            scene_markers = scene_markers_data.get("data", {}).get("findSceneMarkers", {}).get("scene_markers", [])
            total_markers += len(scene_markers)

    # Initialize progress variables
    processed_tags = 0
    processed_markers = 0
    
    # Loop through tags
    for tag_index, tag in enumerate(tags, 1):
        tag_id = tag.get("id")
        tag_name = tag.get("name")
        
        # Search for scene markers by tag id
        scene_markers_data = fetch_graphql_data(find_markers_tag_id_query, variables={"tag_id": tag_id})
        
        if scene_markers_data:
            scene_markers = scene_markers_data.get("data", {}).get("findSceneMarkers", {}).get("scene_markers", [])
            
            # Find a random scene marker stream URL
            random_url = None
            
            # Check if there are any scene markers returned:
            if scene_markers:
                # Pick one random marker dictionary from the list
                random_marker = random.choice(scene_markers)
                # Get stream URL from dictionary
                random_url = random_marker.get("stream")
               
            # Update tag image if a random URL was allocated
            if random_url:
                update_tag_image(tag_id, random_url)
                log.info(f"Updated tag '{tag_name}' with scene marker video preview.")
                processed_markers += 1
                time.sleep(0.5)  # Add a half-second delay
            else:
                log.info(f"No URL was available for tag '{tag_name}'. Skipping.")
        else:
            log.info(f"Could not fetch scene markers for tag_id '{tag_id}'. Skipping.")
         
        processed_tags += 1
        
        # Calculate progress as a percentage and log it
        progress = processed_tags / total_tags
        log.progress(progress)

        # Calculate and log ETA
        eta = calculate_eta(total_tags, total_markers, processed_tags, processed_markers, start_time)
        log.info(f"Progress: {progress * 100:.2f}%, ETA: {eta} seconds.")
        
if __name__ == "__main__":
    log.info("Starting script...")
    start_time = time.time()  # Initialize start time
    main()