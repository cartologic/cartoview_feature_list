from django.conf.urls import patterns, url
import views
from . import APP_NAME

urlpatterns = patterns('',
   url(r'^(?P<instance_id>\d+)/view/$', views.view_map, name='%s.view' % APP_NAME),
   url(r'^(?P<instance_id>\d+)/embed/$', views.embed_map, name='%s.embed' % APP_NAME),
   url(r'^geonode/map/config.json', views.map_config, name='%s.map_config' % APP_NAME),
   url(r'^new/$', views.new, name='%s.new' % APP_NAME),
   url(r'^edit/(?P<instance_id>\d+)/$', views.edit, name='%s.edit' % APP_NAME),
)
