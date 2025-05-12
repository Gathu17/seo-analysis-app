from django.test import TestCase
from unittest.mock import patch, MagicMock
from .services import SEOAPIService
from .views import SEOReportView
from rest_framework.test import APIRequestFactory
from rest_framework import status

class SEOAPIServiceTests(TestCase):
    def setUp(self):
        self.service = SEOAPIService()
        self.test_domain = "example.com"
        self.test_location = "United States"
    
    @patch('seo_api.services.requests.post')
    def test_fetch_gmb_data(self, mock_post):
        # Mock the response
        mock_response = MagicMock()
        mock_response.json.return_value = {
            'tasks': {
                'result': [{'name': 'Example Business', 'rating': 4.5}]
            }
        }
        mock_response.raise_for_status.return_value = None
        mock_post.return_value = mock_response
        
        # Call the method
        result = self.service._fetch_gmb_data(self.test_domain, self.test_location)
        
        # Assert the result
        self.assertEqual(result.get('name'), 'Example Business')
        self.assertEqual(result.get('rating'), 4.5)
        
        # Assert the API was called correctly
        mock_post.assert_called_once()
        args, kwargs = mock_post.call_args
        self.assertTrue(self.service.base_url in args[0])
        self.assertEqual(kwargs['auth'], (self.service.api_key, self.service.api_secret))
    
    @patch('seo_api.services.SEOAPIService._fetch_gmb_data')
    @patch('seo_api.services.SEOAPIService._fetch_local_rankings')
    @patch('seo_api.services.SEOAPIService._fetch_business_details')
    def test_fetch_local_seo_data(self, mock_business, mock_rankings, mock_gmb):
        # Mock the responses
        mock_gmb.return_value = {'name': 'Example Business', 'rating': 4.5}
        mock_rankings.return_value = {'position': 3, 'competitors': []}
        mock_business.return_value = {'name': 'Example', 'website': 'https://example.com'}
        
        # Patch the remaining methods to return empty dicts
        with patch.multiple(
            self.service,
            _fetch_onpage_data=MagicMock(return_value={}),
            _fetch_backlinks_data=MagicMock(return_value={}),
            _fetch_keyword_data=MagicMock(return_value={'top_keywords': []}),
            _fetch_rank_data=MagicMock(return_value={}),
            _fetch_pagespeed_data=MagicMock(return_value={}),
            _fetch_content_analysis=MagicMock(return_value={}),
            _fetch_competitor_data=MagicMock(return_value=[]),
            _calculate_seo_score=MagicMock(return_value=75)
        ):
            # Call the method
            result = self.service.fetch_local_seo_data(self.test_domain, self.test_location)
            
            # Assert the result
            self.assertEqual(result.get('business_name'), self.test_domain)
            self.assertEqual(result.get('location'), self.test_location)
            self.assertEqual(result.get('seo_score'), 75)
            self.assertEqual(result.get('gmb_profile', {}).get('name'), 'Example Business')
            self.assertEqual(result.get('local_rankings', {}).get('position'), 3)

class SEOReportViewTests(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
    
    @patch('seo_api.services.SEOAPIService.fetch_local_seo_data')
    def test_get_seo_report(self, mock_fetch):
        # Mock the SEO data response
        mock_fetch.return_value = {
            'business_name': 'example.com',
            'location': 'United States',
            'seo_score': 75,
            'gmb_profile': {'name': 'Example Business', 'rating': 4.5},
            'local_rankings': {'position': 3},
            'keywords': {'top_keywords': [{'keyword': 'example keyword'}]},
            'backlinks': {'total': 100, 'referring_domains': 50},
            'website_analysis': {'onpage_score': 80}
        }
        
        # Create a request
        request = self.factory.get('/api/seo-report/?domain=example.com')
        
        # Call the view
        view = SEOReportView.as_view()
        response = view(request)
        
        # Assert the response
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['domain'], 'example.com')
        self.assertEqual(response.data['seo_score'], 75)
        self.assertEqual(response.data['keywords']['ranking'], 3)
        self.assertEqual(len(response.data['keywords']['opportunities']), 1)
        self.assertEqual(response.data['backlinks']['count'], 100)
        self.assertEqual(response.data['backlinks']['quality_score'], 50)
        self.assertEqual(response.data['authority'], 80)
    
    def test_missing_domain_parameter(self):
        # Create a request without domain parameter
        request = self.factory.get('/api/seo-report/')
        
        # Call the view
        view = SEOReportView.as_view()
        response = view(request)
        
        # Assert the response
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
# Create your tests here.
