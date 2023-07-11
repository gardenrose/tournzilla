from django.contrib import admin
from .models import Team
from .models import Achievement
from .models import User
from .models import Fact


admin.site.register(Team)
admin.site.register(Fact)
admin.site.register(Achievement)
admin.site.register(User)
