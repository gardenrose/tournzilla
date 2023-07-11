import json
from django.http import response
from django.http import request
from django.http.response import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .utils import updateTeam, getTeam, deleteTeam, getTeams, \
      createTeam, createFact, getAchievements, getForum, getUserAchievements, \
      getPlayers, getPlayer, getForumComments, getForumComment, deleteForumComment, \
      createForumComment, updateForumPost, getParticipants, createParticipant
from django.core.files.storage import default_storage
from rest_framework import viewsets
from django.http import HttpRequest, QueryDict
from django.http.request import RawPostDataException
from rest_framework.decorators import authentication_classes, permission_classes

from api import utils
# Create your views here.


@api_view(['GET', 'POST', 'PUT', 'DELETE'])
def getRoutes(request: HttpRequest):
    routes = [
        {
            'Endpoint': '/teams/',
            'method': 'GET',
            'body': None,
            'description': 'Returns an array of teams'
        },
        {
            'Endpoint': '/teams/id',
            'method': 'GET',
            'body': None,
            'description': 'Returns a single team object'
        },
        {
            'Endpoint': '/teams/create/',
            'method': 'POST',
            'body': {'body': ""},
            'description': 'Create new team'
        },
        {
            'Endpoint': '/teams/id/edit/',
            'method': 'PUT',
            'body': {'body': ""},
            'description': 'Edit team'
        },
        {
            'Endpoint': '/teams/id/delete/',
            'method': 'DELETE',
            'body': None,
            'description': 'Deletes and exiting team'
        },

        {
            'Endpoint': '/facts/',
            'method': 'GET',
            'body': None,
            'description': 'Returns an array of facts'
        },
        {
            'Endpoint': '/facts/id',
            'method': 'GET',
            'body': None,
            'description': 'Returns a single fact object'
        },
        {
            'Endpoint': '/facts/create/',
            'method': 'POST',
            'body': {'body': ""},
            'description': 'Create new fact'
        },
        {
            'Endpoint': '/users/id',
            'method': 'GET',
            'body': None,
            'description': 'Returns a single user object'
        },
    ]
    return Response(routes)


@api_view(['GET', 'POST'])
@authentication_classes([])
@permission_classes([])
def getTeams(request: HttpRequest):
    if request.method == 'GET':
        return utils.getTeams(request)
    if request.method == 'POST':
        return utils.createTeam(request)


@api_view(['GET', 'PUT', 'DELETE'])
@authentication_classes([])
@permission_classes([])
def getTeam(request: HttpRequest, pk):
    if request.method == 'GET':
        return utils.getTeam(request, pk)
    if request.method == 'PUT':
        return utils.updateTeam(request, pk)
    if request.method == 'DELETE':
        return utils.deleteTeam(request, pk)


@api_view(['GET', 'POST'])
@authentication_classes([])
@permission_classes([])
def getFacts(request: HttpRequest):
    if request.method == 'GET':
        return utils.getFacts(request)
    if request.method == 'POST':
        return utils.createFact(request)

@api_view(['GET', 'PUT', 'DELETE'])
@authentication_classes([])
@permission_classes([])
def getFact(request: HttpRequest, pk):
    if request.method == 'GET':
        return utils.getFact(request, pk)

@api_view(['GET', 'POST'])
@authentication_classes([])
@permission_classes([])
def getUsers(request: HttpRequest):
    if request.method == 'GET':
        return utils.getUsers(request)
    if request.method == 'POST':
        return utils.createUser(request)

@api_view(['GET', 'PUT', 'DELETE'])
@authentication_classes([])
@permission_classes([])
def getUser(request: HttpRequest, pk):
    if request.method == 'GET':
        return utils.getUser(request, pk)
    if request.method == 'PUT':
        return utils.updateUser(request, pk)
    if request.method == 'DELETE':
        return utils.deleteUser(request, pk)
    

@api_view(['GET', 'POST'])
@authentication_classes([])
@permission_classes([])
def getUserAchievements(request: HttpRequest, pk):
    if request.method == 'GET':
        return utils.getUserAchievements(request, pk)
    if request.method == 'POST':
        return utils.createUserAchievement(request, pk)


