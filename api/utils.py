#from rest_framework.response import Response
import base64
import json
import re
from django.forms import model_to_dict
from django.http import HttpResponse
from django.http import request
import ast
from rest_framework.decorators import authentication_classes, permission_classes
from django.http import JsonResponse
from rest_framework.renderers import JSONRenderer
from api import views
from .models import Championship, Comment, Fact, FootballMatch, Formation, ForumComment, Goal, Group, MarketValue, News, Participant, Penalty, Player, RedCard, Referee, Refereeing, Report, Substitution, Team, Achievement, User, Favorite, ForumPost, UserAchievement, YellowCard
from .serializers import ChampionshipSerializer, CommentSerializer, FactSerializer, FavoriteSerializer, FormationSerializer, ForumCommentSerializer, GoalSerializer, GroupSerializer, MarketValueSerializer, MatchSerializer, NewsSerializer, ParticipantSerializer, PenaltySerializer, PlayerSerializer, RedCardSerializer, RefereeSerializer, RefereeingSerializer, ReportSerializer, SubstitutionSerializer, TeamSerializer, UserAchievementSerializer, UserCreateSerializer, AchievementSerializer, ForumSerializer, YellowCardSerializer
from django.http import HttpRequest, QueryDict
from django.http.request import RawPostDataException
from rest_framework.decorators import api_view
import PIL        
from PIL import Image   
#import shutil
import os
from datetime import date, datetime, timedelta
import requests
import base64
from django.contrib.auth import get_user_model
from django.db.models import Q

def getTeams(request: HttpRequest):
    teams = Team.objects.all().exclude(id=500).order_by('-id')
    serializer = TeamSerializer(teams, many=True)
    return HttpResponse(json.dumps(serializer.data))

def getTeam(request: HttpRequest, pk):
    teams = Team.objects.get(id=pk)
    serializer = TeamSerializer(teams, many=False)
    return HttpResponse(json.dumps(serializer.data))

def getUserAchievements(request: HttpRequest, pk):
    ids = []
    userAchs = UserAchievement.objects.filter(userid=pk)   
    for ach in userAchs:
        ids.append(ach.achievementid)
    return ids

def createUserAchievement(request: HttpRequest, pk):
    userAch = UserAchievement()
    userAch.achievementid = request.POST['achievementid']
    userAch.userid = pk
    userAch.save()
    return JsonResponse({"notification":"User achievement created!"})

def getAchievements(request: HttpRequest, pk):
    userAchs = []
    userAchievements = getUserAchievements(request, pk)
    achievements = Achievement.objects.all()
    for achievement in achievements:
        print(achievement.achievementid, achievement.achievementid in userAchievements)
        if achievement.achievementid in userAchievements:
            userAchs.append(achievement)
    serializer = AchievementSerializer(userAchs, many=True)
    return HttpResponse(json.dumps(serializer.data))

def getFavorites(request: HttpRequest, uid):
    favTeams = []
    favs = Favorite.objects.filter(userid=uid)
    for fav in favs:
        favTeams.append(Team.objects.get(id=fav.teamid))
    serializer = TeamSerializer(list(dict.fromkeys(favTeams)), many=True)
    return HttpResponse(json.dumps(serializer.data))

#POST REQUEST STARI
'''
@api_view(['POST'])
def createTeam(request: HttpRequest):
    print("*" * 100)
    print(dict(request.POST)['name'][0])
    print("*" * 100)

    team = Team.objects.create(**ast.literal_eval(request.body.decode('utf-8')))
    serializer = TeamSerializer(team, many=False)
    return JsonResponse(serializer.data)

    #return JsonResponse({1:2})
'''

def createTeam(request: HttpRequest):
    r = requests.get("http://localhost:8000/api/teams/")

    for x in json.loads(r.content):
        if (x['name'] == request.POST.get('name',False)):
            return JsonResponse({"message":"Team with chosen name already exists."})
        elif (x['coachname'] == request.POST.get('coachname', False)):
            return JsonResponse({"message":"Team with this coach already exists."})

    team = Team()
    team.name = request.POST['name']
    team.gender = request.POST['gender']
    team.coachname = request.POST['coachname']
    team.totalwins = request.POST['totalwins'] if 'totalwins' in request.POST else Team._meta.get_field('totalwins').get_default()
    team.totallosses = request.POST['totallosses'] if 'totallosses' in request.POST else Team._meta.get_field('totallosses').get_default()
    team.totaldraws = request.POST['totaldraws'] if 'totaldraws' in request.POST else Team._meta.get_field('totaldraws').get_default()
    team.timeschampion = request.POST['timeschampion'] if 'timeschampion' in request.POST else Team._meta.get_field('timeschampion').get_default()
    team.timessecond = request.POST['timessecond'] if 'timessecond' in request.POST else Team._meta.get_field('timessecond').get_default()
    team.timesthird = request.POST['timesthird'] if 'timesthird' in request.POST else Team._meta.get_field('timesthird').get_default()
    team.country = request.POST['country'] if 'country' in request.POST else Team._meta.get_field('country').get_default()
    team.goals = request.POST['goals'] if 'goals' in request.POST else Team._meta.get_field('goals').get_default()
    team.concededgoals = request.POST['concededgoals'] if 'concededgoals' in request.POST else Team._meta.get_field('concededgoals').get_default()
    team.redcards = request.POST['redcards'] if 'redcards' in request.POST else Team._meta.get_field('redcards').get_default()
    team.yellowcards = request.POST['yellowcards'] if 'yellowcards' in request.POST else Team._meta.get_field('yellowcards').get_default()
    team.saves = request.POST['saves'] if 'saves' in request.POST else Team._meta.get_field('saves').get_default()
    team.offsides = request.POST['offsides'] if 'offsides' in request.POST else Team._meta.get_field('offsides').get_default()
    team.fouls = request.POST['fouls'] if 'fouls' in request.POST else Team._meta.get_field('fouls').get_default()
    team.possession = request.POST['possession'] if 'possession' in request.POST else Team._meta.get_field('possession').get_default()
    team.shootingaccuracy = request.POST['shootingaccuracy'] if 'shootingaccuracy' in request.POST else Team._meta.get_field('shootingaccuracy').get_default()
    team.rating = request.POST['rating'] if 'rating' in request.POST else Team._meta.get_field('rating').get_default()
    team.coachdesc = request.POST['coachdesc'] if 'coachdesc' in request.POST else Team._meta.get_field('coachdesc').get_default()
    team.slogan = request.POST['slogan'] if 'slogan' in request.POST else Team._meta.get_field('slogan').get_default()
    team.foundationyear = request.POST['foundationyear'] if 'foundationyear' in request.POST else Team._meta.get_field('foundationyear').get_default()
    team.isvalid = False

    if request.POST['name'] == '' or request.POST['coachname'] == '':
        return JsonResponse({"message":"Please fill in all required fields."})
    if 'coachdesc' in request.POST and len(request.POST['coachdesc']) > 200:
        return JsonResponse({"message":"Coach description too long. It should be up to 200 characters."})

    if ('coachphoto' in request.POST):
        team.coachphoto = request.POST['coachphoto']
    elif ('coachphoto' in request.FILES):
        now = datetime.now()
        img = Image.open(request.FILES['coachphoto'])
        coachphotoFileName = "media/"+now.strftime("%d-%m-%Y-%H-%M-%S")+str(request.FILES['coachphoto'])
        img.save(coachphotoFileName)
        #img.show()
        team.coachphoto = "../../"+coachphotoFileName

    if ('jersey1' in request.POST):
        team.jersey1 = request.POST['jersey1']
    elif ('jersey1' in request.FILES):
        now = datetime.now()
        img = Image.open(request.FILES['jersey1'])
        jersey1FileName = "media/"+now.strftime("%d-%m-%Y-%H-%M-%S")+str(request.FILES['jersey1'])
        img.save(jersey1FileName)
        team.jersey1 = "../../"+jersey1FileName

    if ('jersey2' in request.POST):
        team.jersey2 = request.POST['jersey2']
    elif ('jersey2' in request.FILES):
        now = datetime.now()
        img = Image.open(request.FILES['jersey2'])
        jersey2FileName = "media/"+now.strftime("%d-%m-%Y-%H-%M-%S")+str(request.FILES['jersey2'])
        img.save(jersey2FileName)
        team.jersey2 = "../../"+jersey2FileName

    if ('itemphoto' in request.POST):
        team.itemphoto = request.POST['itemphoto']
    elif ('itemphoto' in request.FILES):
        now = datetime.now()
        img = Image.open(request.FILES['itemphoto'])
        itemphotoFileName = "media/"+now.strftime("%d-%m-%Y-%H-%M-%S")+str(request.FILES['itemphoto'])
        img.save(itemphotoFileName)
        team.itemphoto = "../../"+itemphotoFileName

    if ('logo' in request.POST):
        team.logo = request.POST['logo']
    elif ('logo' in request.FILES):
        now = datetime.now()
        img = Image.open(request.FILES['logo'])
        logoFileName = "media/"+now.strftime("%d-%m-%Y-%H-%M-%S")+str(request.FILES['logo'])
        img.save(logoFileName)
        team.logo = "../../"+logoFileName

    team.save()
    serializer = TeamSerializer(team, many=False)
    return JsonResponse(serializer.data)

