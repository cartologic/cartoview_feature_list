from django.views.generic import TemplateView
from django.views.generic.base import TemplateView
from django.shortcuts import render


class IndexView(TemplateView):
    def get(self, request, *args, **kwargs):
        return render(request, "index_view/build/index.html", {})

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        return context


class ConfigView(TemplateView):
    def get(self, request, *args, **kwargs):
        return render(request, "config_view/build/index.html", {})

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        return context