@api_view(['GET'])
@authentication_classes([])
@permission_classes([])
def getAchievements(request: HttpRequest, pk):
    if request.method == 'GET':
        return utils.getAchievements(request, pk)

@api_view(['GET', 'POST'])
@authentication_classes([])
@permission_classes([])
def getFavorites(request: HttpRequest, uid):

    if request.method == 'GET':
        return utils.getFavorites(request, uid)
    if request.method == 'POST':
        return utils.createFavorite(request)

@api_view(['DELETE'])
@authentication_classes([])
@permission_classes([])
def deleteFavorite(request: HttpRequest, uid, tid):
    if request.method == 'DELETE':
        return utils.deleteFavorite(request, uid, tid)

@api_view(['GET', 'POST'])
@authentication_classes([])
@permission_classes([])
def getForum(request: HttpRequest):
    if request.method == 'GET':
        return utils.getForum(request)
    if request.method == 'POST':
        return utils.createForumPost(request)

@api_view(['GET', 'PUT', 'DELETE'])
@authentication_classes([])
@permission_classes([])
def getForumPost(request: HttpRequest, pk):

    if request.method == 'GET':
        return utils.getForumPost(request, pk)

    if request.method == 'PUT':
        return utils.updateForumPost(request, pk)

    if request.method == 'DELETE':
        return utils.deleteForumPost(request, pk)
    

@api_view(['GET'])
@authentication_classes([])
@permission_classes([])
def getPlayers(request: HttpRequest):
    if request.method == 'GET':
        return utils.getPlayers(request)
    
@api_view(['GET', 'PUT', 'DELETE', 'POST'])
@authentication_classes([])
@permission_classes([])
def getPlayer(request: HttpRequest, pk):
    if request.method == 'GET':
        return utils.getPlayer(request, pk)
    if request.method == 'PUT':
        return utils.updatePlayer(request, pk)
    if request.method == 'DELETE':
        return utils.deletePlayer(request, pk)
    if request.method == 'POST':
        return utils.createPlayer(request, pk)
    
@api_view(['GET', 'POST', 'DELETE'])
@authentication_classes([])
@permission_classes([])
def getForumComments(request: HttpRequest, pk):
    if request.method == 'GET':
        return utils.getForumComments(request, pk)
    if request.method == 'POST':
        return utils.createForumComment(request, pk)
    if request.method == 'DELETE':
        return utils.deleteForumComments(request, pk)

@api_view(['GET', 'DELETE', 'PUT'])
@authentication_classes([])
@permission_classes([])
def getForumComment(request: HttpRequest, pid, cid):
    if request.method == 'GET':
        return utils.getForumComment(request, pid, cid)
    if request.method == 'DELETE':
        return utils.deleteForumComment(request,pid,cid)
    if request.method == 'PUT':
        return utils.editForumComment(request,pid,cid)
    
@api_view(['GET', 'POST'])
@authentication_classes([])
@permission_classes([])
def getNews(request: HttpRequest):
    if request.method == 'GET':
        return utils.getNews(request)
    if request.method == 'POST':
        return utils.createNews(request)
    
@api_view(['GET', 'PUT', 'DELETE'])
@authentication_classes([])
@permission_classes([])
def getNewsDetails(request: HttpRequest, pk):
    if request.method == 'GET':
        return utils.getNewsDetails(request, pk)
    if request.method == 'PUT':
        return utils.editNewsDetails(request, pk)
    if request.method == 'DELETE':
        return utils.deleteNewsDetails(request, pk)
    
@api_view(['GET', 'POST', 'DELETE'])
@authentication_classes([])
@permission_classes([])
def getNewsComments(request: HttpRequest, pk):
    if request.method == 'GET':
        return utils.getNewsComments(request, pk)
    if request.method == 'POST':
        return utils.createNewsComment(request, pk)
    if request.method == 'DELETE':
        return utils.deleteNewsComments(request, pk)

