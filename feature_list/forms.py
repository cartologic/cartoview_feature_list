from django import forms
from django.templatetags.static import static
from cartoview.app_manager.forms import AppInstanceForm
from .models import FeatureListApp
from . import APP_NAME
import json

class MapForm(AppInstanceForm):
    class Meta(AppInstanceForm.Meta):
        model = FeatureListApp

class ConfigWidget(forms.HiddenInput):
    def render(self, name, value, attrs=None):
        input = super(ConfigWidget, self).render(name, value, attrs)
        input += '<div ng-app="featureLisConfigApp" feature-list-config></div>'
        return input

class ConfigForm(forms.ModelForm):
    config = forms.CharField(widget=ConfigWidget, required=False)
    class Meta:
        model = FeatureListApp
        fields = ['config']

    class Media:
        # css = {all:[]}
        js = [static( APP_NAME + "/js/config-app.js")]
