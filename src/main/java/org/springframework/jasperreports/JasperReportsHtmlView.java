package org.springframework.jasperreports;

import net.sf.jasperreports.engine.export.HtmlExporter;
import net.sf.jasperreports.export.Exporter;

public class JasperReportsHtmlView extends AbstractJasperReportsSingleFormatView {

    public JasperReportsHtmlView() {
        setContentType("text/html");
    }

    @Override
    protected Exporter createExporter() {
        return new HtmlExporter();
    }

    @Override
    protected boolean useWriter() {
        return true;
    }

}