@api_view(['GET', 'DELETE', 'PUT'])
@authentication_classes([])
@permission_classes([])
def getNewsComment(request: HttpRequest, pid, cid):
    if request.method == 'GET':
        return utils.getNewsComment(request, pid, cid)
    if request.method == 'DELETE':
        return utils.deleteNewsComment(request,pid,cid)
    if request.method == 'PUT':
        return utils.editNewsComment(request,pid,cid)
    
@api_view(['GET', 'POST'])
@authentication_classes([])
@permission_classes([])
def getChampionships(request: HttpRequest):
    if request.method == 'GET':
        return utils.getChampionships(request)
    if request.method == 'POST':
        return utils.createChampionship(request)
    
@api_view(['GET', 'PUT', 'DELETE'])
@authentication_classes([])
@permission_classes([])
def getChampionship(request: HttpRequest, pk):
    if request.method == 'GET':
        return utils.getChampionship(request, pk)
    if request.method == 'DELETE':
        return utils.deleteChampionship(request, pk)
    if request.method == 'PUT':
        return utils.editChampionship(request, pk)
    

@api_view(['GET', 'POST', 'DELETE'])
@authentication_classes([])
@permission_classes([])
def getParticipants(request: HttpRequest, cid):
    if request.method == 'GET':
        return utils.getParticipants(request, cid)
    if request.method == 'POST':
        return utils.createParticipant(request, cid)
    if request.method == 'DELETE':
        return utils.deleteParticipants(request, cid)
    

@api_view(['GET', 'POST', 'DELETE'])
@authentication_classes([])
@permission_classes([])
def getMatches(request: HttpRequest, cid):
    if request.method == 'GET':
        return utils.getMatches(request, cid)
    if request.method == 'POST':
        return utils.createMatch(request, cid)
    if request.method == 'DELETE':
        return utils.deleteMatches(request, cid)
    

@api_view(['GET', 'PUT'])
@authentication_classes([])
@permission_classes([])
def getMatch(request: HttpRequest, mid, cid):
    if request.method == 'GET':
        return utils.getMatch(request, mid, cid)
    if request.method == 'PUT':
        return utils.editMatch(request, mid,cid)
    
@api_view(['GET'])
@authentication_classes([])
@permission_classes([])
def getMarketValue(request: HttpRequest, pid):
    if request.method == 'GET':
        return utils.getMarketValue(request, pid)

@api_view(['POST', 'DELETE'])
@authentication_classes([])
@permission_classes([])
def addMarketValue(request: HttpRequest, pid, yr):
    if request.method == 'POST':
        return utils.addOrEditMarketValue(request, pid, yr)
    if request.method == 'DELETE':
        return utils.deleteMarketValue(request, pid, yr)
    
@api_view(['GET', 'POST', 'PUT'])
@authentication_classes([])
@permission_classes([])   
def getReports(request: HttpRequest):
    if request.method in ['GET']:
        return utils.getReports(request)
    if request.method in ['POST']:
        return utils.createReport(request)
    
@api_view(['GET', 'PUT', 'DELETE'])
@authentication_classes([])
@permission_classes([])   
def getReport(request: HttpRequest, rid):
    if request.method in ['GET']:
        return utils.getReport(request, rid)
    if request.method in ['PUT']:
        return utils.editReport(request, rid)
    if request.method in ['DELETE']:
        return utils.deleteReport(request, rid)
    
    
@api_view(['GET', 'POST', 'PUT'])
@authentication_classes([])
@permission_classes([])   
def getReferees(request: HttpRequest):
    if request.method in ['GET']:
        return utils.getReferees(request)
    if request.method in ['POST']:
        return utils.createReferee(request)
    
@api_view(['GET', 'PUT'])
@authentication_classes([])
@permission_classes([])   
def getReferee(request: HttpRequest, rname):
    if request.method in ['GET']:
        return utils.getReferee(request, rname)
    if request.method in ['PUT']:
        return utils.retireReferee(request, rname)

