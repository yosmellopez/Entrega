/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package cu.ult.entrega.util;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author Administrador
 */
public final class DateUtil {

    public static Date[] getDatesFromDate(Date fecha) {
        Date[] fechas = new Date[2];
        Calendar c = Calendar.getInstance();
        c.setTime(fecha);
        c.set(Calendar.DAY_OF_MONTH, 1);
        fechas[0] = c.getTime();
        c.set(Calendar.DAY_OF_MONTH, lastDayOfMoth(c.get(Calendar.MONTH), c.get(Calendar.YEAR)));
        fechas[1] = c.getTime();
        return fechas;
    }

    public static Date[] getYearRange(Date fecha) {
        Date[] fechas = new Date[2];
        Calendar c = Calendar.getInstance();
        c.setTime(fecha);
        c.set(Calendar.DAY_OF_MONTH, 1);
        c.set(Calendar.MONTH, 0);
        fechas[0] = c.getTime();
        c.set(Calendar.DAY_OF_MONTH, 31);
        c.set(Calendar.MONTH, 11);
        fechas[1] = c.getTime();
        return fechas;
    }

    private static int lastDayOfMoth(int mes, int year) {
        return (mes == 0 || mes == 2 || mes == 4 || mes == 6 || mes == 7 || mes == 9 || mes == 11) ? 31
                : (mes == 3 || mes == 5 || mes == 8 || mes == 10) ? 30 : (year % 4 == 0) ? 29 : 28;
    }

    public static int getYearFromDate(Date fecha) {
        Calendar c = Calendar.getInstance();
        c.setTime(fecha);
        return c.get(Calendar.YEAR);
    }

    public static int getMonthFromDate(Date fecha) {
        Calendar c = Calendar.getInstance();
        c.setTime(fecha);
        return c.get(Calendar.MONTH) + 1;
    }

    public static int getDayFromDate(Date fecha) {
        Calendar c = Calendar.getInstance();
        c.setTime(fecha);
        return c.get(Calendar.DAY_OF_MONTH);
    }

    public static boolean compareFechas(Date fecha, Date fechaFin) {
        Calendar c = Calendar.getInstance();
        c.setTime(fecha);
        int year1 = c.get(Calendar.YEAR);
        c.setTime(fechaFin);
        int year2 = c.get(Calendar.YEAR);
        return year1 == year2;
    }

    public static Date parseDate(String fecha) {
        SimpleDateFormat dateFormat = new SimpleDateFormat("MMMMM/yyyy");
        try {
            return dateFormat.parse(fecha);
        } catch (ParseException ex) {
            Logger.getLogger(DateUtil.class.getName()).log(Level.SEVERE, null, ex);
            return new Date();
        }
    }

    public static int calcularDiferenciaFechas(Date inicio, Date fin) {
        int mesInicio, diaInicio, yearInicio;
        Calendar c = Calendar.getInstance();
        c.setTime(inicio);
        diaInicio = c.get(Calendar.DATE);
        mesInicio = c.get(Calendar.MONTH);
        yearInicio = c.get(Calendar.YEAR);
        int mesFin, diaFin, yearFin;
        c.setTime(fin);
        diaFin = c.get(Calendar.DATE);
        mesFin = c.get(Calendar.MONTH);
        yearFin = c.get(Calendar.YEAR);
        return (yearFin * 365 - yearInicio * 365) - (mesFin * 30 - mesInicio * 30) - (diaFin - diaInicio);
    }

}
