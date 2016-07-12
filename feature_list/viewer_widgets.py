from django.templatetags.static import static
widgets = [{
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
            static("feature_list/js/view/feature-list-service.js"),
            static("feature_list/js/view/feature-list-directive.js"),
        ],
        "css": [
            static("feature_list/css/view.css"),
        ]
    },
}]