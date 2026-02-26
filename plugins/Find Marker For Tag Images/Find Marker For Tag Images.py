import sys
import json
import random
import time
import requests
import stashapi.log as log
from stashapi.stashapp import StashInterface

def main():
    # 1. READ CONFIG FROM STASH
    try:
        # Read the JSON configuration passed by Stash
        input_data = json.loads(sys.stdin.read())
        server_info = input_data.get("server_connection", {})
        
        # Automatically get the base URL and API Key from Stash itself
        base_url = f"{server_info.get('Scheme', 'http')}://{server_info.get('Host', 'localhost')}:{server_info.get('Port', 9999)}"
        api_key = server_info.get('ApiKey', '')
        
        # Initialize the official Stash Interface
        stash = StashInterface(server_info)
    except Exception as e:
        log.error(f"Failed to initialize plugin connection: {e}")
        return

    endpoint_url = f"{base_url}/graphql"
    headers = {'Content-Type': 'application/json'}
    if api_key:
        headers['ApiKey'] = api_key

    # Helper function for GraphQL
    def call_gql(query, variables=None):
        try:
            response = requests.post(endpoint_url, json={'query': query, 'variables': variables}, headers=headers, timeout=10)
            return response.json().get("data", {})
        except Exception as e:
            log.error(f"GQL Error: {e}")
            return {}

    # 2. START PROCESSING
    start_time = time.time()
    
    tags_query = """
    query { findTags(tag_filter: {marker_count: {modifier: GREATER_THAN, value: 0}}, filter: {per_page: -1}) {
        tags { id name }
    }}
    """
    tags_data = call_gql(tags_query)
    tags = tags_data.get("findTags", {}).get("tags", [])
    
    if not tags:
        log.info("No tags with markers found.")
        return

    total = len(tags)
    log.info(f"Processing {total} tags via plugin...")

    for idx, tag in enumerate(tags, 1):
        tag_id = tag['id']
        
        # Find markers for this tag
        marker_query = """
        query($id: ID!) { findSceneMarkers(scene_marker_filter: {tags: {value: [$id], modifier: INCLUDES}}, filter: {per_page: -1}) {
            scene_markers { id scene { id } }
        }}
        """
        markers_data = call_gql(marker_query, {"id": tag_id})
        markers = markers_data.get("findSceneMarkers", {}).get("scene_markers", [])
        
        if markers:
            marker = random.choice(markers)
            # Use the dynamic base_url
            stream_url = f"{base_url}/scene/{marker['scene']['id']}/scene_marker/{marker['id']}/stream"

            # RESET & UPDATE
            clear_mut = "mutation($id: ID!) { tagUpdate(input: { id: $id, image: \"\" }) { id } }"
            call_gql(clear_mut, {"id": tag_id})
            
            update_mut = "mutation($id: ID!, $img: String!) { tagUpdate(input: { id: $id, image: $img }) { id } }"
            call_gql(update_mut, {"id": tag_id, "img": stream_url})

        # 3. UPDATE STASH UI PROGRESS BAR
        log.progress(idx / total)
        
        if idx % 10 == 0:
            elapsed = time.time() - start_time
            eta = int((elapsed / idx) * (total - idx))
            log.info(f"Progress: {idx}/{total} - ETA: {eta}s")

    log.info("Finished updating tag previews.")

if __name__ == "__main__":
    main()
