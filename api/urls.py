from django.urls import path

from tournzilla import settings
from . import views
from rest_framework import routers
from django.contrib import admin
from django.conf.urls.static import static

router = routers.DefaultRouter()

urlpatterns = [
    #path('', views.getRoutes, name="routes"),
    path('/teams/', views.getTeams, name="teams"),
    path('/teams/<int:pk>/', views.getTeam, name="team"),
    path('/teams/<int:pk>/delete/', views.deleteTeam, name="teamdelete"),
    path('/achievements/<int:pk>/', views.getAchievements, name="achievements"),
    path('/userachievements/<int:pk>/', views.getUserAchievements, name="userachievements"),
    path('/tournaments/', views.getChampionships, name="tournaments"),
    path('/tournaments/<int:pk>/', views.getChampionship, name="tournament"),
    path('/facts/', views.getFacts, name="facts"),
    path('/facts/<int:pk>/', views.getFact, name="fact"),
    path('/facts/create/', views.createFact, name="factcreate"),
    path('/users/', views.getUsers, name='users'),
    path('/users/<int:pk>/', views.getUser, name='user'),
    path('/favorites/<int:uid>/', views.getFavorites, name='favorites'),
    path('/favorites/<int:uid>/<int:tid>/', views.deleteFavorite, name='deletefavorite'),
    path('/forum/', views.getForum, name="forum"),
    path('/forum/<int:pk>/', views.getForumPost, name="forumpost"),
    path('/forumcomments/<int:pk>/', views.getForumComments, name="forumcomments"),
    path('/forumcomments/<int:pid>/<int:cid>/', views.getForumComment, name="forumcomment"),
    path('/players/', views.getPlayers, name="players"),
    path('/players/<int:pk>/', views.getPlayer, name="player"),    
    path('/news/', views.getNews, name="news"),
    path('/news/<int:pk>/', views.getNewsDetails, name="newsdetails"),
    path('/newscomments/<int:pk>/', views.getNewsComments, name="newscomments"),
    path('/newscomments/<int:pid>/<int:cid>/', views.getNewsComment, name="newscomment"),
    path('/tournaments/<int:cid>/participants/', views.getParticipants, name="participants"),
    path('/tournaments/<int:cid>/matches/', views.getMatches, name="matches"),
    path('/tournaments/<int:cid>/matches/<int:mid>/', views.getMatch, name="match"),
    path('/marketvalue/<int:pid>/', views.getMarketValue, name="marketvalue"),
    path('/marketvalueadd/<int:pid>/<int:yr>/', views.addMarketValue, name="marketvalueadd"),
    path('/reports/', views.getReports, name="reports"),
    path('/reports/<int:rid>/', views.getReport, name="report"),
    path('/referees/', views.getReferees, name="referees"),
    path('/referees/<str:rname>/', views.getReferee, name="referee"),
    path('/refereeing/<str:rdate>/', views.getAvailableReferees, name="refereeing"),
    path('/substitutions/<int:mid>/', views.getSubstitutions, name="substitution"),
    path('/groups/<int:cid>/', views.getGroups, name="groups"),
    path('/groups/<int:cid>/<int:gid>/', views.getGroup, name="group"),
    path('/formations/<int:mid>/', views.getFormations, name="formations"),
    path('/formations/<int:mid>/<int:fid>/', views.getFormation, name="formation"),
    path('/goals/<int:mid>/', views.getGoals, name="goals"),
    path('/goals/<int:mid>/<int:gid>/', views.getGoal, name="goal"),
    path('/yellowcards/<int:mid>/', views.getYellowCards, name="yellowcards"),
    path('/redcards/<int:cid>/', views.getRedCards, name="redcards"),
    path('/penalties/<int:mid>/', views.getPenalties, name="penalties"),

] + static(settings.MEDIA_URL, document_root = settings.MEDIA_ROOT)
