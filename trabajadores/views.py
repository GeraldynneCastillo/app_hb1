from django.shortcuts import render
from django.http import JsonResponse
from .ldap_helpers import buscar_usuario

def lista_trabajadores(request):
    query = request.GET.get('q', '*')
    datos = buscar_usuario(query)    
    # Devolvemos la respuesta en formato JSON para que se vea en la web
    return JsonResponse({'total': len(datos), 'trabajadores': datos})
