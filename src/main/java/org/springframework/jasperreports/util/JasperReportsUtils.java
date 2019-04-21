package org.springframework.jasperreports.util;

import net.sf.jasperreports.engine.*;
import net.sf.jasperreports.engine.data.JRBeanArrayDataSource;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;
import net.sf.jasperreports.engine.export.HtmlExporter;
import net.sf.jasperreports.engine.export.JRCsvExporter;
import net.sf.jasperreports.engine.export.JRPdfExporter;
import net.sf.jasperreports.engine.export.JRXlsExporter;
import net.sf.jasperreports.export.*;

import java.io.OutputStream;
import java.io.Writer;
import java.util.Collection;
import java.util.Map;

public abstract class JasperReportsUtils {

    /**
     * Convert the given report data value to a {@code JRDataSource}.
     * <p>In the default implementation, a {@code JRDataSource},
     * {@code java.util.Collection} or object array is detected.
     * The latter are converted to {@code JRBeanCollectionDataSource}
     * or {@code JRBeanArrayDataSource}, respectively.
     *
     * @param value the report data value to convert
     * @return the JRDataSource (never {@code null})
     * @throws IllegalArgumentException if the value could not be converted
     * @see net.sf.jasperreports.engine.JRDataSource
     * @see net.sf.jasperreports.engine.data.JRBeanCollectionDataSource
     * @see net.sf.jasperreports.engine.data.JRBeanArrayDataSource
     */
    public static JRDataSource convertReportData(Object value) throws IllegalArgumentException {
        if (value instanceof JRDataSource) {
            return (JRDataSource) value;
        } else if (value instanceof Collection) {
            return new JRBeanCollectionDataSource((Collection<?>) value);
        } else if (value instanceof Object[]) {
            return new JRBeanArrayDataSource((Object[]) value);
        } else {
            throw new IllegalArgumentException("Value [" + value + "] cannot be converted to a JRDataSource");
        }
    }

    /**
     * Render the supplied {@code JasperPrint} instance using the
     * supplied {@code JRAbstractExporter} instance and write the results
     * to the supplied {@code Writer}.
     * <p>Make sure that the {@code JRAbstractExporter} implementation
     * you supply is capable of writing to a {@code Writer}.
     *
     * @param exporter the {@code JRAbstractExporter} to use to render the report
     * @param print    the {@code JasperPrint} instance to render
     * @param writer   the {@code Writer} to write the result to
     * @throws JRException if rendering failed
     */
    public static void render(Exporter exporter, JasperPrint print, Writer writer) throws JRException {
        exporter.setExporterInput(new SimpleExporterInput(print));
        exporter.setExporterOutput(new SimpleWriterExporterOutput(writer));
        exporter.exportReport();
    }

    /**
     * Render the supplied {@code JasperPrint} instance using the
     * supplied {@code JRAbstractExporter} instance and write the results
     * to the supplied {@code OutputStream}.
     * <p>Make sure that the {@code JRAbstractExporter} implementation you
     * supply is capable of writing to a {@code OutputStream}.
     *
     * @param exporter     the {@code JRAbstractExporter} to use to render the report
     * @param print        the {@code JasperPrint} instance to render
     * @param outputStream the {@code OutputStream} to write the result to
     * @throws JRException if rendering failed
     */
    public static void render(Exporter exporter, JasperPrint print, OutputStream outputStream) throws JRException {
        exporter.setExporterInput(new SimpleExporterInput(print));
        exporter.setExporterOutput(new SimpleOutputStreamExporterOutput(outputStream));
        exporter.exportReport();
    }

    /**
     * Render a report in CSV format using the supplied report data.
     * Writes the results to the supplied {@code Writer}.
     *
     * @param report     the {@code JasperReport} instance to render
     * @param parameters the parameters to use for rendering
     * @param writer     the {@code Writer} to write the rendered report to
     * @param reportData a {@code JRDataSource}, {@code java.util.Collection} or object array
     *                   (converted accordingly), representing the report data to read fields from
     * @throws JRException if rendering failed
     * @see #convertReportData
     */
    public static void renderAsCsv(JasperReport report, Map<String, Object> parameters, Object reportData, Writer writer) throws JRException {

        JasperPrint print = JasperFillManager.fillReport(report, parameters, convertReportData(reportData));
        render(new JRCsvExporter(), print, writer);
    }

    /**
     * Render a report in CSV format using the supplied report data.
     * Writes the results to the supplied {@code Writer}.
     *
     * @param report     the {@code JasperReport} instance to render
     * @param parameters the parameters to use for rendering
     * @param writer     the {@code Writer} to write the rendered report to
     * @param reportData a {@code JRDataSource}, {@code java.util.Collection} or object array
     *                   (converted accordingly), representing the report data to read fields from
     * @throws JRException if rendering failed
     * @see #convertReportData
     */
    public static void renderAsCsv(JasperReport report, Map<String, Object> parameters, Object reportData, Writer writer, ExporterInput exporterInputParameter)
            throws JRException {

        JasperPrint print = JasperFillManager.fillReport(report, parameters, convertReportData(reportData));
        JRCsvExporter exporter = new JRCsvExporter();
        exporter.setExporterInput(exporterInputParameter);
        render(exporter, print, writer);
    }

