import json

from cartoview.app_manager.models import App, AppInstance
from cartoview.app_manager.views import StandardAppViews
from django.shortcuts import HttpResponse

from . import APP_NAME


class FeatureList(StandardAppViews):
    def save(self, request, instance_id=None):
        res_json = dict(success=False)
        data = json.loads(request.body)
        config = data.get('config', None)
        map_id = data.get('map', None)
        title = data.get('title', "")
        access = data.get('access', None)
        keywords = data.get('keywords', [])
        config.update(access=access, keywords=keywords)
        config = json.dumps(data.get('config', None))
        abstract = data.get('abstract', "")

        if instance_id is None:
            instance_obj = AppInstance()
            instance_obj.app = App.objects.get(name=self.app_name)
            instance_obj.owner = request.user
        else:
            instance_obj = AppInstance.objects.get(pk=instance_id)

        instance_obj.title = title
        instance_obj.config = config
        instance_obj.abstract = abstract
        instance_obj.map_id = map_id
        instance_obj.save()

        owner_permissions = [
            'view_resourcebase',
            'download_resourcebase',
            'change_resourcebase_metadata',
            'change_resourcebase',
            'delete_resourcebase',
            'change_resourcebase_permissions',
            'publish_resourcebase',
        ]
        # access limited to specific users
        if access == "private":
            permessions = {
                'users': {
                    '{}'.format(request.user): owner_permissions,
                }
            }
        else:
            permessions = {
                'users': {
                    '{}'.format(request.user): owner_permissions,
                    'AnonymousUser': [
                        'view_resourcebase',
                    ],
                }
            }
        # set permissions so that no one can view this appinstance other than
        #  the user
        instance_obj.set_permissions(permessions)

        # update the instance keywords
        if hasattr(instance_obj, 'keywords') and keywords:
            new_keywords = [
                k for k in keywords if k not in instance_obj.keyword_list()]
            instance_obj.keywords.add(*new_keywords)

        res_json.update(dict(success=True, id=instance_obj.id))
        return HttpResponse(json.dumps(res_json),
                            content_type="application/json")


feature_list = FeatureList(APP_NAME)
