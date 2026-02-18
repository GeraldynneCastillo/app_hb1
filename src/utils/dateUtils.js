
import { format, differenceInDays, isSameDay, setYear, isAfter, isBefore, startOfDay } from 'date-fns';
import { es } from 'date-fns/locale';

// Parsea la fecha de cumpleaños (DD/MM). 
// Si currentYear es true, devuelve fecha en año actual.
// Si es false, devuelve fecha en un año genérico (ej: 2000) para comparaciones de día/mes.
export const parseBirthday = (dateString, currentYear = true) => {
    if (!dateString || dateString === "[]" || dateString === "Sin fecha") return null;
    // Asume formato DD/MM
    const parts = dateString.split('/');
    if (parts.length < 2) return null;

    const today = new Date();
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Meses indexados en 0

    // Por defecto comparar con año actual
    const year = currentYear ? today.getFullYear() : 2000;
    return new Date(year, month, day);
};

// Obtiene el mes numérico (0-11) de un string de fecha para filtrado
// OJO: getMonth() devuelve 0-11. 
export const getMonthIndexFromDate = (dateString) => {
    if (!dateString || dateString === "" || dateString === "[]") return -1;
    const parts = dateString.split('/');
    // parts[1] es "01".."12". Restamos 1 para que sea 0..11
    return parts.length >= 2 ? parseInt(parts[1], 10) - 1 : -1;
};

// Obtiene el mes actual como string indexado (0-11)
export const getCurrentMonthIndex = () => {
    return new Date().getMonth();
}

// Obtiene el estado del cumpleaños con lógica estricta por semanas
export const getBirthdayStatusStrict = (dateString) => {
    const birthdayDate = parseBirthday(dateString, true); // Fecha en año actual
    if (!birthdayDate) return 'unknown';

    const today = startOfDay(new Date());
    birthdayDate.setHours(0, 0, 0, 0);

    // Si es hoy
    if (isSameDay(today, birthdayDate)) return 'today';

    const diff = differenceInDays(birthdayDate, today);

    // Pasado en el año actual
    if (diff < 0) return 'past';

    // Semana Actual: Próximos 7 días (Mañana -> Hoy + 7)
    if (diff >= 1 && diff <= 7) return 'week1';

    // Próxima Semana: Días 8 a 14
    if (diff > 7 && diff <= 14) return 'week2';

    // Siguiente Semana: Días 15 a 21
    if (diff > 14 && diff <= 21) return 'week3';

    // El resto del mes o futuro lejano
    return 'future';
};

// Formatea la fecha para mostrar en UI (ej: "12 de Febrero")
export const formatDate = (date) => {
    return format(date, "d 'de' MMMM", { locale: es });
}

// Formatea fecha completa para Header (ej: "Martes 18/02/2026")
export const formatCurrentDate = () => {
    const today = new Date();
    // Capitalizar primera letra del día
    const formatted = format(today, "EEEE dd/MM/yyyy", { locale: es });
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

// Obtiene saludo según la hora
export const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "¡Buenos días!";
    if (hour < 18) return "¡Buenas tardes!";
    return "¡Buenas noches!";
}
