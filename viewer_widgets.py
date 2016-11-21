from django.templatetags.static import static
from cartoview.user_engage.viewer_widgets import widgets as user_engage_widgets
from . import APP_NAME

widgets = user_engage_widgets + [{
    'title': 'Feature List',
    'name': 'FeatureList',

    'config': {
        'directive': 'feature-list-config',
        'js': [
            static("%s/js/config/feature-list-directive.js" % APP_NAME),
        ],
        "css": [
            static("%s/css/config.css" % APP_NAME),
        ]
    },
    'view': {
        'directive': 'feature-list',
        'js': [
            static("%s/js/view/app.js" % APP_NAME),
            static("%s/js/view/main-controller.js" % APP_NAME),
            static("%s/js/view/feature-list-service.js" % APP_NAME),
            static("%s/js/view/feature-list-directive.js" % APP_NAME),
        ],
        "css": [
            static("%s/css/view.css" % APP_NAME),
        ]
    },
}]