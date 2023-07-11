from rest_framework import serializers, fields
from rest_framework.serializers import ModelSerializer
from .models import Championship, Comment, FootballMatch, Formation, \
    ForumComment, Goal, MarketValue, News, Participant, Penalty, Player, RedCard, Referee, Refereeing, Report, Substitution, Team, \
    Achievement, Fact, Favorite, ForumPost, UserAchievement, Group, YellowCard
from djoser.serializers import UserCreateSerializer
from django.contrib.auth import get_user_model

class TeamSerializer(ModelSerializer):
    class Meta:
        model = Team
        fields = '__all__'

class FactSerializer(ModelSerializer):
    class Meta:
        model = Fact
        fields = '__all__'

class ForumSerializer(ModelSerializer):
    class Meta:
        model = ForumPost
        fields = '__all__'

class CommentSerializer(ModelSerializer):
    class Meta:
        model = Comment
        fields = '__all__'

class ForumCommentSerializer(ModelSerializer):
    class Meta:
        model = ForumComment
        fields = '__all__'

class AchievementSerializer(ModelSerializer):
    class Meta:
        model = Achievement
        fields = '__all__'

class UserAchievementSerializer(ModelSerializer):
    class Meta:
        model = UserAchievement
        fields = '__all__'

class FavoriteSerializer(ModelSerializer):
    class Meta:
        model = Favorite
        fields = '__all__'

class PlayerSerializer(ModelSerializer):
    class Meta:
        model = Player
        fields = '__all__'

class NewsSerializer(ModelSerializer):
    class Meta:
        model = News
        fields = '__all__'

class ChampionshipSerializer(ModelSerializer):
    class Meta:
        model = Championship
        fields = '__all__'

class ParticipantSerializer(ModelSerializer):
    class Meta:
        model = Participant
        fields = '__all__'

class SubstitutionSerializer(ModelSerializer):
    class Meta:
        model = Substitution
        fields = '__all__'

class MatchSerializer(ModelSerializer):
    class Meta:
        model = FootballMatch
        fields = '__all__'
    
class MarketValueSerializer(ModelSerializer):
    class Meta:
        model = MarketValue
        fields = '__all__'

class ReportSerializer(ModelSerializer):
    class Meta:
        model = Report
        fields = '__all__'

class RefereeSerializer(ModelSerializer):
    class Meta:
        model = Referee
        fields = '__all__'

class RefereeingSerializer(ModelSerializer):
    class Meta:
        model = Refereeing
        fields = '__all__'

class GroupSerializer(ModelSerializer):
    class Meta:
        model = Group
        fields = '__all__'

class FormationSerializer(ModelSerializer):
    class Meta:
        model = Formation
        fields = '__all__'

class GoalSerializer(ModelSerializer):
    class Meta:
        model = Goal
        fields = '__all__'

class RedCardSerializer(ModelSerializer):
    class Meta:
        model = RedCard
        fields = '__all__'

class YellowCardSerializer(ModelSerializer):
    class Meta:
        model = YellowCard
        fields = '__all__'

class PenaltySerializer(ModelSerializer):
    class Meta:
        model = Penalty
        fields = '__all__'

User = get_user_model()

class UserCreateSerializer(UserCreateSerializer):
    class Meta(UserCreateSerializer.Meta):
        model = User
        fields = ('id', 'email', 'username', 'password', 'is_staff', 'is_superuser', 'is_active', 'knownfacts', 
                'unknownfacts', 'achievements', 'fullname', 'gender', 'status', 'birthday', 'country', 'hobbies',
                'membersince', 'instagram', 'facebook', 'youtube', 'favorites', 'profilephoto')
        