from django.contrib import admin
from .models import SEORequestLog

@admin.register(SEORequestLog)
class SEORequestLogAdmin(admin.ModelAdmin):
    list_display = ('domain', 'request_time', 'response_status', 'seo_score')
    list_filter = ('response_status', 'request_time')
    search_fields = ('domain',)