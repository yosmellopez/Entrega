package org.springframework.jasperreports;

import net.sf.jasperreports.engine.export.JRPdfExporter;
import net.sf.jasperreports.export.*;

public class JasperReportsPdfView extends AbstractJasperReportsSingleFormatView {

    public JasperReportsPdfView() {
        setContentType("application/pdf");
    }

    @Override
    protected Exporter createExporter() {
        return new JRPdfExporter();
    }

    @Override
    protected boolean useWriter() {
        return false;
    }

}
