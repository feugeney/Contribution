from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    DashboardAPIView, 
    dashboard_summary, 
    test_api, 
    liste_institutions_api,
    ContributionsAPIView,
    test_contributions_api
)

# router = DefaultRouter()
# router.register(r'items', ItemViewSet)

urlpatterns = [
    # API de test
    path('test/', test_api, name='test-api'),
    
    # API complète du dashboard
    path('dashboard/', DashboardAPIView.as_view(), name='dashboard-api'),
    
    # API résumé du dashboard
    path('dashboard/summary/', dashboard_summary, name='dashboard-summary'),
    
    # API liste des institutions
    path('institutions/', liste_institutions_api, name='institutions-api'),
    
    # API des contributions financières
    path('contributions/', ContributionsAPIView.as_view(), name='contributions-api'),
    path('contributions/test/', test_contributions_api, name='test-contributions-api'),
    
    # Anciennes routes (gardées pour compatibilité)
    # path('', include(router.urls)),
]