def updateTeam(request: HttpRequest, pk):
    #data = request.body.decode('utf-8')
    print(request.POST)
    previousState = Team.objects.get(id=pk)
    #team = json.loads(json.dumps(request.POST))
    r = requests.get("http://localhost:8000/api/teams/")

    for x in json.loads(r.content):
        if (x['name'] == request.POST.get('name',False) and x['id'] != pk):
            return JsonResponse({"message":"Team with chosen name already exists."})
        elif (x['coachname'] == request.POST.get('coachname', False) and x['id'] != pk):
            return JsonResponse({"message":"Team with this coach already exists."})

    team = Team()
    team.id = pk
    if 'name' in request.POST:
        team.name = request.POST['name'] if 'name' in request.POST else previousState.name
    if 'gender' in request.POST:
        team.gender = request.POST['gender'] if 'gender' in request.POST else previousState.name
    if 'coachname' in request.POST:
        team.coachname = request.POST['coachname']  if 'coachname' in request.POST else previousState.name
    if 'totalwins' in request.POST:
        team.totalwins = request.POST['totalwins'] if 'totalwins' in request.POST else previousState.name
    if 'totallosses' in request.POST:
        team.totallosses = request.POST['totallosses'] if 'totallosses' in request.POST else previousState.name
    if 'totaldraws' in request.POST:
        team.totaldraws = request.POST['totaldraws'] if 'totaldraws' in request.POST else previousState.name
    if 'timeschampion' in request.POST:
        team.timeschampion = request.POST['timeschampion'] if 'timeschampion' in request.POST else previousState.name
    if 'timessecond' in request.POST:
        team.timessecond = request.POST['timessecond'] if 'timessecond' in request.POST else previousState.name
    if 'timesthird' in request.POST:
        team.timesthird = request.POST['timesthird'] if 'timesthird' in request.POST else previousState.name
    if 'country' in request.POST:
        team.country = request.POST['country'] if 'country' in request.POST else previousState.name
    if 'goals' in request.POST:
        team.goals = request.POST['goals'] if 'goals' in request.POST else previousState.name
    if 'concededgoals' in request.POST:
        team.concededgoals = request.POST['concededgoals'] if 'concededgoals' in request.POST else previousState.name
    if 'redcards' in request.POST:   
        team.redcards = request.POST['redcards'] if 'redcards' in request.POST else previousState.name
    if 'yellowcards' in request.POST:
        team.yellowcards = request.POST['yellowcards'] if 'yellowcards' in request.POST else previousState.name
    if 'saves' in request.POST:
        team.saves = request.POST['saves'] if 'saves' in request.POST else previousState.name
    if 'offsides' in request.POST:
        team.offsides = request.POST['offsides'] if 'offsides' in request.POST else previousState.name
    if 'fouls' in request.POST:
        team.fouls = request.POST['fouls'] if 'fouls' in request.POST else previousState.name
    if 'possession' in request.POST:
        team.possession = request.POST['possession'] if 'possession' in request.POST else previousState.name
    if 'shootingaccuracy' in request.POST:
        team.shootingaccuracy = request.POST['shootingaccuracy'] if 'shootingaccuracy' in request.POST else previousState.name
    if 'rating' in request.POST:
        team.rating = request.POST['rating'] if 'rating' in request.POST else previousState.name
    if 'coachdesc' in request.POST:
        team.coachdesc = request.POST['coachdesc'] if 'coachdesc' in request.POST else previousState.name
    if 'slogan' in request.POST:
        team.slogan = request.POST['slogan'] if 'slogan' in request.POST else previousState.name
    if 'foundationyear' in request.POST:
        team.foundationyear = request.POST['foundationyear'] if 'foundationyear' in request.POST else previousState.name
    team.isvalid = request.POST['isvalid'].capitalize() if 'isvalid' in request.POST else False
    
    if not team.name:
        return JsonResponse({"message": "Please fill in all required fields."})
    if not team.coachname:
        return JsonResponse({"message": "Please fill in all required fields."})
    if len(team.coachdesc) > 200:
        return JsonResponse({"message":"Coach description too long. It should be up to 200 characters."})

    if ('coachphoto' in request.POST):
        team.coachphoto = request.POST['coachphoto']
    elif ('coachphoto' in request.FILES):
        now = datetime.now()
        img = Image.open(request.FILES['coachphoto'])
        coachphotoFileName = "media/"+now.strftime("%d-%m-%Y-%H-%M-%S")+str(request.FILES['coachphoto'])
        img.save(coachphotoFileName)
        #img.show()
        team.coachphoto = "../../"+coachphotoFileName

    if ('jersey1' in request.POST):
        team.jersey1 = request.POST['jersey1']
    elif ('jersey1' in request.FILES):
        now = datetime.now()
        img = Image.open(request.FILES['jersey1'])
        jersey1FileName = "media/"+now.strftime("%d-%m-%Y-%H-%M-%S")+str(request.FILES['jersey1'])
        img.save(jersey1FileName)
        team.jersey1 = "../../"+jersey1FileName

    if ('jersey2' in request.POST):
        team.jersey2 = request.POST['jersey2']
    elif ('jersey2' in request.FILES):
        now = datetime.now()
        img = Image.open(request.FILES['jersey2'])
        jersey2FileName = "media/"+now.strftime("%d-%m-%Y-%H-%M-%S")+str(request.FILES['jersey2'])
        img.save(jersey2FileName)
        team.jersey2 = "../../"+jersey2FileName

    if ('itemphoto' in request.POST):
        team.itemphoto = request.POST['itemphoto']
    elif ('itemphoto' in request.FILES):
        now = datetime.now()
        img = Image.open(request.FILES['itemphoto'])
        itemphotoFileName = "media/"+now.strftime("%d-%m-%Y-%H-%M-%S")+str(request.FILES['itemphoto'])
        img.save(itemphotoFileName)
        team.itemphoto = "../../"+itemphotoFileName

    if ('logo' in request.POST):
        team.logo = request.POST['logo']
    elif ('logo' in request.FILES):
        now = datetime.now()
        img = Image.open(request.FILES['logo'])
        logoFileName = "media/"+now.strftime("%d-%m-%Y-%H-%M-%S")+str(request.FILES['logo'])
        img.save(logoFileName)
        team.logo = "../../"+logoFileName

    team.save()
    serializer = TeamSerializer(instance=previousState, data=team)
    if serializer.is_valid():
        serializer.save()
    else:
        print(serializer.errors)
    return JsonResponse(serializer.data)

#@api_view(['DELETE'])
def deleteTeam(request: HttpRequest, pk):
    team = Team.objects.get(id=pk)
    favs = Favorite.objects.filter(teamid = pk)
    favs.delete()
    footballers = Player.objects.filter(currentteam = pk)
    for footballer in footballers:
        footballer.currentteam = None
        footballer.save()
    partcs = Participant.objects.filter(teamid = pk)
    tournaments = []
    for part in partcs:
        tournaments.append(part.tournamentid)
    matchIdList = []
    matches = []
    for t in tournaments:
        matches = FootballMatch.objects.filter(championshipid = t)
        for m in matches:
            matchIdList.append(m.matchid)
    for m in matchIdList:
        ycards = YellowCard.objects.filter(matchid = m)
        ycards.delete()
        rcards = RedCard.objects.filter(matchid = m)
        rcards.delete()
        subs = Substitution.objects.filter(matchid = m)
        subs.delete()
        goals = Goal.objects.filter(matchid = m)
        goals.delete()
        penalties = Penalty.objects.filter(matchid = m)
        penalties.delete()
        formations = Formation.objects.filter(matchid = m)
        formations.delete()
    for t in tournaments:
        championship = Championship.objects.get(championshipid = t)
        championship.winner = None
        championship.secondplace = None
        championship.thirdplace = None
        championship.fourthplace = None
        matches = FootballMatch.objects.filter(championshipid = t)
        groups = Group.objects.filter(championshipid = t)
        partcs = Participant.objects.filter(tournamentid = t)
        matches.delete()
        partcs.delete()
        groups.delete()
        championship.delete()
    team.delete()
    return JsonResponse('Team was deleted!', safe=False)

def getFacts(request: HttpRequest):
    facts = Fact.objects.all().order_by('-id')
    serializer = FactSerializer(facts, many=True)
    return HttpResponse(json.dumps(serializer.data))

def getFact(request: HttpRequest, pk):
    fact = Fact.objects.get(id=pk)
    serializer = FactSerializer(fact, many=False)
    return HttpResponse(json.dumps(serializer.data))

