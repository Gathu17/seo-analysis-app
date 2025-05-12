from django.db import models

class SEORequestLog(models.Model):
    domain = models.CharField(max_length=255)
    request_time = models.DateTimeField(auto_now_add=True)
    response_status = models.IntegerField()
    seo_score = models.FloatField(null=True, blank=True)
    
    def __str__(self):
        return f"{self.domain} - {self.request_time.strftime('%Y-%m-%d %H:%M')}"