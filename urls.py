from django.urls import path
from . import APP_NAME, views

urlpatterns = [
    path('new/', views.feature_list.new, name='%s.new' % APP_NAME),
    path('<int:instance_id>/edit/', views.feature_list.edit, name='%s.edit' % APP_NAME),
    path('<int:instance_id>/view/', views.feature_list.view_app, name='%s.view' % APP_NAME)
]