@api_view(['POST'])
def createFact(request: HttpRequest):
    fact = Fact.objects.create(**ast.literal_eval(request.body.decode('utf-8')))
    serializer = FactSerializer(fact, many=False)
    #if serializer.is_valid():
        #print("Chonk")
    return JsonResponse(serializer.data)

def getUsers(request: HttpRequest):
    users = User.objects.all().order_by('-id')
    serializer = UserCreateSerializer(users, many=True)
    return HttpResponse(json.dumps(serializer.data))

def getUser(request: HttpRequest, pk):
    user = User.objects.get(id=pk)
    serializer = UserCreateSerializer(user, many=False)
    return HttpResponse(json.dumps(serializer.data))

def updateUser(request: HttpRequest, pk):
    print(request.POST)
    user = User.objects.get(id=pk)
    somedata = json.loads(json.dumps(request.POST))
    somedata['email']=user.email
    somedata['username']=user.username
    somedata['password']=user.password
    if 'profilephoto' in request.FILES:
        now = datetime.now()
        img = Image.open(request.FILES['profilephoto'])
        profilephotoFileName = "media/"+now.strftime("%d-%m-%Y-%H-%M-%S")+str(request.FILES['profilephoto'])
        img.save(profilephotoFileName)
        #img.show()
        user.profilephoto = "../../"+profilephotoFileName
        print(user.profilephoto)
        somedata['profilephoto'] = user.profilephoto
    serializer = UserCreateSerializer(instance=user, data=somedata)
    if serializer.is_valid():
        serializer.save()
    else:
        print(serializer.errors)
    return JsonResponse(serializer.data)

def deleteUser(request: HttpRequest, pk):
    User = get_user_model()
    user = User.objects.get(id=pk)
    favs = Favorite.objects.filter(userid=pk)
    favs.delete()
    achs = UserAchievement.objects.filter(userid=pk)
    achs.delete()
    comm = Comment.objects.filter(author=user.username)
    comm.delete()
    fcomm = ForumComment.objects.filter(author=user.username)
    fcomm.delete()
    news = News.objects.filter(author=user.username)
    for newsItem in news:
        comments = Comment.objects.filter(newsid=newsItem.id)
        comments.delete()
    news.delete()
    fpost = ForumPost.objects.filter(author=user.username)
    for forumpost in fpost:
        fcomments = ForumComment.objects.filter(forumid=forumpost.id)
        fcomments.delete()
    fpost.delete()
    reports = Report.objects.filter(reporteduser=pk)
    reports2 = Report.objects.filter(sender=pk)
    reports.delete()
    reports2.delete()
    user.delete()
    return JsonResponse({"message":"User was successfully deleted."})

@api_view(['POST'])
def createUser(request: HttpRequest):
    user = User.objects.create(**ast.literal_eval(request.body.decode('utf-8')))
    serializer = UserCreateSerializer(user, many=False)
    return JsonResponse(serializer.data)

def createFavorite(request: HttpRequest):
    fav = Favorite.objects.create(**ast.literal_eval(request.body.decode('utf-8')))
    serializer = FavoriteSerializer(fav, many=False)
    return JsonResponse(serializer.data)

def deleteFavorite(request: HttpRequest, uid, tid):
    team = Favorite.objects.filter(userid=uid, teamid=tid)
    team.delete()
    return JsonResponse('Favorite was deleted!', safe=False)

def getForum(request: HttpRequest):
    forumPosts = ForumPost.objects.all().order_by('-publishdate')
    serializer = ForumSerializer(forumPosts, many=True)
    return HttpResponse(json.dumps(serializer.data))

def getForumPost(request: HttpRequest, pk):
    forumpost = ForumPost.objects.get(id=pk)
    serializer = ForumSerializer(forumpost, many=False)
    return HttpResponse(json.dumps(serializer.data))

def createForumPost(request: HttpRequest):
    fpost = ForumPost()
    forum_post = json.loads(request.body.decode('utf-8'))
    fpost.title = forum_post['title']
    fpost.author = forum_post['author']
    fpost.publishdate = datetime.now()
    fpost.content = forum_post['content']
    fpost.views = 0
    fpost.comments = 0
    fpost.save()
    serializer = ForumSerializer(fpost, many=False)
    return JsonResponse(serializer.data)

def updateForumPost(request: HttpRequest, pk):
    fpost = ForumPost.objects.get(id=pk)
    somedata = json.loads(request.body.decode('utf-8'))

    somedata['author'] = fpost.author
    if not 'content' in somedata:
        somedata['content'] = fpost.content
    if not 'title' in somedata:
        somedata['title'] = fpost.title
    if not 'views' in somedata:
        somedata['views'] = fpost.views
    serializer = ForumSerializer(instance=fpost, data=somedata)
    if serializer.is_valid():
        serializer.save()
    else:
        print(serializer.errors)
    return JsonResponse(serializer.data)

def deleteForumPost(request: HttpRequest, pk):
    fpost = ForumPost.objects.get(id=pk)
    fcomments = ForumComment.objects.filter(forumid = pk)
    fcomments.delete()
    fpost.delete()
    return JsonResponse('Forum post was deleted!', safe=False)

def getForumComments(request: HttpRequest, pk):
    forumcomms = ForumComment.objects.filter(forumid=pk)
    serializer = ForumCommentSerializer(forumcomms, many=True)
    return HttpResponse(json.dumps(serializer.data))

def getForumComment(request: HttpRequest, pid, cid):
    forumcomm = ForumComment.objects.get(forumid=pid, id=cid)
    serializer = ForumCommentSerializer(forumcomm, many=False)
    return HttpResponse(json.dumps(serializer.data))

def createForumComment(request: HttpRequest, pk):
    comment = ForumComment()
    comm = json.loads(request.body.decode('utf-8'))
    comment.forumid = pk
    comment.author = comm['author']
    comment.publishdate = datetime.now()
    comment.content = comm['content']
    comment.save()
    serializer = ForumCommentSerializer(comment, many=False)
    return JsonResponse(serializer.data)

def deleteForumComment(request: HttpRequest, pid, cid):
    comm = ForumComment.objects.get(forumid=pid, id=cid)
    comm.delete()
    return JsonResponse('Post comment was deleted!', safe=False)

def editForumComment(request: HttpRequest, pid, cid):
    comm = ForumComment.objects.get(forumid=pid, id=cid)
    somedata = json.loads(request.body.decode('utf-8'))
    somedata['author'] = comm.author
    somedata['publishdate'] = comm.publishdate
    somedata['forumid'] = comm.forumid
    serializer = ForumCommentSerializer(instance=comm, data=somedata)
    if serializer.is_valid():
        serializer.save()
    else:
        print(serializer.errors)
    return JsonResponse(serializer.data)

def deleteForumComments(request: HttpRequest, pk):
    comms = ForumComment.objects.filter(forumid=pk)
    comms.delete()
    return JsonResponse('Comments were deleted!', safe=False)

def getPlayers(request: HttpRequest):
    players = Player.objects.all().exclude(id=100).order_by('-id')
    serializer = PlayerSerializer(players, many=True)
    return HttpResponse(json.dumps(serializer.data))

def getPlayer(request: HttpRequest, pk):
    player = Player.objects.get(id=pk)
    serializer = PlayerSerializer(player, many=False)
    return HttpResponse(json.dumps(serializer.data))

def createPlayer(request: HttpRequest, pk):
    player = Player()
    player.name = request.POST['name']
    player.retired = False
    player.jerseyname = request.POST['jerseyname']
    player.birthday = request.POST['birthday'] if 'birthday' in request.POST else None
    player.country = request.POST['country'] if 'country' in request.POST else '???'
    player.currentteam = request.POST['currentteam'] if 'currentteam' in request.POST else pk
    player.position = request.POST['position']
    player.height = request.POST['height'] if 'height' in request.POST else None
    player.weight = request.POST['weight'] if 'weight' in request.POST else None
    player.goals = request.POST['goals'] if 'goals' in request.POST else 0
    player.saves = request.POST['saves'] if 'saves' in request.POST else 0
    player.yellowcards = request.POST['yellowcards'] if 'yellowcards' in request.POST else 0
    player.redcards = request.POST['redcards'] if 'redcards' in request.POST else 0
    player.gamesplayed = request.POST['gamesplayed'] if 'gamesplayed' in request.POST else 0
    player.transfers = request.POST['transfers'] if 'transfers' in request.POST else 0
    player.assists = request.POST['assists'] if 'assists' in request.POST else 0
    player.jerseynumber = request.POST['jerseynumber']
    player.rating = request.POST['rating']
    player.retired = False
    bday = None

    if (player.birthday != "???"):
        date_format = "%Y-%m-%d"
        bday = datetime.strptime(player.birthday, date_format).date()

    r = requests.get("http://localhost:8000/api/players/")
    team = Team.objects.get(id = request.POST['currentteam'] if 'currentteam' in request.POST else pk)
    player.gender = team.gender
    now = datetime.now()
    now2 = date.today()

    for x in json.loads(r.content):
        if (x['jerseyname'] == request.POST.get('jerseyname',False)):
            return JsonResponse({"message":"Player with chosen jersey name already exists."})
        if (int(x['jerseynumber']) == int(request.POST.get('jerseynumber',False)) and x['currentteam'] == pk):
            return JsonResponse({"message":"Another player in this team already has that jersey number."})
    if bday:
        if not (now2 - timedelta(days=365*50) <= bday <= now2 - timedelta(days=365*16)):
            return JsonResponse({"message":"Invalid date. Player should be between 16 and 50 years old."})
    if not (0 <= int(player.jerseynumber) <= 99):
        return JsonResponse({"message":"Invalid jersey number. Should be between 0 and 99."})

    if ('profilephoto' in request.POST):
        player.profilephoto = request.POST['profilephoto']
    elif ('profilephoto' in request.FILES):
        img = Image.open(request.FILES['profilephoto'])
        imgFileName = "media/"+now.strftime("%d-%m-%Y-%H-%M-%S")+str(request.FILES['profilephoto'])
        img.save(imgFileName)
        player.profilephoto = "../../"+imgFileName

    player.save()
    serializer = PlayerSerializer(player, many=False)
    tm = Team.objects.get(id = pk)
    otherPlayers = Player.objects.filter(currentteam = pk)
    if len(otherPlayers) >= 14:
        tm.isvalid = True
        tm.save()
    return JsonResponse(serializer.data)


