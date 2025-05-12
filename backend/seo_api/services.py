# seo_api/services.py
import requests
import os
from dotenv import load_dotenv
import time

load_dotenv()

class SEOAPIService:
    def __init__(self):
        self.api_key = os.getenv('DATAFORSEO_API_KEY')
        self.api_secret = os.getenv('DATAFORSEO_API_SECRET')
        self.base_url = 'https://api.dataforseo.com/v3'
        # Basic auth for DataForSEO
        self.auth = (self.api_key, self.api_secret)
    
    def fetch_local_seo_data(self, business_name, website, location, language_name="English"):
        """
        Fetch comprehensive local SEO data for a business
        """
        try:
            # 1. Google My Business data
            gmb_data = self._fetch_gmb_data(business_name, location, language_name)
            
            # 2. Local search rankings
            local_rankings = self._fetch_local_rankings(business_name, location)
            
            
            # # 3. Backlinks profile
            backlinks_data = self._fetch_backlinks_data(website) if website else {}
            
            # # 4. Business listing data
            business_details = self._fetch_business_details(business_name, location, website)
            
            # # 5. On-page SEO analysis
           
            onpage_data = self._fetch_onpage_data(website) if website else {}
            
            
            
            # # 6. Keyword data
            keyword_data = self._fetch_keyword_data(business_name, location)
            
            # # 7. Rank tracking data (simplified for now)
            # rank_data = self._fetch_rank_data(website, keyword_data.get('top_keywords', []))
            
            # # 8. PageSpeed data
            pagespeed_data = self._fetch_pagespeed_data(website) if website else {}
            
            # # 9. Content analysis
            content_data = self._fetch_content_analysis(business_name) if business_name else {}
            
            # # 10. Competitor analysis
            competitor_data = self._fetch_competitor_data(business_name, location, language_name)
            
            # Combine all data
            return self._format_local_seo_data(
                business_name, 
                location,
                website,
                gmb_data,
                local_rankings,
                business_details,
                onpage_data,
                backlinks_data,
                keyword_data,

                pagespeed_data,
                content_data,
                competitor_data
            )
        
        except requests.exceptions.RequestException as e:
            print(f"API request error: {str(e)}")
            return None
    
    def _fetch_gmb_data(self, business_name, location, language_name="English"):
        """Google My Business API integration"""
        endpoint = f"{self.base_url}/business_data/google/my_business_info/live"
        payload = [{
            "keyword": business_name,
            "location_name": location,
            "language_name": language_name
        }]
        response = requests.post(endpoint, auth=self.auth, json=payload)
        
        response.raise_for_status()
        tasks = response.json().get('tasks', [])
       
        
        return tasks[0].get('result', [{}])[0] if tasks else {}
    
    def _fetch_local_rankings(self, business_name, location):
        """Google Local Finder API integration"""
        endpoint = f"{self.base_url}/serp/google/local_finder/live/advanced"
        payload = [{
            "keyword": business_name,
            "location_name": location,
            "language_code": "en"
        }]
        response = requests.post(endpoint, auth=self.auth, json=payload)
        response.raise_for_status()
        tasks = response.json().get('tasks', [])
        
        return tasks[0].get('result', [{}])[0] if tasks else {}
    
    def _fetch_business_details(self, business_name, location, website):
        """Google Maps API integration"""
        endpoint = f"{self.base_url}/serp/google/maps/live/advanced"
        payload = [{
            "keyword": business_name,
            "location_name": location,
            "language_code": "en"
        }]
        response = requests.post(endpoint, auth=self.auth, json=payload)
        response.raise_for_status()
        tasks = response.json().get('tasks', [])
        response = tasks[0].get('result', [{}])[0] if tasks else {}       
        
        return response
    
    def _fetch_onpage_data(self, website):
        """On-Page API integration - two-step process"""
        try:
            # Step 1: Create a task
            task_post_endpoint = f"{self.base_url}/on_page/task_post"
            task_payload = [{
                "target": website,
                "max_crawl_pages": 1,  # Limit crawl to 1 pages for faster results
                "load_resources": False, 
                "enable_javascript": False,  
               
            }]
            
            task_response = requests.post(task_post_endpoint, auth=self.auth, json=task_payload)
            
            time.sleep(4)
            task_response.raise_for_status()
            
            task_data = task_response.json()
            
            
            # Extract task ID
            if not task_data.get('tasks'):
                print("No tasks returned from task_post")
                return [{}]
                
            task_id = task_data['tasks'][0].get('id')
            if  task_id:
                # Get the summary
                summary_endpoint = f"{self.base_url}/on_page/summary/{task_id}"
                summary_response = requests.get(summary_endpoint, auth=self.auth)
                summary_response.raise_for_status()
                
                summary_data = summary_response.json()
                
                
                # Extract the result
                if not summary_data.get('tasks'):
                    print("No tasks returned from summary")
                    return [{}]
                tasks = summary_data.get('tasks', [])
                if not tasks or not tasks[0].get('result'):
                    return {}
                return tasks[0].get('result', [{}])[0] if tasks else {}
            
        except requests.exceptions.RequestException as e:
            print(f"API request error in _fetch_onpage_data: {str(e)}")
            return {}
        except Exception as e:
            print(f"Error in _fetch_onpage_data: {str(e)}")
            return {}
    
    def _fetch_backlinks_data(self, website):
        """Backlinks API integration"""
        endpoint = f"{self.base_url}/backlinks/backlinks/live"
        payload = [{
            "target": website,
            "limit": 10
        }]
        response = requests.post(endpoint, auth=self.auth, json=payload)
        response.raise_for_status()
        tasks = response.json().get('tasks', [])
        
        
        # Backlinks API is unauthorized
        return {}
    
    def _fetch_keyword_data(self, business_name, location):
        """Keyword Data API integration"""
        endpoint = f"{self.base_url}/keywords_data/google/search_volume/live"
        payload = [{
            "keywords": business_name.split(','),
            "location_name": location,
            "language_name": "English"
        }]
        response = requests.post(endpoint, auth=self.auth, json=payload)
        response.raise_for_status()
        tasks = response.json().get('tasks', [])
        
        return tasks[0].get('result', [{}]) if tasks else []
    
        
    def _fetch_rank_data(self, website, keywords):
        """Rank Tracker API integration"""
        if not keywords or not website:
            return {}
            
        keyword_list = [k.get('keyword') for k in keywords[:5]]
        endpoint = f"{self.base_url}/serp/google/organic/live"
        payload = {
            "keywords": keyword_list,
            "target": website,
            "limit": 10
        }
        response = requests.post(endpoint, auth=self.auth, json=payload)
        response.raise_for_status()
        return response.json().get('tasks', {}).get('result', [{}])
    
    def _fetch_pagespeed_data(self, website):
        """PageSpeed API integration"""
        endpoint = f"{self.base_url}/on_page/lighthouse/live/json"
        if not website.startswith('http://') and not website.startswith('https://'):
            website = 'https://' + website
        payload = [{
            "url": website,
            "for_mobile": True
        }]
        response = requests.post(endpoint, auth=self.auth, json=payload)
        response.raise_for_status()
        
        tasks = response.json().get('tasks', [])
      
        return tasks[0].get('result', [{}])[0] if tasks else {}
    
    def _fetch_content_analysis(self, business_name):
        """Content Analysis API integration"""
        # endpoint = f"{self.base_url}/content_analysis/summary/live"
        
        # payload = [{
        #     "keyword": business_name
        # }]
        # response = requests.post(endpoint, auth=self.auth, json=payload)
        # print(response.json())    
        
        # tasks = response.json().get('tasks', [])
        
        # return tasks[0].get('result', [{}])[0] if tasks else {}
        return {}
    
    def _fetch_competitor_data(self, business_name, location, language):
        """Competitor API integration"""
        endpoint = f"{self.base_url}/dataforseo_labs/google/serp_competitors/live"
        payload = [{
            "keywords": business_name.split(','),
            "location_name": location,
            "language_name": language,
            "limit": 5
        }]
        response = requests.post(endpoint, auth=self.auth, json=payload)
        response.raise_for_status()
        
        tasks = response.json().get('tasks', [])

        return tasks[0].get('result', [{}])[0] if tasks else {}
    
    def _format_local_seo_data(self, business_name, location, website, gmb_data, local_rankings, 
                              business_details, onpage_data,  backlinks_data, keyword_data, pagespeed_data,content_data, competitor_data ):
        """Format all API responses into a standardized structure"""
       
        
        # Calculate competitor benchmark score
        business_details_score = self.calculate_business_details_score(business_details, website) if business_details else 0  # Add website to calculate business details score
        competitor_benchmark = self.calculate_competitor_benchmark_score(competitor_data, website)
        local_rankings_score = self.calculate_local_rankings_score(local_rankings) if local_rankings.get('items') is not None else 0
        pagespeed_score  = self.calculate_pagespeed_score(pagespeed_data) if pagespeed_data else 0
        seo_score = self._calculate_seo_score(business_details_score, pagespeed_score, competitor_benchmark,  local_rankings_score)
        
        return {
            "business_name": business_name,
            "location": location,
            "seo_score": seo_score,
            "gmb_profile": {
                "name": gmb_data.get('keyword', ''),
                "items": gmb_data.get('items', [])[:5] if gmb_data.get('items') is not None else [],
                "ranking_score": self.calculate_gbp_score(gmb_data.get('items', [])) if gmb_data.get('items') is not None else 0
            },
            "local_rankings": {
                "position": local_rankings.get('position', 0),
                "rankings": local_rankings.get('items', [])[:5] if local_rankings.get('items') is not None else [],
                "ranking_score": local_rankings_score
                    
            },
            "business_details": {
                "items" : business_details.get('items', [])[:5] if business_details.get('items') is not None else [],
                "ranking_score": business_details_score
               
            },
            "website_analysis": {
                "onpage_score": onpage_data.get('onpage_score', 0),
                "domain_info": onpage_data.get('domain_info', {}),
                "pagespeed": {
                    "environment": pagespeed_data.get('environment', {}),
                    "audits": pagespeed_data.get('audits', {})
                }
            },
            "backlinks": {
                    "total": 100,
                    "referring_domains": 50,
                    "dofollow_links": 80,
                    "nofollow_links": 20
                },
            "keywords": {                
                    "top_keywords": keyword_data
            },
            "content_analysis": {
                "total_count": content_data.get('total_count', 0),
                "rank": content_data.get('rank', 0),
                "top_domains": content_data.get('top_domains', [])[:5] if content_data.get('top_domains') is not None else []
            },
            "competitors": {
                "items": competitor_data.get('items', [])[:5] if competitor_data.get('items') is not None else [],
                "benchmark_score": competitor_benchmark['score'],
                "rank": competitor_benchmark['rank'],
                "top_competitors": competitor_benchmark['top_competitors']
            },
            "authority": competitor_benchmark['score']  # Use competitor benchmark as authority score
        }
    
    def _calculate_seo_score(self, business_details_score, pagespeed_score, competitor_benchmark,  local_rankings_score):
        """Calculate overall SEO score from various components"""
       
        
        # Calculate individual scores
        score_components = {
            "gmb_score": business_details_score,
            "onpage_score": local_rankings_score,
            "competitor_score": competitor_benchmark['score'],
            "pagespeed_score": pagespeed_score
        }
        
        # Calculate weighted average
        weights = {
            "gmb_score": 0.25,
            "onpage_score": 0.35,
            "competitor_score": 0.2,
            "pagespeed_score": 0.2
        }
        
        # Calculate total score
        total_score = 0
        for key, score in score_components.items():
            weight = weights.get(key, 0)
            # Ensure score is a number
            if not isinstance(score, (int, float)):
                score = 0
            total_score += score * weight
        
        return int(total_score)
    
    # 1. Google Business Profile (GBP) Score
    def calculate_gbp_score(self,gmb_data):
        completeness_score = 0
        required_fields = ['title', 'domain', 'phone', 'description']
        
        # Check completeness 
        for field in required_fields:
            if gmb_data.get(field) not in [None, ""]:
                completeness_score += 25  # Each field contributes 25%
        
        
        
        total_score = (completeness_score) / 100 * 100
        return min(total_score, 100)  # Cap at 100%



    # 2. Local Search Rankings Score
    def calculate_local_rankings_score(self,local_rankings):
        if not local_rankings.get('items'):
            return 0
        
        total_businesses = len(local_rankings['items'])
        rank_scores = []
        
        for business in local_rankings['items']:
            rank = business.get('rank_absolute', total_businesses + 1)  
            score = (total_businesses - rank + 1) / total_businesses * 100
            rank_scores.append(score)
        
        return sum(rank_scores) / len(rank_scores) if rank_scores else 0
    
    def calculate_business_details_score(self, data,website):
        """
        Calculate a business profile score based on Google Maps data.
        
        Args:
            data: Dictionary containing Google Maps business data
        
        Returns:
            float: Business profile score on a scale of 1-10
        """
        # Extract business data from the nested structure
        business_items = data["items"] if data["items"] else []
        
        # Find the business item 
        business = None
        for item in business_items:
            if website in item["domain"] or website in item["url"]:
                business = item
                break
        
        if not business:
            return 0  
       
        # Calculate base score
        score = 5.0  
        
        # Rating factors
        if business.get("rating") and business["rating"].get("value"):
            rating_value = business["rating"]["value"]
            rating_count = business["rating"].get("votes_count", 0)
            
            # Rating value impact (0-2 points)
            score += min(2, (rating_value - 3) * 1.0)
            
            # Review count impact (0-1 points)
            score += min(1, rating_count / 20)
        
        # Web presence (0-1 points)
        if business.get("domain") and business.get("url"):
            score += 1
    
        # Business claimed (0-1 points)
        if business.get("is_claimed"):
            score += 1
    
        # Clamp score between 1 and 10
        return max(1, min(10, score))
        
        


    def calculate_competitor_benchmark_score(self, competitor_data, domain=None):
        """
        Calculate a benchmark score based on competitor data
        
        Parameters:
        - competitor_data: dict containing competitor analysis results
        - domain: the domain being analyzed (to compare against competitors)
        
        Returns:
        - score: int (0-100 scale)
        - rank: int (position among competitors)
        - top_competitors: list of top competitors with scores
        """
        try:
            if not competitor_data or not isinstance(competitor_data, dict):
                return {
                    'score': 0,
                    'rank': 0,
                    'top_competitors': []
                }
                
            items = competitor_data.get('items', [])
            if not items:
                return {
                    'score': 0,
                    'rank': 0,
                    'top_competitors': []
                }
            
            # Extract competitor metrics
            competitors = []
            domain_position = None
            domain_score = 0
            
            for i, item in enumerate(items):             
                
                visibility_score = (item.get('visibility', 0) * 40)
                position_score = max(0, (10 - min(10, item.get('avg_position', 10))) / 10 * 30)
                rating_score = (item.get('rating', 0) / 100 * 20)
                keywords_score = min(1, item.get('keywords_count', 0) / 10) * 10
                
                total_score = round(visibility_score + position_score + rating_score + keywords_score)
                
                competitor = {
                    'domain': item.get('domain', ''),
                    'score': total_score,
                    'avg_position': item.get('avg_position', 0),
                    'visibility': item.get('visibility', 0),
                    'keywords_count': item.get('keywords_count', 0)
                }
                
                competitors.append(competitor)
                
                # Check if this is the domain we're analyzing
                if domain and item.get('domain', '').lower() == domain.lower():
                    domain_position = i + 1
                    domain_score = total_score
            
            # Sort competitors by score (highest first)
            competitors.sort(key=lambda x: x['score'], reverse=True)
            
            # If domain wasn't found in the list, estimate its position and score
            if domain and domain_position is None:
                # Estimate based on average metrics of bottom competitors
                if len(competitors) > 0:
                    bottom_competitors = competitors[max(0, len(competitors)-3):]
                    avg_score = sum(c['score'] for c in bottom_competitors) / len(bottom_competitors)
                    domain_score = round(avg_score * 0.8)  # Assume slightly worse than bottom competitors
                    
                    # Find position based on score
                    domain_position = len(competitors) + 1
                    for i, comp in enumerate(competitors):
                        if domain_score >= comp['score']:
                            domain_position = i + 1
                            break
            
            # Calculate overall benchmark score (0-100)
            # If domain is in top position, score is 100
            # If domain is not found or in last position, score is based on comparison to top competitor
            benchmark_score = 0
            
            if domain_position == 1:
                benchmark_score = 100
            elif domain_position and len(competitors) > 0:
                top_score = competitors[0]['score']
                score_ratio = domain_score / top_score if top_score > 0 else 0
                benchmark_score = round(score_ratio * 100)
            elif len(competitors) > 0:
                # Domain not found, estimate score as percentage of top competitor
                benchmark_score = round(domain_score / competitors[0]['score'] * 100) if competitors[0]['score'] > 0 else 0
            
            return {
                'score': min(100, max(0, benchmark_score)),
                'rank': domain_position or 0,
                'top_competitors': competitors[:5]  # Return top 5 competitors
            }
                
        except Exception as e:
            print(f"Error calculating competitor benchmark score: {str(e)}")
            return {
                'score': 0,
                'rank': 0,
                'top_competitors': []
            }
    def calculate_pagespeed_score(self,pagespeed_data):
        """
        Calculate a comprehensive PageSpeed score from pagespeed audit data.
        
        Parameters:
        pagespeed_data (dict): Dictionary containing pagespeed audit results
        
        Returns:
        dict: Performance scores and analysis
        """
        # Extract audits from the data
        audits = pagespeed_data.get("audits", {})
        
        # Define metrics and their weights (based on Lighthouse v8)
        metrics = {
            "first-contentful-paint": {"weight": 0.10, "name": "First Contentful Paint"},
            "largest-contentful-paint": {"weight": 0.25, "name": "Largest Contentful Paint"},
            "speed-index": {"weight": 0.15, "name": "Speed Index"},
            "total-blocking-time": {"weight": 0.30, "name": "Total Blocking Time"},
            "interactive": {"weight": 0.10, "name": "Time to Interactive"},
            "cumulative-layout-shift": {"weight": 0.10, "name": "Cumulative Layout Shift"}
        }
        
        # Calculate weighted score
        weighted_score = 0
        total_weight = 0
        individual_scores = {}
        
        for metric_id, metric_info in metrics.items():
            if metric_id in audits and audits[metric_id].get("score") is not None:
                score = audits[metric_id]["score"]
                weight = metric_info["weight"]
                
                weighted_score += score * weight
                total_weight += weight
                
        
        # Calculate overall score (0-100)
        return  (weighted_score / total_weight) * 100 if total_weight > 0 else 0
    
    
    def _calculate_rating_review_score(self, rating, review_count, items_count):
        """
        Calculate a score based on rating and review count
        
        Parameters:
        - rating: float (0-5 scale)
        - review_count: int (number of reviews)
        
        Returns:
        - score: int (0-100 scale)
        - grade: str (letter grade A-F)
        """
        try:
            # Validate inputs
            if not isinstance(rating, (int, float)) or rating < 0 :
                rating = 0
            
            if not isinstance(review_count, (int, float)) or review_count < 0:
                review_count = 0
                
            # Calculate rating component (60% of total score)
            # 5 stars = 60 points, 0 stars = 0 points
            rating_score = (rating / items_count) * 60
            
            # Calculate review count component (40% of total score)
           
            if review_count > 0:
                import math
                review_score = min(40, 40 * (math.log10(review_count) / 3))
            else:
                review_score = 0
                
            # Calculate total score (0-100)
            total_score = round(rating_score + review_score)
            
            # Convert to letter grade
            if total_score/0.6 >= 90:
                grade = 'A'
            elif total_score/0.6 >= 80:
                grade = 'B'
            elif total_score/0.6 >= 70:
                grade = 'C'
            elif total_score/0.6 >= 60:
                grade = 'D'
            else:
                grade = 'F'
                
            return {
                'score': total_score,
                'grade': grade
            }
            
        except Exception as e:
            print(f"Error calculating rating review score: {str(e)}")
            return {
                'score': 0,
                'grade': 'F'
            }
