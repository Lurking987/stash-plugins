import sys
import json
import requests
import stashapi.log as log

def main():
    try:
        # Standard way for Stash plugins to receive server info
        raw_input = sys.stdin.read()
        if not raw_input:
            log.error("No input received from Stash.")
            return
        
        input_data = json.loads(raw_input)
        server = input_data.get("server_connection", {})
        
        # Use dynamic base_url to handle local vs remote connections
        base_url = f"{server.get('Scheme', 'http')}://{server.get('Host', 'localhost')}:{server.get('Port', 9999)}"
        headers = {'Content-Type': 'application/json'}
        if server.get('ApiKey'):
            headers['ApiKey'] = server.get('ApiKey')
    except Exception as e:
        log.error(f"Initialization failed: {e}")
        return

    # GraphQL query to find all tags
    query = "{ findTags(filter: {per_page: -1}) { tags { id image_path } } }"
    try:
        res = requests.post(f"{base_url}/graphql", json={'query': query}, headers=headers, timeout=10).json()
        tags = res.get("data", {}).get("findTags", {}).get("tags", [])
    except Exception as e:
        log.error(f"Failed to fetch tags: {e}")
        return

    # Clear covers only for tags that have one
    tags_to_clear = [t for t in tags if t.get("image_path")]
    total = len(tags_to_clear)
    
    if total == 0:
        log.info("No tag covers found to clear.")
        return

    for idx, tag in enumerate(tags_to_clear, 1):
        mutation = "mutation($id: ID!) { tagUpdate(input: { id: $id, image: \"\" }) { id } }"
        requests.post(f"{base_url}/graphql", json={'query': mutation, 'variables': {"id": tag['id']}}, headers=headers)
        log.progress(idx / total)

    log.info(f"Successfully cleared {total} tag cover images.")

if __name__ == "__main__":
    main()
