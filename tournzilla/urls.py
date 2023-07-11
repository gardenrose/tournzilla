
from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView
from django.conf.urls.static import static
from tournzilla import settings

urlpatterns = [
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.jwt')),
    path('admin', admin.site.urls),
    path('api', include('api.urls')),
    path('', TemplateView.as_view(template_name='index.html')),
    path('tournaments', TemplateView.as_view(template_name='index.html')),
    path('players', TemplateView.as_view(template_name='index.html')),
    path('favorites', TemplateView.as_view(template_name='index.html')),
    path('deletefavorites/<uid>/<tid>', TemplateView.as_view(template_name='index.html')),
    path('rankings', TemplateView.as_view(template_name='index.html')),
    path('news', TemplateView.as_view(template_name='index.html')),
    path('forum', TemplateView.as_view(template_name='index.html')),
    path('about', TemplateView.as_view(template_name='index.html')),
    path('termsconditions', TemplateView.as_view(template_name='index.html')),
    path('players/<id>', TemplateView.as_view(template_name='index.html')),
    path('achievements/<id>', TemplateView.as_view(template_name='index.html')),
    path('userachievements/<id>', TemplateView.as_view(template_name='index.html')),
    path('tournaments/<id>', TemplateView.as_view(template_name='index.html')),
    path('tournaments/create/', TemplateView.as_view(template_name='index.html')),
    path('news', TemplateView.as_view(template_name='index.html')),
    path('news/<id>', TemplateView.as_view(template_name='index.html')),
] + static(settings.MEDIA_URL,document_root=settings.MEDIA_ROOT)

urlpatterns += [re_path(r'^.*$', TemplateView.as_view(template_name='index.html'))]