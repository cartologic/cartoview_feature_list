# -*- coding: utf-8 -*-
from django.urls import re_path

from .views import IndexView, ConfigView

urlpatterns = [
    re_path('^$', IndexView.as_view()),
    re_path('^new$', ConfigView.as_view()),
    re_path('^(?P<id>[\d]+)/edit$', ConfigView.as_view()),
]
