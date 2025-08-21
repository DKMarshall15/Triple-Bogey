from django.urls import path
from .views import ScorecardView

urlpatterns = [
    path('', ScorecardView.as_view(), name='scorecard-list-create'),
    path('<int:scorecard_id>/', ScorecardView.as_view(), name='scorecard-detail'),
    path('entry/<int:entry_id>/', ScorecardView.as_view(), name='score-entry-update'),
]