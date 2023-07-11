from email.policy import default
from locale import normalize
from math import degrees
from operator import truediv
from statistics import mode
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from typing import List
from datetime import date, datetime


class UserAccountManager(BaseUserManager):
    def create_user(self, email, username, password=None):
        if not email or not username:
            raise ValueError('An email and username must be provided.')
        email = self.normalize_email(email)
        user = self.model(email=email, username=username)
        user.set_password(password)
        user.is_staff=False
        user.save()
        return user

    def create_staffuser(self, email, username, password):
        user = self.create_user(email,username,password=password,)
        user.staff = True
        user.save()
        return user

    def create_superuser(self, email, username, password):
        user = self.create_user(email,username,password=password,)
        user.staff = True
        user.admin = True
        user.save()
        return user

class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(max_length=255, unique=True)
    username = models.CharField(max_length=255, unique=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    knownfacts = models.IntegerField(default=0)
    unknownfacts = models.IntegerField(default=0)
    achievements = models.IntegerField(default=0)
    fullname = models.TextField(default='???', blank=True)
    gender = models.TextField(default=None, null=True, blank=True)
    status = models.TextField(default="", blank=True)
    birthday = models.DateField(default=None, null=True, blank=True)
    country = models.TextField(default="")
    hobbies = models.TextField(default="???", blank=True)
    membersince = models.DateField(default=str(date.today()))
    instagram = models.TextField(default="", blank=True)
    facebook = models.TextField(default="", blank=True)
    youtube = models.TextField(default="", blank=True)
    favorites = models.IntegerField(default=0)
    profilephoto = models.TextField(default="../../media/profile_default_img.jpg")

    objects = UserAccountManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']

    def __get_email__(self):
        return self.email

    def __str__(self):
        return self.username

class Team(models.Model):
    id = models.AutoField(primary_key=True, unique=True)
    name = models.TextField(unique=True, blank=True, default="")
    gender = models.TextField(null=False, blank=False, default='male')
    totalwins = models.IntegerField(null=False, blank=False, default=0)
    totaldraws = models.IntegerField(null=False, blank=False, default=0)
    totallosses = models.IntegerField(null=False, blank=False, default=0)
    goals = models.IntegerField(null=False, blank=False, default=0)
    concededgoals = models.IntegerField(null=False, blank=False, default=0)
    yellowcards = models.IntegerField(null=False, blank=False, default=0)
    redcards = models.IntegerField(null=False, blank=False, default=0)
    saves = models.IntegerField(null=False, blank=False, default=0)
    offsides = models.IntegerField(null=False, blank=False, default=0)
    fouls = models.IntegerField(null=False, blank=False, default=0)
    possession = models.IntegerField(null=False, blank=False, default=50)
    shootingaccuracy = models.IntegerField(null=False, blank=False, default=50)
    rating = models.IntegerField(null=False, blank=False, default=1000)
    coachname = models.TextField(null=False, blank=False, default='???')
    coachphoto = models.TextField(null=True, blank=True, default='../../media/default_photo.jpeg')
    coachdesc = models.TextField(null=True, default="", blank=True)
    jersey1 = models.TextField(null=False, blank=False, default='../../media/default_photo.jpeg')
    jersey2 = models.TextField(null=False, blank=False, default='../../media/default_photo.jpeg')
    logo = models.TextField(null=False, blank=False, default='../../media/default_logo.png')
    itemphoto = models.TextField(null=False, blank=False, default='../../media/default_photo.jpeg')
    isvalid = models.BooleanField(default=False)
    slogan = models.TextField(null=True,default="",blank=True)
    foundationyear = models.IntegerField(blank=True, default=str(date.today().year))
    country = models.TextField(default="", blank=True)
    timeschampion = models.TextField(default=0, blank=False, null=False)
    timessecond = models.TextField(default=0, blank=False, null=False)
    timesthird = models.TextField(default=0, blank=False, null=False)

class Championship(models.Model):
    championshipid = models.AutoField(primary_key=True)
    name = models.TextField(null=False, blank=False)
    startDate = models.DateField(null=False, blank=False)
    endDate = models.DateField(null=False, blank=False)
    qualifications = models.BooleanField(null=False, blank=False, default=False)
    host = models.TextField(null=False, blank=False)
    mascot = models.TextField(null=True, blank=True, default='../../media/default_photo.jpeg')
    mascotdesc = models.TextField(null=True, blank=True, default="")
    mascotname = models.TextField(null=True, blank=True, default=None)
    winner = models.TextField(null=True, blank=True, default=None)
    secondplace = models.TextField(null=True, blank=True, default=None)
    thirdplace = models.TextField(null=True, blank=True, default=None)
    fourthplace = models.TextField(null=True, blank=True, default=None)
    openingphoto = models.TextField(blank=True, default='../../media/default_photo.jpeg')   
    openingdesc = models.TextField(null=True, blank=True, default="")
    cities = models.IntegerField(null=True, blank=True, default=None)
    matchesplayed = models.IntegerField(null=False, blank=False)
    status = models.TextField(null=True, blank=False, default="Not started")
    itemphoto = models.TextField(null=True, blank=True, default='../../media/default_photo.jpeg')
    friendly = models.BooleanField(null=False, blank=False, default=False)
    bestplayername = models.TextField(null=True, blank=True, default='')
    bestgkname = models.TextField(null=True, blank=True, default='')
    attendance = models.IntegerField(null=False, blank=True, default=0)
    goals = models.IntegerField(null=False, blank=True, default=0)
    totaldays = models.IntegerField(null=False, blank=True, default=0)
    totalteams = models.IntegerField(null=False, blank=True, default=0)
    organisationcost = models.IntegerField(null=False, blank=True, default=0)
    gender = models.TextField(null=False, blank=False,default='all')
    resttime = models.TextField(null=False, blank=False, default='1 day')


class FootballMatch(models.Model):
    matchid = models.AutoField(primary_key=True)
    championshipid = models.IntegerField(null=False, blank=False)
    team1 = models.IntegerField(null=True, blank=True, default=None)
    team2 = models.IntegerField(null=True, blank=True, default=None)
    referee = models.TextField(null=True, blank=True, default=None)
    matchdate = models.DateField(null=False, blank=False)
    starttime = models.TimeField(null=False, blank=False)
    endtime = models.TimeField(null=False, blank=False)
    score1 = models.IntegerField(null=False, blank=False, default=0)
    score2 = models.IntegerField(null=False, blank=False, default=0)
    status = models.TextField(null=False, blank=False, default='Not started')
    possession = models.IntegerField(null=False, blank=False, default=50)
    targets1 = models.IntegerField(null=False, blank=False, default=0)
    targets2 = models.IntegerField(null=False, blank=False, default=0)
    corners1 = models.IntegerField(null=False, blank=False, default=0)
    corners2 = models.IntegerField(null=False, blank=False, default=0)
    fouls1 = models.IntegerField(null=False, blank=False, default=0)
    fouls2 = models.IntegerField(null=False, blank=False, default=0)
    offsides1 = models.IntegerField(null=False, blank=False, default=0)
    offsides2 = models.IntegerField(null=False, blank=False, default=0)
    saves1 = models.IntegerField(null=False, blank=False, default=0)
    saves2 = models.IntegerField(null=False, blank=False, default=0)
    extension = models.IntegerField(null=False, blank=False, default=0)
    totaltime = models.IntegerField(null=False, blank=False, default=0)
    drawpossible = models.BooleanField(default=False, blank=False, null=False)
    nextmatchid = models.IntegerField(null=True, blank=True, default=None)
    groupid = models.IntegerField(null=False, blank=False, default=False)
    endedearlier = models.BooleanField(null=False, blank=False, default=False)
    endearlyreason = models.TextField(null=True, blank=True, default=None)
    winner = models.IntegerField(null=True, blank=True, default=None)

class Achievement(models.Model):
    achievementid = models.AutoField(primary_key=True)
    name = models.TextField(null=False, blank=False)
    description = models.TextField(null=False, blank=False)
    image = models.TextField(null=False,blank=False)

class Fact(models.Model):
    id = models.AutoField(primary_key=True)
    description = models.TextField(null=False, blank=False)

class Favorite(models.Model):
    id = models.AutoField(primary_key=True)
    userid = models.IntegerField(blank=False, null=False)
    teamid = models.IntegerField(blank=False, null=False)

class Player(models.Model):
    id = models.AutoField(primary_key=True, unique=True)
    name = models.TextField(blank=False, null=False, default="")
    jerseyname = models.TextField(unique=True, blank=False, null=False, default="")
    gender = models.TextField(null=False, blank=False, default='male')
    birthday = models.DateField(default=None)
    country = models.TextField(default="")
    profilephoto = models.TextField(default="../../media/genericplayer.png")
    currentteam = models.IntegerField(blank=True, null=True)
    position = models.TextField(blank=False, null=False, default='Goalkeeper')
    height = models.FloatField(blank=True, null=True, default=None)
    weight = models.FloatField(blank=True, null=True, default=None)
    goals = models.IntegerField(blank=True, null=True, default=0)
    saves = models.IntegerField(blank=True, null=True, default=0)
    yellowcards = models.IntegerField(blank=True, null=True, default=0)
    redcards = models.IntegerField(blank=True, null=True, default=0)
    gamesplayed = models.IntegerField(blank=True, null=True, default=0)
    transfers = models.IntegerField(blank=True, null=True, default=0)
    assists = models.IntegerField(blank=True, null=True, default=0)
    jerseynumber = models.IntegerField(blank=False, null=False, default=0)
    rating = models.IntegerField(blank=False, null=False, default=1000)
    startedplaying = models.IntegerField(blank=False, null=False, default=datetime.now().year)
    retired = models.BooleanField(null=False, blank=False, default=False)

class Referee(models.Model):
    name = models.TextField(null=False, blank=False, primary_key=True, unique=True)
    country = models.TextField(null=False, blank=False)
    gender = models.TextField(null=False, blank=False, default='male')
    retired = models.BooleanField(null=False, blank=False, default=False)

class Refereeing(models.Model):
    id = models.AutoField(primary_key=True, unique=True, blank=False, null=False)
    referee = models.TextField(null=False, blank=False)
    rdate = models.DateField(null=False, blank=False, default=str(datetime.today().replace(microsecond=0)))

class MarketValue(models.Model):
    id = models.AutoField(primary_key=True, unique=True, blank=False, null=False)
    playerid = models.IntegerField(blank=False, null=False)    
    price = models.IntegerField(blank=False, null=False)
    year = models.IntegerField(blank=False, null=False, default=date.year)

class News(models.Model):
    id = models.AutoField(primary_key=True, null=False, unique=True)
    title = models.TextField(null=False, blank=False)
    content = models.TextField(null=False, blank=False)
    image = models.TextField(null=True, blank=True, default=None)
    publishdate = models.DateTimeField(default=str(datetime.today().replace(microsecond=0)))
    views = models.IntegerField(blank=False, default=0, null=False)
    comments = models.IntegerField(blank=False, default=0, null=False)
    author = models.TextField(null=False, blank=False)

class ForumPost(models.Model):
    id = models.AutoField(primary_key=True, null=False, unique=True)
    author = models.TextField(blank=False, null=False)
    title = models.TextField(null=False, blank=False)
    content = models.TextField(null=False, blank=False)
    publishdate = models.DateTimeField(default=str(datetime.today().replace(microsecond=0)))
    views = models.IntegerField(blank=False, default=0, null=False)
    comments = models.IntegerField(blank=False, default=0, null=False)

class Comment(models.Model):
    id = models.AutoField(primary_key=True, null=False, unique=True)
    newsid = models.IntegerField(blank=False, null=False)
    author = models.TextField(blank=False, null=False)
    publishdate = models.DateTimeField(default=str(datetime.today().replace(microsecond=0)))
    content = models.TextField(blank=False, null=False)

class ForumComment(models.Model):
    id = models.AutoField(primary_key=True, null=False, unique=True)
    forumid = models.IntegerField(blank=False, null=False)
    author = models.TextField(blank=False, null=False)
    publishdate = models.DateTimeField(default=str(datetime.today().replace(microsecond=0)))
    content = models.TextField(blank=False, null=False)

class Report(models.Model):
    id = models.AutoField(primary_key=True, null=False, unique=True)
    sender = models.IntegerField(blank=False, null=False)
    reporteduser = models.IntegerField(blank=False, null=False) 
    reason = models.TextField(blank=False, null=False)
    reporttime = models.DateTimeField(null=False, blank=False, default=str(datetime.today().replace(microsecond=0)))
    status = models.TextField(blank=False, null=False, default='New')
     
class Substitution(models.Model):
    id = models.AutoField(primary_key=True, null=False, unique=True)
    playerout = models.IntegerField(blank=True, null=True, default=None)
    playerin = models.IntegerField(blank=True, null=True, default=None) 
    injerseyname = models.TextField(blank=False, null=False)
    outjerseyname = models.TextField(blank=True, null=True)
    subminute = models.IntegerField(blank=False, null=False)
    matchid = models.IntegerField(blank=False, null=False) 
    team = models.IntegerField(blank=False, null=False) 

class UserAchievement(models.Model):
    id = models.AutoField(primary_key=True, null=False, unique=True)
    userid = models.IntegerField(blank=False, null=False)
    achievementid = models.IntegerField(blank=False, null=False)

class Participant(models.Model):
    id = models.AutoField(primary_key=True, null=False, unique=True)
    teamid = models.IntegerField(blank=False, null=False)
    tournamentid = models.IntegerField(blank=False, null=False)

class Group(models.Model):
    id = models.AutoField(primary_key=True, null=False, unique=True)
    championshipid = models.IntegerField(blank=False, null=False)
    letter = models.TextField(blank=False, null=False)
    team1 = models.IntegerField(blank=False, null=False)
    team2 = models.IntegerField(blank=False, null=False)
    team3 = models.IntegerField(blank=False, null=False)
    team4 = models.IntegerField(blank=False, null=False)
    winner = models.IntegerField(blank=True, null=True)
    second = models.IntegerField(blank=True, null=True)

class Formation(models.Model):
    id = models.AutoField(primary_key=True, null=False, unique=True)
    matchid = models.IntegerField(blank=False, null=False)
    teamid = models.IntegerField(blank=False, null=False)
    position1 = models.IntegerField(blank=True, null=True, default=None)
    position2 = models.IntegerField(blank=True, null=True, default=None)
    position3 = models.IntegerField(blank=True, null=True, default=None)
    position4 = models.IntegerField(blank=True, null=True, default=None)
    position5 = models.IntegerField(blank=True, null=True, default=None)
    position6 = models.IntegerField(blank=True, null=True, default=None)
    position7 = models.IntegerField(blank=True, null=True, default=None)
    position8 = models.IntegerField(blank=True, null=True, default=None)
    position9 = models.IntegerField(blank=True, null=True, default=None)
    position10 = models.IntegerField(blank=True, null=True, default=None)
    position11 = models.IntegerField(blank=True, null=True, default=None)
    jersey1 = models.TextField(blank=True, null=True, default=None)
    jersey2 = models.TextField(blank=True, null=True, default=None)
    jersey3 = models.TextField(blank=True, null=True, default=None)
    jersey4 = models.TextField(blank=True, null=True, default=None)
    jersey5 = models.TextField(blank=True, null=True, default=None)
    jersey6 = models.TextField(blank=True, null=True, default=None)
    jersey7 = models.TextField(blank=True, null=True, default=None)
    jersey8 = models.TextField(blank=True, null=True, default=None)
    jersey9 = models.TextField(blank=True, null=True, default=None)
    jersey10 = models.TextField(blank=True, null=True, default=None)
    jersey11 = models.TextField(blank=True, null=True, default=None)
    formationtype = models.TextField(blank=False, null=False, default='4-2-3-1')

class Goal(models.Model):
    id = models.AutoField(primary_key=True, null=False, unique=True)
    scoredby = models.IntegerField(blank=True, null=True)
    jerseyname = models.TextField(blank=False, null=False)
    minute = models.IntegerField(blank=False, null=False)
    matchid = models.IntegerField(blank=False, null=False)
    team = models.IntegerField(blank=False, null=False)

class RedCard(models.Model):
    id = models.AutoField(primary_key=True, null=False, unique=True)
    playerid = models.IntegerField(blank=False, null=False)
    minute = models.IntegerField(blank=False, null=False)
    matchid = models.IntegerField(blank=False, null=False)
    team = models.IntegerField(blank=False, null=False)
    jerseyname = models.TextField(blank=False, null=False)
    championshipid = models.TextField(blank=False, null=False)

class YellowCard(models.Model):
    id = models.AutoField(primary_key=True, null=False, unique=True)
    playerid = models.IntegerField(blank=False, null=False)
    minute = models.IntegerField(blank=False, null=False)
    matchid = models.IntegerField(blank=False, null=False)
    team = models.IntegerField(blank=False, null=False)
    jerseyname = models.TextField(blank=False, null=False)

class Penalty(models.Model):
    id = models.AutoField(primary_key=True, null=False, unique=True)
    playerid = models.IntegerField(blank=True, null=True)
    playername = models.TextField(blank=False, null=False)
    hit = models.BooleanField(blank=False, null=False, default=False)
    team = models.IntegerField(blank=False, null=False)
    matchid = models.IntegerField(blank=False, null=False)
    