import json

from cartoview.app_manager.models import App, AppInstance
from cartoview.app_manager.views import StandardAppViews
from django.shortcuts import HttpResponse

from . import APP_NAME
_js_permissions_mapping = {
    'whoCanView': 'view_resourcebase',
    'whoCanChangeMetadata': 'change_resourcebase_metadata',
    'whoCanDelete': 'delete_resourcebase',
    'whoCanChangeConfiguration': 'change_resourcebase'
}


def change_dict_None_to_list(access):
    for permission, users in list(access.items()):
        if not users:
            access[permission] = []


class FeatureList(StandardAppViews):
    def get_users_permissions(self, access, initial, owner):
        change_dict_None_to_list(access)
        users = []
        for permission_users in list(access.values()):
            if permission_users:
                users.extend(permission_users)
        users = set(users)
        for user in users:
            user_permissions = []
            for js_permission, gaurdian_permission in \
                    list(_js_permissions_mapping.items()):
                if user in access[js_permission]:
                    user_permissions.append(gaurdian_permission)
            if len(user_permissions) > 0 and user != owner:
                initial['users'].update({'{}'.format(user): user_permissions})
        if len(access["whoCanView"]) == 0:
            initial['users'].update({'AnonymousUser': [
                'view_resourcebase',
            ]})

    def save(self, request, instance_id=None):
        user = request.user
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
            instance_obj.owner = user
        else:
            instance_obj = AppInstance.objects.get(pk=instance_id)
            user = instance_obj.owner

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
        permessions = {
            'users': {
                '{}'.format(request.user.username): owner_permissions,
            }
        }
        self.get_users_permissions(access, permessions, user.username)
        instance_obj.set_permissions(permessions)
        if hasattr(instance_obj, 'keywords') and keywords:
            new_keywords = [
                k for k in keywords if k not in instance_obj.keyword_list()]
            instance_obj.keywords.add(*new_keywords)

        res_json.update(dict(success=True, id=instance_obj.id))
        return HttpResponse(json.dumps(res_json),
                            content_type="application/json")

    def edit(self, request, instance_id,
            template=None, context={}, * args, **kwargs):
        return super(FeatureList, self).edit(request, instance_id=instance_id, template=None, context={'APP_NAME': APP_NAME}, * args, **kwargs)
    
    def new(self, request, template=None, context={}, *args, **kwargs):
        return super(FeatureList, self).new(request, template=None, context={'APP_NAME': APP_NAME}, *args, **kwargs)
    
    def view_app(self, request, instance_id, template=None, context={}):
        return super(FeatureList, self).view_app(request, instance_id=instance_id, template=None, context={'APP_NAME': APP_NAME})

feature_list = FeatureList(APP_NAME)