    /**
     * Render a report in HTML format using the supplied report data.
     * Writes the results to the supplied {@code Writer}.
     *
     * @param report     the {@code JasperReport} instance to render
     * @param parameters the parameters to use for rendering
     * @param writer     the {@code Writer} to write the rendered report to
     * @param reportData a {@code JRDataSource}, {@code java.util.Collection} or object array
     *                   (converted accordingly), representing the report data to read fields from
     * @throws JRException if rendering failed
     * @see #convertReportData
     */
    public static void renderAsHtml(JasperReport report, Map<String, Object> parameters, Object reportData, Writer writer) throws JRException {

        JasperPrint print = JasperFillManager.fillReport(report, parameters, convertReportData(reportData));
        render(new HtmlExporter(), print, writer);
    }

    /**
     * Render a report in HTML format using the supplied report data.
     * Writes the results to the supplied {@code Writer}.
     *
     * @param report            the {@code JasperReport} instance to render
     * @param parameters        the parameters to use for rendering
     * @param writer            the {@code Writer} to write the rendered report to
     * @param reportData        a {@code JRDataSource}, {@code java.util.Collection} or object array
     *                          (converted accordingly), representing the report data to read fields from
     * @param exporterParameter a {@link Map} of {@code JRExporterParameter exporter parameters}
     * @throws JRException if rendering failed
     * @see #convertReportData
     */
    public static void renderAsHtml(JasperReport report, Map<String, Object> parameters, Object reportData,
                                    Writer writer, ExporterInput exporterParameter)
            throws JRException {

        JasperPrint print = JasperFillManager.fillReport(report, parameters, convertReportData(reportData));
        HtmlExporter exporter = new HtmlExporter();
        exporter.setExporterInput(exporterParameter);
        render(exporter, print, writer);
    }

    /**
     * Render a report in PDF format using the supplied report data.
     * Writes the results to the supplied {@code OutputStream}.
     *
     * @param report     the {@code JasperReport} instance to render
     * @param parameters the parameters to use for rendering
     * @param stream     the {@code OutputStream} to write the rendered report to
     * @param reportData a {@code JRDataSource}, {@code java.util.Collection} or object array
     *                   (converted accordingly), representing the report data to read fields from
     * @throws JRException if rendering failed
     * @see #convertReportData
     */
    public static void renderAsPdf(JasperReport report, Map<String, Object> parameters, Object reportData, OutputStream stream) throws JRException {

        JasperPrint print = JasperFillManager.fillReport(report, parameters, convertReportData(reportData));
        render(new JRPdfExporter(), print, stream);
    }

    /**
     * Render a report in PDF format using the supplied report data.
     * Writes the results to the supplied {@code OutputStream}.
     *
     * @param report            the {@code JasperReport} instance to render
     * @param parameters        the parameters to use for rendering
     * @param stream            the {@code OutputStream} to write the rendered report to
     * @param reportData        a {@code JRDataSource}, {@code java.util.Collection} or object array
     *                          (converted accordingly), representing the report data to read fields from
     * @param exporterParameter a {@link Map} of {@code JRExporterParameter exporter parameters}
     * @throws JRException if rendering failed
     * @see #convertReportData
     */
    public static void renderAsPdf(JasperReport report, Map<String, Object> parameters, Object reportData, OutputStream stream, ExporterInput exporterParameter)
            throws JRException {

        JasperPrint print = JasperFillManager.fillReport(report, parameters, convertReportData(reportData));
        JRPdfExporter exporter = new JRPdfExporter();
        exporter.setExporterInput(exporterParameter);
        render(exporter, print, stream);
    }

    /**
     * Render a report in XLS format using the supplied report data.
     * Writes the results to the supplied {@code OutputStream}.
     *
     * @param report     the {@code JasperReport} instance to render
     * @param parameters the parameters to use for rendering
     * @param stream     the {@code OutputStream} to write the rendered report to
     * @param reportData a {@code JRDataSource}, {@code java.util.Collection} or object array
     *                   (converted accordingly), representing the report data to read fields from
     * @throws JRException if rendering failed
     * @see #convertReportData
     */
    public static void renderAsXls(JasperReport report, Map<String, Object> parameters, Object reportData, OutputStream stream) throws JRException {

        JasperPrint print = JasperFillManager.fillReport(report, parameters, convertReportData(reportData));
        render(new JRXlsExporter(), print, stream);
    }

    /**
     * Render a report in XLS format using the supplied report data.
     * Writes the results to the supplied {@code OutputStream}.
     *
     * @param report             the {@code JasperReport} instance to render
     * @param parameters         the parameters to use for rendering
     * @param stream             the {@code OutputStream} to write the rendered report to
     * @param reportData         a {@code JRDataSource}, {@code java.util.Collection} or object array
     *                           (converted accordingly), representing the report data to read fields from
     * @param exporterParameters a {@link Map} of {@code JRExporterParameter exporter parameters}
     * @throws JRException if rendering failed
     * @see #convertReportData
     */
    public static void renderAsXls(JasperReport report, Map<String, Object> parameters, Object reportData, OutputStream stream, ExporterInput exporterParameters)
            throws JRException {
        JasperPrint print = JasperFillManager.fillReport(report, parameters, convertReportData(reportData));
        JRXlsExporter exporter = new JRXlsExporter();
        exporter.setExporterInput(exporterParameters);
        render(exporter, print, stream);
    }
}
