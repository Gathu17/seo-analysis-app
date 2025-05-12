from django.urls import path
from .views import SEOReportView

urlpatterns = [
    path('seo-report/', SEOReportView.as_view(), name='seo-report'),
]