def updatePlayer(request: HttpRequest, pk):
    player = Player.objects.get(id=pk)
    somedata = json.loads(json.dumps(request.POST))
    playerTeamTmp = player.currentteam
    currTeam = somedata.get('currentteam', player.currentteam)
    if 'name' in somedata and somedata['name'] == '':
        return JsonResponse({"message":"Name cannot be empty."})
    if 'jerseyname' in somedata and somedata['jerseyname'] == '':
        return JsonResponse({"message":"Name on jersey cannot be empty."})

    otherPlayers = Player.objects.all()
    newTeamPlayers = otherPlayers.filter(currentteam=currTeam)
    for n in newTeamPlayers:
        if n.jerseynumber == player.jerseynumber and n.id != pk:
            return JsonResponse({"message":"Another player in this team already has that jersey number."})

    if 'jerseyname' in somedata:
        for o in otherPlayers:
            if (o.jerseyname == somedata['jerseyname'] and o.id != pk):
                return JsonResponse({"message":"Player with chosen jersey name already exists."})
    if 'jerseynumber' in somedata:
        for p in newTeamPlayers:
            if p.jerseynumber == somedata['jerseynumber'] and p.id != pk:
                return JsonResponse({"message":"Another player in this team already has that jersey number."})
    
    if 'profilephoto' in request.FILES:
        now = datetime.now()
        img = Image.open(request.FILES['profilephoto'])
        profilephotoFileName = "media/"+now.strftime("%d-%m-%Y-%H-%M-%S")+str(request.FILES['profilephoto'])
        img.save(profilephotoFileName)
        #img.show()
        player.profilephoto = "../../"+profilephotoFileName
        somedata['profilephoto'] = player.profilephoto
    if 'currentteam' in somedata and not player.retired:
        oldTeamFolks = Player.objects.filter(currentteam = playerTeamTmp)
        oldTeam = Team.objects.get(id=playerTeamTmp)
        newTeam = Team.objects.get(id=currTeam)
        if oldTeam and len(oldTeamFolks) <= 14:
            oldTeam.isvalid = False
            oldTeam.save()
        if len(newTeamPlayers) >= 13:
            newTeam.isvalid = True
            newTeam.save()

    if 'retired' in somedata:
        player.currentteam = None
    if 'currentteam' in somedata:
        player.retired = False
    serializer = PlayerSerializer(instance=player, data=somedata)
    if serializer.is_valid():
        serializer.save()
    else:
        print(serializer.errors)
    return JsonResponse(serializer.data)

def deletePlayer(request: HttpRequest, pk):
    player = Player.objects.get(id=pk)
    if player.currentteam:
        team = Team.objects.get(id=player.currentteam)
        teamPlayers = Player.objects.filter(currentteam=team.id)
        if len(teamPlayers) <= 14:
            team.isvalid = False
            team.save()
    subs = Substitution.objects.filter(Q(playerin=pk) | Q(playerout=pk))
    mvalues = MarketValue.objects.filter(playerid = pk)
    ycards = YellowCard.objects.filter(playerid = pk)
    rcards = RedCard.objects.filter(playerid = pk)
    goals = Goal.objects.filter(scoredby = pk)
    pens = Penalty.objects.filter(playerid=pk)
    formations = Formation.objects.filter(Q(position1=pk) | Q(position2=pk) | Q(position3=pk) \
            | Q(position4=pk) | Q(position5=pk) | Q(position6=pk) | Q(position7=pk) | \
            Q(position8=pk) | Q(position9=pk) | Q(position10=pk) | Q(position11=pk))
    mvalues.delete()
    for s in subs:
        if (s.playerin == pk):
            s.playerin = None
        elif s.playerout == pk:
            s.playerout = None
        s.save()
    for f in formations:
        if f.position1 == pk:
            f.position1 = None
        elif f.position2 == pk:
            f.position2 = None
        elif f.position3 == pk:
            f.position3 = None
        elif f.position4 == pk:
            f.position4 = None
        elif f.position5 == pk:
            f.position5 = None
        elif f.position6 == pk:
            f.position6 = None
        elif f.position7 == pk:
            f.position7 = None
        elif f.position8 == pk:
            f.position8 = None
        elif f.position9 == pk:
            f.position9 = None
        elif f.position10 == pk:
            f.position10 = None
        elif f.position11 == pk:
            f.position11 = None
        f.save()
    for r in rcards:
        if r.playerid == pk:
            r.playerid = None
            r.save()
    for y in ycards:
        if y.playerid == pk:
            y.playerid = None
            y.save()
    for g in goals:
        if g.scoredby == pk:
            g.scoredby = None
            g.save()
    for p in pens:
        if p.playerid == pk:
            p.playerid = None
            p.save()
    os.remove(player.profilephoto.replace("../../", ""))
    player.delete()
    return JsonResponse('Player was deleted!', safe=False)

def getNews(request: HttpRequest):
    news = News.objects.all().order_by('-id')
    serializer = NewsSerializer(news, many=True)
    return HttpResponse(json.dumps(serializer.data))

def createNews(request: HttpRequest):
    news = News()
    print(request.POST)
    news.title = request.POST['title']
    news.content = request.POST['content']
    news.author = request.POST['author']
    news.publishdate = datetime.now()

    if len(request.POST['content']) >= 4000:
        return JsonResponse({"message":"Content too long. It should be up to 4000 characters."})

    if ('image' in request.POST):
        news.image = request.POST['image']
    elif ('image' in request.FILES):
        now = datetime.now()
        img = Image.open(request.FILES['image'])
        imgFileName = "media/"+now.strftime("%d-%m-%Y-%H-%M-%S")+str(request.FILES['image'])
        img.save(imgFileName)
        news.image = "../../"+imgFileName

    news.save()
    serializer = NewsSerializer(news, many=False)
    return JsonResponse(serializer.data)

def getNewsDetails(request: HttpRequest, pk):
    newsDetails = News.objects.get(id=pk)
    serializer = NewsSerializer(newsDetails, many=False)
    return HttpResponse(json.dumps(serializer.data))


def getNewsComments(request: HttpRequest, pk):
    comms = Comment.objects.filter(newsid=pk)
    serializer = CommentSerializer(comms, many=True)
    return HttpResponse(json.dumps(serializer.data))

def getNewsComment(request: HttpRequest, pid, cid):
    comm = Comment.objects.get(newsid=pid, id=cid)
    serializer = CommentSerializer(comm, many=False)
    return HttpResponse(json.dumps(serializer.data))

def createNewsComment(request: HttpRequest, pk):
    comment = Comment()
    comm = json.loads(request.body.decode('utf-8'))
    comment.newsid = pk
    comment.author = comm['author']
    comment.publishdate = datetime.now()
    comment.content = comm['content']
    comment.save()
    serializer = CommentSerializer(comment, many=False)
    return JsonResponse(serializer.data)

def deleteNewsComment(request: HttpRequest, pid, cid):
    comm = Comment.objects.get(newsid=pid, id=cid)
    comm.delete()
    return JsonResponse('Comment was deleted!', safe=False)

def editNewsComment(request: HttpRequest, pid, cid):
    comm = Comment.objects.get(newsid=pid, id=cid)
    somedata = json.loads(request.body.decode('utf-8'))
    somedata['author'] = comm.author
    somedata['publishdate'] = comm.publishdate
    somedata['newsid'] = comm.newsid
    serializer = CommentSerializer(instance=comm, data=somedata)
    if serializer.is_valid():
        serializer.save()
    else:
        print(serializer.errors)
    return JsonResponse(serializer.data)

def deleteNewsComments(request: HttpRequest, pk):
    comms = Comment.objects.filter(newsid=pk)
    comms.delete()
    return JsonResponse('Comments were deleted!', safe=False)


