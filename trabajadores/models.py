from django.db import models


class Departamento(models.Model):
    """Representa las áreas o gerencias de la empresa."""

    nombre = models.CharField(max_length=100, unique=True)
    descripcion = models.TextField(blank=True, help_text="Descripción del área")
    contacto_email = models.EmailField(blank=True)
    contacto_telefono = models.CharField(max_length=20, blank=True)

    class Meta:
        verbose_name = "Departamento"
        verbose_name_plural = "Departamentos"
        ordering = ["nombre"]

    def __str__(self):
        return self.nombre


class Trabajador(models.Model):
    """Información detallada del empleado y su jerarquía."""

    nombre = models.CharField(max_length=100)
    apellido = models.CharField(max_length=100)
    cargo = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    telefono = models.CharField(max_length=20, blank=True)
    cuenta_activa = models.BooleanField(default=True)

    # Relación con Gerencia
    departamento = models.ForeignKey(
        Departamento,
        on_delete=models.PROTECT,
        related_name="empleados",
        null=True,
        blank=True,
    )

    # Relación con Jefatura (Self-referential)
    reporta_a = models.ForeignKey(
        "self",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="subordinados",
    )

    class Meta:
        verbose_name = "Trabajador"
        verbose_name_plural = "Trabajadores"
        ordering = ["apellido", "nombre"]

    # ESTO AHORA ESTÁ ALINEADO CON "class Meta"
    def __str__(self):
        return f"{self.nombre} {self.apellido}"


# excluidos cumples
class ExcluidoCumpleanos(models.Model):
    email = models.EmailField(
        unique=True, help_text="Correo electrónico de la cuenta a excluir"
    )
    vigente = models.BooleanField(
        default=True, help_text="Indica si la exclusión está activa"
    )
    fecha_registro = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.email

