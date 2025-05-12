import os
import sys
import json
from dotenv import load_dotenv

# Add the project root to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Load environment variables
load_dotenv()

# Import the SEO API service
from seo_api.services import SEOAPIService

def test_seo_api():
    """Test the SEO API service with a sample domain"""
    # Create an instance of the SEO API service
    service = SEOAPIService()
    
    # Test domain
    test_keyword = "Electronic Arts, EA games"
    test_location = "United States"
    test_language = "English"
    test_website = "ea.com"
    
    print(f"Testing SEO API with domain: {test_keyword}")
    print(f"API Key: {service.api_key[:5]}...{service.api_key[-3:]}")
    print(f"API Secret: {service.api_secret[:5]}...{service.api_secret[-3:]}")
    
    try:
        # Fetch SEO data
        seo_data = service._fetch_keyword_data(test_keyword,test_location)
        print('-------------------------------------------------------------------------')
        print(seo_data)
        if seo_data:
            print("\n✅ API request successful!")
            print("\nSummary of SEO data:")
            print(f"SEO Score: {seo_data.get('seo_score', 'N/A')}")
            print(f"Business Name: {seo_data.get('business_name', 'N/A')}")
            print(f"Location: {seo_data.get('location', 'N/A')}")
            
            # Print GMB profile info if available
            gmb = seo_data.get('gmb_profile', {})
            if gmb:
                print("\nGoogle My Business Profile:")
                print(f"Name: {gmb.get('name', 'N/A')}")
                print(f"Rating: {gmb.get('rating', 'N/A')}")
                print(f"Reviews: {gmb.get('reviews_count', 'N/A')}")
            
            # Print backlinks info if available
            backlinks = seo_data.get('backlinks', {})
            if backlinks:
                print("\nBacklinks:")
                print(f"Total: {backlinks.get('total', 'N/A')}")
                print(f"Referring Domains: {backlinks.get('referring_domains', 'N/A')}")
            
            # Print keywords info if available
            keywords = seo_data.get('keywords', {})
            if keywords:
                print("\nTop Keywords:", len(keywords))
                
            
            # Save the full response to a file for inspection
            with open('seo_api_response.json', 'w') as f:
                json.dump(seo_data, f, indent=2)
            print("\nFull response saved to 'seo_api_response.json'")
            
        else:
            print("❌ API request failed: No data returned")
    
    except Exception as e:
        print(f"❌ API request failed with error: {str(e)}")

if __name__ == "__main__":
    test_seo_api()