def editNewsDetails(request: HttpRequest, pk):
    previousState = News.objects.get(id=pk)
    if 'title' in request.POST:
        previousState.title = request.POST['title']
    if 'content' in request.POST:
        previousState.content = request.POST['content']
    if 'comments' in request.POST:
        previousState.comments = request.POST['comments'] 
    if 'views' in request.POST:
        previousState.views = request.POST['views']
    if 'author' in request.POST:
        previousState.author = request.POST['author']
    if 'publishdate' in request.POST:
        previousState.publishdate = request.POST['publishdate']

    if 'title' in request.POST and len(request.POST['title']) > 50:
        return JsonResponse({"message":"Title too long. It should be up to 50 characters."})
    if 'content' in request.POST and len(request.POST['content']) > 4000:
        return JsonResponse({"message":"Content too long. It should be up to 4000 characters."})

    if 'image' in request.POST:
        previousState.image = request.POST['image']
    elif 'image' in request.FILES:
        now = datetime.now()
        img = Image.open(request.FILES['image'])
        imageFileName = "media/"+now.strftime("%d-%m-%Y-%H-%M-%S")+str(request.FILES['image'])
        img.save(imageFileName)
        previousState.image = "../../"+imageFileName

    previousState.save()
    serializer = NewsSerializer(instance=previousState, many=False)
    return JsonResponse(serializer.data)

def deleteNewsDetails(request: HttpRequest, pk):
    news = News.objects.get(id=pk)
    comms = Comment.objects.filter(newsid = pk)
    comms.delete()
    news.delete()
    return JsonResponse('News post was deleted!', safe=False)

def getChampionships(request: HttpRequest):
    champ = Championship.objects.all().order_by('-championshipid')
    serializer = ChampionshipSerializer(champ, many=True)
    return HttpResponse(json.dumps(serializer.data))

def createChampionship(request: HttpRequest):
    champ = Championship()
    champ.name = request.POST['name']
    champ.qualifications = request.POST['qualifications']
    champ.startDate = request.POST['startDate']
    champ.endDate = request.POST['endDate']
    champ.friendly = request.POST['friendly']
    champ.gender = request.POST['gender']
    champ.host = request.POST['host']
    champ.mascot = '../../media/default_photo.jpeg'
    champ.mascotdesc = ""
    champ.mascotname = "???"
    champ.winner = None
    champ.secondplace = None
    champ.thirdplace = None
    champ.fourthplace = None
    champ.openingphoto = '../../media/default_photo.jpeg'
    champ.openingdesc = ""
    champ.cities = 0
    champ.matchesplayed = 0
    champ.status = 'Not started'
    champ.itemphoto = '../../media/default_photo.jpeg'
    champ.friendly = request.POST['friendly']
    champ.attendance = 0
    champ.goals = 0
    champ.totaldays = request.POST['totaldays']
    champ.totalteams = request.POST['totalteams']
    champ.organisationcost = 0
    champ.gender = request.POST['gender']
    champ.resttime = request.POST['resttime']
    champ.bestgkname = ''
    champ.bestplayername = ''
    champ.save()
    serializer = ChampionshipSerializer(champ, many=False)
    return JsonResponse(serializer.data)

def getChampionship(request: HttpRequest, pk):
    champ = Championship.objects.get(championshipid = pk)
    serializer = ChampionshipSerializer(champ, many=False)
    return HttpResponse(json.dumps(serializer.data))

def deleteChampionship(request: HttpRequest, pk):
    champ = Championship.objects.get(championshipid=pk)

    partcs = Participant.objects.filter(tournamentid = pk)
    partcs.delete()
    matchIdList = []
    matches = FootballMatch.objects.filter(championshipid = pk)
    for m in matches:
        matchIdList.append(m.matchid)
    for m in matchIdList:
        ycards = YellowCard.objects.filter(matchid = m)
        ycards.delete()
        rcards = RedCard.objects.filter(matchid = m)
        rcards.delete()
        subs = Substitution.objects.filter(matchid = m)
        subs.delete()
        goals = Goal.objects.filter(matchid = m)
        goals.delete()
        penalties = Penalty.objects.filter(matchid = m)
        penalties.delete()
        formations = Formation.objects.filter(matchid = m)
        formations.delete()

    matches = FootballMatch.objects.filter(championshipid = pk)
    groups = Group.objects.filter(championshipid = pk)
    partcs = Participant.objects.filter(tournamentid = pk)
    matches.delete()
    partcs.delete()
    groups.delete()

    champ.delete()
    return JsonResponse('Tournament was deleted!', safe=False)

def editChampionship(request: HttpRequest, pk):
    previousState = Championship.objects.get(championshipid=pk)
    champ = Championship()
    champ.championshipid = pk

    if 'name' in request.POST and request.POST['name'] == '':
        return JsonResponse({"message":"Name cannot be empty."})
    
    champ.host = request.POST['host'] if 'host' in request.POST else previousState.host
    champ.status = request.POST['status'] if 'status' in request.POST else previousState.status
    champ.name = request.POST['name'] if 'name' in request.POST else previousState.name
    champ.mascotname = request.POST['mascotname'] if 'mascotname' in request.POST else previousState.mascotname    
    champ.mascotdesc = request.POST['mascotdesc'] if 'mascotdesc' in request.POST else previousState.mascotdesc
    champ.winner = request.POST['winner'] if 'winner' in request.POST else previousState.winner
    champ.secondplace = request.POST['secondplace'] if 'secondplace' in request.POST else previousState.secondplace
    champ.thirdplace = request.POST['thirdplace'] if 'thirdplace' in request.POST else previousState.thirdplace
    champ.fourthplace = request.POST['fourthplace'] if 'fourthplace' in request.POST else previousState.fourthplace
    champ.openingdesc = request.POST['openingdesc'] if 'openingdesc' in request.POST else previousState.openingdesc
    champ.cities = request.POST['cities'] if 'cities' in request.POST else previousState.cities
    champ.matchesplayed = request.POST['matchesplayed'] if 'matchesplayed' in request.POST else previousState.matchesplayed
    champ.attendance = request.POST['attendance'] if 'attendance' in request.POST else previousState.attendance
    champ.goals = request.POST['goals'] if 'goals' in request.POST else previousState.goals
    champ.totaldays = request.POST['totaldays'] if 'totaldays' in request.POST else previousState.totaldays
    champ.organisationcost = request.POST['organisationcost'] if 'organisationcost' in request.POST else previousState.organisationcost
    champ.startDate = request.POST['startDate'] if 'startDate' in request.POST else previousState.startDate
    champ.endDate = request.POST['endDate'] if 'endDate' in request.POST else previousState.endDate

    if ('mascot' in request.POST):
        champ.mascot = request.POST['mascot']
    elif ('mascot' in request.FILES):
        now = datetime.now()
        img = Image.open(request.FILES['mascot'])
        mascotFileName = "media/"+now.strftime("%d-%m-%Y-%H-%M-%S")+str(request.FILES['mascot'])
        img.save(mascotFileName)
        champ.mascot = "../../"+mascotFileName
    else:
        champ.mascot = previousState.mascot

    if ('openingphoto' in request.POST):
        champ.openingphoto = request.POST['openingphoto']
    elif ('openingphoto' in request.FILES):
        now = datetime.now()
        img = Image.open(request.FILES['openingphoto'])
        openingphotoFileName = "media/"+now.strftime("%d-%m-%Y-%H-%M-%S")+str(request.FILES['openingphoto'])
        img.save(openingphotoFileName)
        champ.openingphoto = "../../"+openingphotoFileName
    else:
        champ.openingphoto = previousState.openingphoto

    if ('itemphoto' in request.POST):
        champ.itemphoto = request.POST['itemphoto']
    elif ('itemphoto' in request.FILES):
        now = datetime.now()
        img = Image.open(request.FILES['itemphoto'])
        itemphotoFileName = "media/"+now.strftime("%d-%m-%Y-%H-%M-%S")+str(request.FILES['itemphoto'])
        img.save(itemphotoFileName)
        champ.itemphoto = "../../"+itemphotoFileName
    else:
        champ.itemphoto = previousState.itemphoto


    champ_data = model_to_dict(champ)
    champ.save()
    serializer = ChampionshipSerializer(instance=previousState, data=champ_data)
    if serializer.is_valid():
        serializer.save()
    else:
        print(serializer.errors)
    return JsonResponse(serializer.data)


def getParticipants(request: HttpRequest, cid):
    participants = Participant.objects.filter(tournamentid = cid)
    serializer = ParticipantSerializer(participants, many=True)
    return HttpResponse(json.dumps(serializer.data))

def createParticipant(request: HttpRequest, cid):
    partc = Participant()
    partc.tournamentid = cid
    partc.teamid = request.POST['teamid']
    partc.save()
    serializer = ParticipantSerializer(partc, many=False)
    return JsonResponse(serializer.data)

