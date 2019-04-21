package org.springframework.jasperreports;

import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.export.Exporter;
import net.sf.jasperreports.export.ExporterInput;
import org.springframework.jasperreports.util.JasperReportsUtils;
import org.springframework.util.CollectionUtils;
import org.springframework.web.util.WebUtils;

import javax.servlet.http.HttpServletResponse;
import java.io.ByteArrayOutputStream;
import java.util.Map;

public abstract class AbstractJasperReportsSingleFormatView extends AbstractJasperReportsView {

    @Override
    protected boolean generatesDownloadContent() {
        return !useWriter();
    }

    /**
     * Perform rendering for a single Jasper Reports exporter, that is,
     * for a pre-defined output format.
     */
    @Override
    @SuppressWarnings("unchecked")
    protected void renderReport(JasperPrint populatedReport, Map<String, Object> model, HttpServletResponse response)
            throws Exception {

        Exporter exporter = createExporter();

        Map<ExporterInput, Object> mergedExporterParameters = getConvertedExporterParameters();
        if (!CollectionUtils.isEmpty(mergedExporterParameters)) {

//            exporter.setExporterInput(mergedExporterParameters);
        }

        if (useWriter()) {
            renderReportUsingWriter(exporter, populatedReport, response);
        } else {
            renderReportUsingOutputStream(exporter, populatedReport, response);
        }
    }

    /**
     * We need to write text to the response Writer.
     *
     * @param exporter        the JasperReports exporter to use
     * @param populatedReport the populated {@code JasperPrint} to render
     * @param response        the HTTP response the report should be rendered to
     * @throws Exception if rendering failed
     */
    protected void renderReportUsingWriter(Exporter exporter, JasperPrint populatedReport, HttpServletResponse response) throws Exception {

        // Copy the encoding configured for the report into the response.
        String contentType = getContentType();
        String encoding = (String) exporter.getReportContext().getParameterValue("encoding");
        if (encoding != null) {
            // Only apply encoding if content type is specified but does not contain charset clause already.
            if (contentType != null && !contentType.toLowerCase().contains(WebUtils.CONTENT_TYPE_CHARSET_PREFIX)) {
                contentType = contentType + WebUtils.CONTENT_TYPE_CHARSET_PREFIX + encoding;
            }
        }
        response.setContentType(contentType);

        // Render report into HttpServletResponse's Writer.
        JasperReportsUtils.render(exporter, populatedReport, response.getWriter());
    }

    /**
     * We need to write binary output to the response OutputStream.
     *
     * @param exporter        the JasperReports exporter to use
     * @param populatedReport the populated {@code JasperPrint} to render
     * @param response        the HTTP response the report should be rendered to
     * @throws Exception if rendering failed
     */
    protected void renderReportUsingOutputStream(Exporter exporter, JasperPrint populatedReport, HttpServletResponse response) throws Exception {

        // IE workaround: write into byte array first.
        ByteArrayOutputStream baos = createTemporaryOutputStream();
        JasperReportsUtils.render(exporter, populatedReport, baos);
        writeToResponse(response, baos);
    }


    /**
     * Create a JasperReports exporter for a specific output format,
     * which will be used to render the report to the HTTP response.
     * <p>The {@code useWriter} method determines whether the
     * output will be written as text or as binary content.
     *
     * @see #useWriter()
     */
    protected abstract Exporter createExporter();

    /**
     * Return whether to use a {@code java.io.Writer} to write text content
     * to the HTTP response. Else, a {@code java.io.OutputStream} will be used,
     * to write binary content to the response.
     *
     * @see javax.servlet.ServletResponse#getWriter()
     * @see javax.servlet.ServletResponse#getOutputStream()
     */
    protected abstract boolean useWriter();

}
