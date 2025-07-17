from django.shortcuts import redirect
from django.contrib.auth.decorators import login_required

def reseted_middleware(get_response):
    def middleware(request):
        response = get_response(request)
        if request.user.is_authenticated:
            if request.user.is_reseted and request.path != '/change-password/':
                return redirect('change-password')
        return response
    return middleware