def deleteParticipants(request: HttpRequest, cid):
    partcs = Participant.objects.filter(tournamentid=cid)
    partcs.delete()
    return JsonResponse('Participants were deleted!', safe=False)

def getMatches(request: HttpRequest, cid):
    matches = FootballMatch.objects.filter(championshipid = cid).order_by('matchid')
    serializer = MatchSerializer(matches, many=True)
    return HttpResponse(json.dumps(serializer.data))

def createMatch(request: HttpRequest, cid):
    match = FootballMatch()
    match.championshipid = cid
    match.team1 = request.POST['team1']
    match.team2 = request.POST['team2']
    match.referee = request.POST['referee'] if 'referee' in request.POST else FootballMatch._meta.get_field('referee').get_default()
    match.matchdate = request.POST['matchdate']
    match.starttime = request.POST['starttime']
    match.endtime = request.POST['endtime']
    match.groupid = request.POST['groupid'] if 'groupid' in request.POST else 0
    match.score1 = FootballMatch._meta.get_field('score1').get_default()
    match.score2 = FootballMatch._meta.get_field('score2').get_default()
    match.status = FootballMatch._meta.get_field('status').get_default()
    match.possession = FootballMatch._meta.get_field('possession').get_default()
    match.targets1 = FootballMatch._meta.get_field('targets1').get_default()
    match.targets2 = FootballMatch._meta.get_field('targets2').get_default()
    match.corners1 = FootballMatch._meta.get_field('corners1').get_default()   
    match.corners2 = FootballMatch._meta.get_field('corners2').get_default()
    match.fouls1 = FootballMatch._meta.get_field('fouls1').get_default()
    match.fouls2 = FootballMatch._meta.get_field('fouls2').get_default()
    match.offsides1 = FootballMatch._meta.get_field('offsides1').get_default()
    match.offsides2 = FootballMatch._meta.get_field('offsides2').get_default()
    match.saves1 = FootballMatch._meta.get_field('saves1').get_default()
    match.saves2 = FootballMatch._meta.get_field('saves2').get_default()
    match.extension = FootballMatch._meta.get_field('extension').get_default()
    match.totaltime = FootballMatch._meta.get_field('totaltime').get_default()
    match.drawpossible = request.POST['drawpossible'] if 'drawpossible' in request.POST else False
    match.nextmatchid = request.POST['nextmatchid'] if 'nextmatchid' in request.POST else FootballMatch._meta.get_field('nextmatchid').get_default()
    match.winner = None
    match.save()
    serializer = MatchSerializer(match, many=False)
    return JsonResponse(serializer.data)

def deleteMatches(request: HttpRequest, cid):
    matches = FootballMatch.objects.filter(championshipid=cid)
    matchIdList = []
    for m in matches:
        matchIdList.append(m.matchid)
    for m in matchIdList:
        ycards = YellowCard.objects.filter(matchid = m)
        ycards.delete()
        rcards = RedCard.objects.filter(matchid = m)
        rcards.delete()
        subs = Substitution.objects.filter(matchid = m)
        subs.delete()
        goals = Goal.objects.filter(matchid = m)
        goals.delete()
        penalties = Penalty.objects.filter(matchid = m)
        penalties.delete()
        formations = Formation.objects.filter(matchid = m)
        formations.delete()

    matches.delete()
    return JsonResponse('Matches were deleted!', safe=False)

def getMatch(request: HttpRequest, mid, cid):
    match = FootballMatch.objects.get(championshipid=cid, matchid=mid)
    serializer = MatchSerializer(match, many=False)
    return HttpResponse(json.dumps(serializer.data))

def editMatch(request: HttpRequest, mid, cid):

    previousState = FootballMatch.objects.get(championshipid=cid, matchid=mid)
    match = FootballMatch()
    match.championshipid = cid
    match.matchid = mid
    match.matchdate = request.POST['matchdate'] if 'matchdate' in request.POST else previousState.matchdate
    match.nextmatchid = request.POST['nextmatchid'] if 'nextmatchid' in request.POST else previousState.nextmatchid
    match.team1 = request.POST['team1'] if 'team1' in request.POST else previousState.team1
    match.team2 = request.POST['team2'] if 'team2' in request.POST else previousState.team2
    match.referee = request.POST['referee'] if 'referee' in request.POST else previousState.referee 
    match.starttime = request.POST['starttime'] if 'starttime' in request.POST else previousState.starttime 
    match.endtime = request.POST['endtime'] if 'endtime' in request.POST else previousState.endtime 
    match.score1 = request.POST['score1'] if 'score1' in request.POST else previousState.score1 
    match.score2 = request.POST['score2'] if 'score2' in request.POST else previousState.score2 
    match.status = request.POST['status'] if 'status' in request.POST else previousState.status 
    match.possession = request.POST['possession'] if 'possession' in request.POST else previousState.possession 
    match.targets1 = request.POST['targets1'] if 'targets1' in request.POST else previousState.targets1 
    match.targets2 = request.POST['targets2'] if 'targets2' in request.POST else previousState.targets2 
    match.corners1 = request.POST['corners1'] if 'corners1' in request.POST else previousState.corners1 
    match.corners2 = request.POST['corners2'] if 'corners2' in request.POST else previousState.corners2
    match.fouls1 = request.POST['fouls1'] if 'fouls1' in request.POST else previousState.fouls1 
    match.fouls2 = request.POST['fouls2'] if 'fouls2' in request.POST else previousState.fouls2
    match.offsides1 = request.POST['offsides1'] if 'offsides1' in request.POST else previousState.offsides1 
    match.offsides2 = request.POST['offsides2'] if 'offsides2' in request.POST else previousState.offsides2
    match.saves1 = request.POST['saves1'] if 'saves1' in request.POST else previousState.saves1 
    match.saves2 = request.POST['saves2'] if 'saves2' in request.POST else previousState.saves2
    match.extension = request.POST['extension'] if 'extension' in request.POST else previousState.extension
    match.totaltime = request.POST['totaltime'] if 'totaltime' in request.POST else previousState.totaltime
    match.drawpossible = request.POST['drawpossible'] if 'drawpossible' in request.POST else previousState.drawpossible
    match.endedearlier = request.POST['endedearlier'] if 'endedearlier' in request.POST else previousState.endedearlier
    match.endearlyreason = request.POST['endearlyreason'] if 'endearlyreason' in request.POST else previousState.endearlyreason
    match.groupid = request.POST['groupid'] if 'groupid' in request.POST else previousState.groupid
    match.winner = request.POST['winner'] if 'winner' in request.POST else previousState.winner
    match_data = model_to_dict(match)
    serializer = MatchSerializer(instance=previousState, data=match_data)

    if 'saves1' in request.POST:
        try:
            formation1 = Formation.objects.get(teamid = match.team1)
            goalkeeper = Player.objects.get(id = formation1.position1)
            goalkeeper.saves = goalkeeper.saves + 1
            goalkeeper.rating = goalkeeper.rating + 2
            goalkeeper.save()
            team = Team.objects.get(id = match.team1)
            team.saves = team.saves + 1
            team.save()
            print(goalkeeper.name)
            print(team.name)
        except:
            print("no existado")
            pass

    if 'saves2' in request.POST:
        try:
            formation2 = Formation.objects.get(teamid = match.team2)
            goalkeeper2 = Player.objects.get(id = formation2.position1)
            goalkeeper2.saves = goalkeeper2.saves + 1
            team2 = Team.objects.get(id = match.team2)
            team2.saves = team2.saves + 1
            goalkeeper2.save()
            team2.save()
            print(goalkeeper2.name)
            print(team2.name)
        except:
            print("no existado team 2 ")
            pass

    if serializer.is_valid():
        serializer.save()
    else:
        print(serializer.errors)
    return JsonResponse(serializer.data)

def getMarketValue(request: HttpRequest, pid):
    mvalues = MarketValue.objects.filter(playerid = pid).order_by('year')
    serializer = MarketValueSerializer(mvalues, many=True)
    return HttpResponse(json.dumps(serializer.data))

def addOrEditMarketValue(request: HttpRequest, pid, yr):
    print(request.POST)
    try:
        mvalue = MarketValue.objects.get(playerid=pid, year=yr)
        if 'price' in request.POST:
            mvalue.price = request.POST['price']
        mvalue.playerid=pid
        mvalue.save()
        return JsonResponse({"message":"Market value is updated."})
    except:
        mvalue = MarketValue()
        mvalue.year = yr
        if 'price' in request.POST:
            mvalue.price = request.POST['price']
        mvalue.playerid=pid
        mvalue.save()
        serializer = MarketValueSerializer(mvalue, many=False)
        return JsonResponse(serializer.data)

def deleteMarketValue(request: HttpRequest, pid, yr):
    mvalue = MarketValue.objects.get(playerid=pid, year=yr)
    mvalue.delete()
    return JsonResponse('Market value was deleted!', safe=False)

def getReports(request: HttpRequest):
    reports = Report.objects.all()
    serializer = ReportSerializer(reports, many=True)
    return HttpResponse(json.dumps(serializer.data))

