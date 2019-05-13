import os
from pathlib import Path

CARTOVIEW_ROOT = Path().absolute()

TEMPLATE_STATIC_ROOT = os.path.join(
    CARTOVIEW_ROOT, "cartoview_apps", "cartoview_feature_list", "templates")
INDEX_STATIC_ROOT = os.path.join(TEMPLATE_STATIC_ROOT, "index_view", "build", "static")
CONFIG_STATIC_ROOT = os.path.join(TEMPLATE_STATIC_ROOT, "config_view", "build", "static")

STATICFILES_DIRS += (INDEX_STATIC_ROOT,)
STATICFILES_DIRS += (CONFIG_STATIC_ROOT,)
