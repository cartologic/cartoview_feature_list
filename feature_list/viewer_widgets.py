from django.templatetags.static import static
from cartoview.user_engage.viewer_widgets import widgets as user_engage_widgets
widgets = user_engage_widgets + [{
    'title': 'Feature List',
    'name': 'FeatureList',

    'config': {
        'directive': 'feature-list-config',
        'js': [
            static("feature_list/js/config/feature-list-directive.js"),
        ],
        "css": [
            static("feature_list/css/config.css"),
        ]
    },
    'view': {
        'directive': 'feature-list',
        'js': [
            static("feature_list/js/view/app.js"),
            static("feature_list/js/view/main-controller.js"),
            static("feature_list/js/view/feature-list-service.js"),
            static("feature_list/js/view/feature-list-directive.js"),
        ],
        "css": [
            static("feature_list/css/view.css"),
        ]
    },
}]