@api_view(['GET', 'POST'])
@authentication_classes([])
@permission_classes([])   
def getAvailableReferees(request: HttpRequest, rdate):
    if request.method in ['GET']:
        return utils.getAvailableRefs(request, rdate)
    if request.method in ['POST']:
        return utils.setRefereeingDate(request, rdate)
    
@api_view(['GET', 'POST', 'DELETE', 'PUT'])
@authentication_classes([])
@permission_classes([]) 
def getSubstitutions(request: HttpRequest, mid):
    if request.method in ['GET']:
        return utils.getMatchSubs(request, mid)
    if request.method in ['POST']:
        return utils.createMatchSub(request, mid)
    if request.method in ['DELETE']:
        return utils.deleteMatchSubs(request, mid)
    if request.method in ['PUT']:
        return utils.replaceSubsWithNull(request, mid)

@api_view(['GET', 'POST', 'DELETE'])
@authentication_classes([])
@permission_classes([])    
def getGroups(request: HttpRequest, cid):
    if request.method in ['GET']:
        return utils.getGroups(request, cid)
    if request.method in ['POST']:
        return utils.createGroup(request, cid)
    if request.method in ['DELETE']:
        return utils.deleteGroups(request, cid) 
    
@api_view(['GET', 'PUT'])
@authentication_classes([])
@permission_classes([])    
def getGroup(request: HttpRequest, cid, gid):
    if request.method in ['GET']:
        return utils.getGroup(request, cid, gid)
    if request.method in ['PUT']:
        return utils.editGroup(request, cid, gid)
    
@api_view(['GET', 'POST', 'DELETE'])
@authentication_classes([])
@permission_classes([])    
def getFormations(request: HttpRequest, mid):
    if request.method in ['GET']:
        return utils.getFormations(request, mid)
    if request.method in ['POST']:
        return utils.createFormation(request, mid)
    if request.method in ['DELETE']:
        return utils.deleteFormations(request, mid) 
    
@api_view(['GET', 'PUT'])
@authentication_classes([])
@permission_classes([])    
def getFormation(request: HttpRequest, mid, fid):
    if request.method in ['GET']:
        return utils.getFormation(request, mid, fid)
    if request.method in ['PUT']:
        return utils.updateFormation(request, mid, fid)

@api_view(['GET', 'POST', 'DELETE'])
@authentication_classes([])
@permission_classes([])    
def getGoals(request: HttpRequest, mid):
    if request.method in ['GET']:
        return utils.getGoals(request, mid)
    if request.method in ['POST']:
        return utils.createGoal(request, mid)
    if request.method in ['DELETE']:
        return utils.deleteGoals(request, mid) 
    
@api_view(['GET', 'POST', 'DELETE'])
@authentication_classes([])
@permission_classes([])    
def getGoal(request: HttpRequest, mid, gid):
    if request.method in ['GET']:
        return utils.getGoal(request, mid, gid)
    if request.method in ['DELETE']:
        return utils.nullifyGoal(request, mid, gid) 
    
@api_view(['GET', 'POST', 'DELETE'])
@authentication_classes([])
@permission_classes([])    
def getYellowCards(request: HttpRequest, mid):
    if request.method in ['GET']:
        return utils.getYellowCards(request, mid)
    if request.method in ['POST']:
        return utils.createYellowCard(request, mid)
    if request.method in ['DELETE']:
        return utils.deleteYellowCards(request, mid) 
    
@api_view(['GET', 'POST', 'DELETE'])
@authentication_classes([])
@permission_classes([])    
def getRedCards(request: HttpRequest, cid):
    if request.method in ['GET']:
        return utils.getRedCards(request, cid)
    if request.method in ['POST']:
        return utils.createRedCard(request, cid)
    if request.method in ['DELETE']:
        return utils.deleteRedCards(request, cid) 
    
@api_view(['GET', 'POST', 'DELETE'])
@authentication_classes([])
@permission_classes([])    
def getPenalties(request: HttpRequest, mid):
    if request.method in ['GET']:
        return utils.getPenalties(request, mid)
    if request.method in ['POST']:
        return utils.createPenalty(request, mid)
    if request.method in ['DELETE']:
        return utils.deletePenalties(request, mid) 