from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import SEORequestLog
from .services import SEOAPIService

class SEOReportView(APIView):
    def get(self, request):
       
        
        
        
        location = request.query_params.get('location', 'United States')
        language = request.query_params.get('language', 'English')
        keywords = request.query_params.get('keywords', '')
        website = request.query_params.get('domain', '')
        
        if not website:
            return Response(
                {"error": "Domain parameter is required"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        try:
            # Initialize the SEO API service
            seo_service = SEOAPIService()
            
            #Mock data
            # seo_data = {
            #     "business_name": "Example Business",
            #     "location": "United States",
            #     "seo_score": 75,
            #     "gmb_profile": {
            #         "name": "Example Business",
            #         "rating": 4.5,
            #         "reviews_count": 100,
            #         "category": "Restaurant",
            #         "status": "Open",
            #         "rating_review_score": 80
            #     },
            #     "local_rankings": {
            #         "position": 3,
            #         "competitors": [
            #             {"name": "Competitor 1", "website": "https://competitor1.com", "rank": 4},
            #             {"name": "Competitor 2", "website": "https://competitor2.com", "rank": 5}
            #         ],
            #         "ranking_score": 80
            #     },
            #     "keywords": {
            #         "top_keywords": [
            #             {"keyword": "example keyword 1", "volume": 1000, "position": 1, "difficulty": 10},
            #             {"keyword": "example keyword 2", "volume": 500, "position": 2, "difficulty": 5},
            #             {"keyword": "example keyword 3", "volume": 200, "position": 3, "difficulty": 2}
            #         ]
            #     }
            

            # }    



            
            # Fetch real SEO data
            seo_data = seo_service.fetch_local_seo_data(keywords, website, location, language)
            
            if not seo_data:
                return Response(
                    {"error": "Failed to fetch SEO data"}, 
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
            
            
            # formatted_data = {
            #     "domain": domain,
            #     "business_name": seo_data.get("business_name", ""),
            #     "location": seo_data.get("location", ""),
            #     "seo_score": seo_data.get("seo_score", 0),
            #     "gmb_profile": seo_data.get("gmb_profile", {}),
            #     "local_rankings": seo_data.get("local_rankings", {}),
            #     "web"
            #     "keywords": {
            #         "ranking": seo_data.get("local_rankings", {}).get("position", 0),
            #         "opportunities": [
            #             kw.get("keyword", "") for kw in 
            #             seo_data.get("keywords", {}).get("top_keywords", [])
            #         ]
            #     },
            #     "backlinks": {
            #         "count": seo_data.get("backlinks", {}).get("total", 0),
            #         "quality_score": seo_data.get("backlinks", {}).get("referring_domains", 0)
            #     },
            #     "authority": seo_data.get("website_analysis", {}).get("onpage_score", 0)
            # }
            
            # Log the request
            SEORequestLog.objects.create(
                domain=website,
                response_status=200,
                seo_score=seo_data["seo_score"]
            )
            
            return Response(seo_data)
            
        except Exception as e:
            # Log the error
            SEORequestLog.objects.create(
                domain=website,
                response_status=500,
                seo_score=None
            )
            
            return Response(
                {"erro": str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