def getReport(request: HttpRequest, rid):
    report = Report.objects.get(id = rid)
    serializer = ReportSerializer(report, many=False)
    return HttpResponse(json.dumps(serializer.data))

def createReport(request: HttpRequest):
    somedata = json.loads(request.body)
    report = Report()
    report.sender = somedata['sender']
    report.reporteduser = somedata['reporteduser']
    report.reporttime = datetime.now()
    report.reason = somedata['reason']
    report.status = 'New'

    report.save()
    serializer = ReportSerializer(report, many=False)
    return JsonResponse(serializer.data)

def editReport(request: HttpRequest, rid):
    report = Report.objects.get(id = rid)
    report.status = 'Pending'
    report.save()

def deleteReport(request: HttpRequest, rid):
    report = Report.objects.get(id = rid)
    report.delete()
    return JsonResponse('Report was deleted!', safe=False)

def getReferees(request: HttpRequest):
    refs = Referee.objects.all()
    serializer = RefereeSerializer(refs, many=True)
    return HttpResponse(json.dumps(serializer.data))

def createReferee(request: HttpRequest):
    somedata = json.loads(request.body)
    ref = Referee()
    ref.name = somedata['name']
    ref.country = somedata['country']
    ref.gender = somedata['gender']
    ref.save()
    serializer = RefereeSerializer(ref, many=False)
    return JsonResponse(serializer.data)

def getReferee(request: HttpRequest, rname):
    ref = Referee.objects.get(name = rname)
    serializer = RefereeSerializer(ref, many=False)
    return HttpResponse(json.dumps(serializer.data))

def retireReferee(request: HttpRequest, rname):
    ref = Referee.objects.get(name = rname)
    ref.retired = True
    ref.save()
    return JsonResponse('Referee was retired!', safe=False)

def getAvailableRefs(request: HttpRequest, rdate):
    refereeing = Refereeing.objects.filter(rdate=rdate)
    freeReferees = Referee.objects.filter(retired=False).exclude(name__in=refereeing.values('referee'))
    #for r in freeReferees:
        #print(r.name)
    
    serializer = RefereeSerializer(freeReferees, many=True)
    return HttpResponse(json.dumps(serializer.data))

def setRefereeingDate(request: HttpRequest, rdate):
    somedata = json.loads(request.body)
    ref = Refereeing()
    ref.rdate = rdate
    ref.referee = somedata['referee']
    ref.save()
    serializer = RefereeingSerializer(ref, many=False)
    return JsonResponse(serializer.data)

def getMatchSubs(request: HttpRequest, mid):
    subs = Substitution.objects.filter(matchid = mid)
    serializer = SubstitutionSerializer(subs, many=True)
    return HttpResponse(json.dumps(serializer.data))

def createMatchSub(request: HttpRequest, mid):
    sub = Substitution()
    sub.matchid = mid
    sub.playerin = request.POST['playerin']
    sub.playerout = request.POST['playerout']
    sub.team = request.POST['team']
    sub.injerseyname = request.POST['injerseyname']
    sub.outjerseyname = request.POST['outjerseyname']
    sub.subminute = request.POST['subminute']
   
    sub.save()
    serializer = SubstitutionSerializer(sub, many=False)
    return JsonResponse(serializer.data)

def deleteMatchSubs(request: HttpRequest, mid):
    subs = Substitution.objects.filter(matchid=mid)
    subs.delete()
    return JsonResponse('Substitutions were deleted!', safe=False)

def replaceSubsWithNull(request: HttpRequest, mid):
    subs = Substitution.objects.filter(Q(playerin=mid) | Q(playerout=mid))
    for s in subs:
        if (s.playerin == mid):
            s.playerin = None
        elif s.playerout == mid:
            s.playerout = None
        s.save()
    return JsonResponse('Substitutions were deleted!', safe=False)

def getGroups(request: HttpRequest, cid):
    groups = Group.objects.filter(championshipid = cid)
    serializer = GroupSerializer(groups, many=True)
    return HttpResponse(json.dumps(serializer.data))

def createGroup(request: HttpRequest, cid):
    group = Group()
    group.championshipid = cid
    group.team1 = request.POST['team1']
    group.team2 = request.POST['team2']
    group.team3 = request.POST['team3']
    group.team4 = request.POST['team4']
    group.letter = request.POST['letter']
    group.winner = None
    group.second = None
   
    group.save()
    serializer = GroupSerializer(group, many=False)
    return JsonResponse(serializer.data)

def deleteGroups(request: HttpRequest, cid):
    groups = Group.objects.filter(championshipid=cid)
    groups.delete()
    return JsonResponse('Groups of a championship were deleted!', safe=False)

def getGroup(request: HttpRequest, cid, gid):
    group = Group.objects.get(championshipid = cid, id=gid)
    serializer = GroupSerializer(group, many=False)
    return HttpResponse(json.dumps(serializer.data))

def editGroup(request: HttpRequest, cid, gid):
    previousState = Group.objects.get(championshipid=cid, id=gid)
    group = Group()
    group.championshipid = cid
    group.id = gid
    group.team1 = previousState.team1
    group.team2 = previousState.team2
    group.team3 = previousState.team3
    group.team4 = previousState.team4
    group.winner = request.POST['winner']
    group.second = request.POST['second']

    group_data = model_to_dict(group)
    group.save()
    serializer = GroupSerializer(instance=previousState, data=group_data)
    if serializer.is_valid():
        serializer.save()
    else:
        print(serializer.errors)
    return JsonResponse(serializer.data)

def getFormations(request: HttpRequest, mid):
    formations = Formation.objects.filter(matchid = mid)
    serializer = FormationSerializer(formations, many=True)
    return HttpResponse(json.dumps(serializer.data))

def createFormation(request: HttpRequest, mid):
    formation = Formation()
    formation.matchid = mid
    formation.position1 = request.POST['position1'] if 'position1' in request.POST else None
    formation.position2 = request.POST['position2'] if 'position2' in request.POST else None
    formation.position3 = request.POST['position3'] if 'position3' in request.POST else None
    formation.position4 = request.POST['position4'] if 'position4' in request.POST else None
    formation.position5 = request.POST['position5'] if 'position5' in request.POST else None
    formation.position6 = request.POST['position6'] if 'position6' in request.POST else None
    formation.position7 = request.POST['position7'] if 'position7' in request.POST else None
    formation.position8 = request.POST['position8'] if 'position8' in request.POST else None
    formation.position9 = request.POST['position9'] if 'position9' in request.POST else None
    formation.position10 = request.POST['position10'] if 'position10' in request.POST else None
    formation.position11 = request.POST['position11'] if 'position11' in request.POST else None
    formation.jersey1 = request.POST['jersey1'] if 'jersey1' in request.POST else ''
    formation.jersey2 = request.POST['jersey2'] if 'jersey2' in request.POST else ''
    formation.jersey3 = request.POST['jersey3'] if 'jersey3' in request.POST else ''
    formation.jersey4 = request.POST['jersey4'] if 'jersey4' in request.POST else ''
    formation.jersey5 = request.POST['jersey5'] if 'jersey5' in request.POST else ''
    formation.jersey6 = request.POST['jersey6'] if 'jersey6' in request.POST else ''
    formation.jersey7 = request.POST['jersey7'] if 'jersey7' in request.POST else ''
    formation.jersey8 = request.POST['jersey8'] if 'jersey8' in request.POST else ''
    formation.jersey9 = request.POST['jersey9'] if 'jersey9' in request.POST else ''
    formation.jersey10 = request.POST['jersey10'] if 'jersey10' in request.POST else ''
    formation.jersey11 = request.POST['jersey11'] if 'jersey11' in request.POST else ''
    formation.teamid = request.POST['teamid'] if 'teamid' in request.POST else 500
    formation.formationtype = request.POST['formationtype'] if 'formationtype' in request.POST else '4-2-3-1'
   
    formation.save()
    serializer = FormationSerializer(formation, many=False)
    return JsonResponse(serializer.data)

def deleteFormations(request: HttpRequest, mid):
    formations = Formation.objects.filter(matchid = mid)
    formations.delete()
    return HttpResponse({"message":"Formations are deleted."})

def getFormation(request: HttpRequest, mid, fid):
    formation = Formation.objects.get(matchid = mid, id=fid)
    serializer = FormationSerializer(formation, many=False)
    return HttpResponse(json.dumps(serializer.data))

