from rest_framework import serializers
from .models import Trabajador, Departamento

class DepartamentoSerializer(serializers.ModelSerializer):
    """Mapea la información de la Gerencia (Department en LDAP)."""
    class Meta:
        model = Departamento
        fields = ['id', 'nombre', 'descripcion']

class TrabajadorResumenSerializer(serializers.ModelSerializer):
    """Serializer ligero para mostrar nombres en Jefaturas y Equipos."""
    nombre_completo = serializers.SerializerMethodField()

    class Meta:
        model = Trabajador
        fields = ['id', 'nombre_completo', 'cargo', 'foto', 'email']

    def get_nombre_completo(self, obj):
        return f"{obj.nombre} {obj.apellido}"

class TrabajadorSerializer(serializers.ModelSerializer):
    """Serializer principal que conecta Jefatura y Gerencia."""
    # Lectura: Objetos completos para React
    gerencia_info = DepartamentoSerializer(source='departamento', read_only=True)
    jefe_directo = TrabajadorResumenSerializer(source='reporta_a', read_only=True)
    equipo_a_cargo = TrabajadorResumenSerializer(source='subordinados', many=True, read_only=True)

    class Meta:
        model = Trabajador
        fields = [
            'id', 'nombre', 'apellido', 'cargo', 'email', 'telefono', 
            'foto', 'cuenta_activa', 'departamento', 'gerencia_info',
            'reporta_a', 'jefe_directo', 'equipo_a_cargo'
        ]