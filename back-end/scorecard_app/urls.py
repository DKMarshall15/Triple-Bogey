from django.urls import path
from .views import ScorecardView

urlpatterns = [
    path('', ScorecardView.as_view(), name='scorecard-list'),
    path('create/', ScorecardView.as_view(), name='scorecard-create'),
    path('update/<int:scorecard_id>/', ScorecardView.as_view(), name='scorecard-update'),
    path('delete/<int:scorecard_id>/', ScorecardView.as_view(), name='scorecard-delete'),
    path('entry/update/<int:entry_id>/', ScorecardView.as_view(), name='score-entry-update'),
]