def updateFormation(request: HttpRequest, mid, fid):
    previousState = Formation.objects.get(matchid=mid, id=fid)
    formation = Formation()
    formation.matchid = mid
    formation.id = fid
    for x in request.POST:
        print(x, request.POST[x])
    formation.formationtype = request.POST['formationtype'] if 'formationtype' in request.POST else previousState.formationtype
    formation.teamid = request.POST['teamid']
    formation.position1 = request.POST['position1'] if 'position1' in request.POST else previousState.position1
    formation.position2 = request.POST['position2'] if 'position2' in request.POST else previousState.position2
    formation.position3 = request.POST['position3'] if 'position3' in request.POST else previousState.position3
    formation.position4 = request.POST['position4'] if 'position4' in request.POST else previousState.position4
    formation.position5 = request.POST['position5'] if 'position5' in request.POST else previousState.position5
    formation.position6 = request.POST['position6'] if 'position6' in request.POST else previousState.position6
    formation.position7 = request.POST['position7'] if 'position7' in request.POST else previousState.position7
    formation.position8 = request.POST['position8'] if 'position8' in request.POST else previousState.position8
    formation.position9 = request.POST['position9'] if 'position9' in request.POST else previousState.position9
    formation.position10 = request.POST['position10'] if 'position10' in request.POST else previousState.position10
    formation.position11 = request.POST['position11'] if 'position11' in request.POST else previousState.position11
    formation.jersey1 = request.POST['jersey1'] if 'jersey1' in request.POST else previousState.jersey1
    formation.jersey2 = request.POST['jersey2'] if 'jersey2' in request.POST else previousState.jersey2
    formation.jersey3 = request.POST['jersey3'] if 'jersey3' in request.POST else previousState.jersey3
    formation.jersey4 = request.POST['jersey4'] if 'jersey4' in request.POST else previousState.jersey4
    formation.jersey5 = request.POST['jersey5'] if 'jersey5' in request.POST else previousState.jersey5
    formation.jersey6 = request.POST['jersey6'] if 'jersey6' in request.POST else previousState.jersey6
    formation.jersey7 = request.POST['jersey7'] if 'jersey7' in request.POST else previousState.jersey7
    formation.jersey8 = request.POST['jersey8'] if 'jersey8' in request.POST else previousState.jersey8
    formation.jersey9 = request.POST['jersey9'] if 'jersey9' in request.POST else previousState.jersey9
    formation.jersey10 = request.POST['jersey10'] if 'jersey10' in request.POST else previousState.jersey10
    formation.jersey11 = request.POST['jersey11'] if 'jersey11' in request.POST else previousState.jersey11

    formation_data = model_to_dict(formation)
    formation.save()
    serializer = FormationSerializer(instance=previousState, data=formation_data)
    if serializer.is_valid():
        serializer.save()
    else:
        print(serializer.errors)
    return JsonResponse(serializer.data)

def getGoals(request: HttpRequest, mid):
    goals = Goal.objects.filter(matchid = mid)
    serializer = GoalSerializer(goals, many=True)
    return HttpResponse(json.dumps(serializer.data))

def createGoal(request: HttpRequest, mid):
    goal = Goal()
    goal.matchid = mid
    goal.team = request.POST['team']
    goal.scoredby = request.POST['scoredby']
    goal.jerseyname = request.POST['jerseyname']
    goal.minute = request.POST['minute'] 
    pl = Player.objects.get(id=goal.scoredby)
    tm = Team.objects.get(id=goal.team)
    if ' (O.G.)' not in goal.jerseyname:
        pl.goals = pl.goals + 1
        pl.rating = pl.rating + 2
        tm.goals = tm.goals + 1
    pl.save()
    tm.save()
    fmatch = FootballMatch.objects.get(matchid=mid)
    print(type(goal.team), type(fmatch.team1))
    if int(goal.team) == fmatch.team1:
        fmatch.score1 = fmatch.score1 + 1
    else:
        fmatch.score2 = fmatch.score2 + 1
    fmatch.save()
    tm2 = Team.objects.get(id = fmatch.team1) if int(goal.team) != fmatch.team1 else Team.objects.get(id = fmatch.team2)
    tm2.concededgoals = tm2.concededgoals + 1
    tm2.save()
    champ = Championship.objects.get(championshipid = fmatch.championshipid)
    champ.goals = champ.goals + 1
    champ.save()
    goal.save()
    serializer = GoalSerializer(goal, many=False)
    return JsonResponse(serializer.data)

def deleteGoals(request: HttpRequest, mid):
    goals = Goal.objects.filter(matchid = mid)
    goals.delete()
    return HttpResponse({"message":"goals are deleted"})

def getGoal(request: HttpRequest, mid, gid):
    goal = Goal.objects.get(matchid = mid, id=gid)
    serializer = GoalSerializer(goal, many=False)
    return HttpResponse(json.dumps(serializer.data))

def nullifyGoal(request: HttpRequest, mid, gid):
    goal = Goal.objects.get(matchid=mid, id=gid)
    goal.delete()
    player = Player.objects.get(id=goal.scoredby)
    player.goals = player.goals - 1
    player.save()
    tm = Team.objects.get(id=goal.team)
    tm.goals = tm.goals - 1
    tm.save()
    fmatch = FootballMatch.objects.get(matchid=mid)
    if int(goal.team) == fmatch.team1:
        fmatch.score1 = fmatch.score1 - 1
    else:
        fmatch.score2 = fmatch.score2 - 1
    fmatch.save()
    champ = Championship.objects.get(championshipid = fmatch.championshipid)
    champ.goals = champ.goals + 1
    champ.save()
    tm2 = Team.objects.get(id = fmatch.team1) if int(goal.team) != fmatch.team1 else Team.objects.get(id = fmatch.team2)
    tm2.concededgoals = tm2.concededgoals - 1
    tm2.save()
    return JsonResponse({"message":"Goal was nullified successfully."})

def getYellowCards(request: HttpRequest, mid):
    yellows = YellowCard.objects.filter(matchid = mid)
    serializer = YellowCardSerializer(yellows, many=True)
    return HttpResponse(json.dumps(serializer.data))

def createYellowCard(request: HttpRequest, mid):
    print(request.POST)
    yellow = YellowCard()
    yellow.playerid = request.POST['playerid']
    yellow.team = request.POST['team']
    yellow.minute = request.POST['minute']
    yellow.matchid = mid
    yellow.jerseyname = request.POST['jerseyname']
    pl = Player.objects.get(id=yellow.playerid)
    pl.yellowcards = pl.yellowcards + 1
    pl.save()
    tm = Team.objects.get(id=yellow.team)
    tm.yellowcards = tm.yellowcards + 1
    tm.save()
    yellow.save()
    serializer = YellowCardSerializer(yellow, many=False)
    return JsonResponse(serializer.data)

def deleteYellowCards(request: HttpRequest, mid):
    yellowcards = YellowCard.objects.filter(matchid = mid)
    yellowcards.delete()
    return HttpResponse({"message":"Yellow cards of match are deleted"})

def getRedCards(request: HttpRequest, cid):
    reds = RedCard.objects.filter(championshipid = cid)
    serializer = RedCardSerializer(reds, many=True)
    return HttpResponse(json.dumps(serializer.data))

def createRedCard(request: HttpRequest, cid):
    red = RedCard()
    red.playerid = request.POST['playerid']
    red.team = request.POST['team']
    red.minute = request.POST['minute']
    red.championshipid = cid
    red.matchid = request.POST['matchid']
    red.jerseyname = request.POST['jerseyname']
    pl = Player.objects.get(id = red.playerid)
    pl.goals = pl.goals + 1
    pl.save()
    tm = Team.objects.get(id=red.team)
    tm.redcards = tm.redcards + 1
    tm.save()
    red.save()
    serializer = RedCardSerializer(red, many=False)
    return JsonResponse(serializer.data)

def deleteRedCards(request: HttpRequest, cid):
    redcards = RedCard.objects.filter(championshipid = cid)
    redcards.delete()
    return HttpResponse({"message":"Red cards of match are deleted"})

def getPenalties(request: HttpRequest, mid):
    penalties = Penalty.objects.filter(matchid = mid)
    serializer = PenaltySerializer(penalties, many=True)
    return HttpResponse(json.dumps(serializer.data))

def createPenalty(request: HttpRequest, mid):
    penalty = Penalty()
    penalty.playerid = request.POST['playerid']
    print(penalty.playerid)
    penalty.team = request.POST['team']
    penalty.playername = request.POST['playername']
    penalty.hit = request.POST['hit']
    penalty.matchid = mid
    pl = Player.objects.get(id = penalty.playerid)
    pl.goals = pl.goals + 1
    pl.rating = pl.rating + 1
    pl.save()
    tm = Team.objects.get(id=penalty.team)
    tm.goals = tm.goals + 1
    tm.save()
    fmatch = FootballMatch.objects.get(matchid=mid)
    tm2 = Team.objects.get(id = fmatch.team1) if penalty.team != fmatch.team1 else Team.objects.get(id = fmatch.team2)
    tm2.concededgoals = tm2.concededgoals + 1
    tm2.save()
    champ = Championship.objects.get(championshipid = fmatch.championshipid)
    champ.goals = champ.goals + 1

    penalty.save()
    serializer = PenaltySerializer(penalty, many=False)
    return JsonResponse(serializer.data)

def deletePenalties(request: HttpRequest, mid):
    penalties = Penalty.objects.filter(matchid = mid)
    penalties.delete()
    return HttpResponse({"message":"Penalty shots are deleted!"})