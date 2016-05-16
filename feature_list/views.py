from django.shortcuts import render_to_response, HttpResponse, redirect, HttpResponseRedirect
from django.shortcuts import render, render_to_response
from django.template import RequestContext
from cartoview.app_manager.models import AppInstance, App
from . import APP_NAME
import json
from django.conf import settings

VIEW_MAP_TPL = "%s/view.html" % APP_NAME
NEW_EDIT_TPL = "%s/new.html" % APP_NAME


def view_map(request, instance_id, show_tbar=True):
    instance = AppInstance.objects.get(pk=instance_id)
    context = {
        "instance_id": instance_id,
        "instance": instance,
        'show_tbar': show_tbar,
    }
    return render_to_response(VIEW_MAP_TPL, context, context_instance=RequestContext(request))


def embed_map(request, instance_id):
    return view_map(request, instance_id, False)


def map_config(request):
    instance_id = request.GET.get("id")
    instance = AppInstance.objects.get(pk=instance_id)
    config = instance.map.viewer_json(request.user)
    return HttpResponse(json.dumps(config), content_type="application/json")


def save(request, instance_id=None):
    res_json = dict(success=False)
    try:
        map_id = request.POST.get('map', None)
        title = request.POST.get('title', "")
        config = request.POST.get('config', None)
        abstract = request.POST.get('abstract', "")
        if instance_id is None:
            instance_obj = AppInstance()
            # get app by name and add it to app instance.
            instance_obj.app = App.objects.get(name=APP_NAME)
            instance_obj.owner = request.user
        else:
            instance_obj = AppInstance.objects.get(pk=instance_id)
        instance_obj.title = title
        instance_obj.config = config
        instance_obj.abstract = abstract
        instance_obj.map_id = map_id
        instance_obj.save()
        res_json.update(dict(success=True, id=instance_obj.id))
    except Exception, e:
        print e
        res_json["error_message"] = str(e)
    return HttpResponse(json.dumps(res_json), content_type="application/json")


def new(request):
    if request.method == 'POST':
        return save(request)
    return render(request, NEW_EDIT_TPL, {})


def edit(request, instance_id):
    if request.method == 'POST':
        return save(request, instance_id)
    return render(request, NEW_EDIT_TPL, {'instance_id': instance_id})