package org.springframework.jasperreports;

import net.sf.jasperreports.engine.export.ooxml.JRPptxExporter;
import net.sf.jasperreports.export.Exporter;

public class JasperReportsPptView extends AbstractJasperReportsSingleFormatView {

    public JasperReportsPptView() {
        setContentType("application/vnd.ms-powerpoint");
    }

    @Override
    protected Exporter createExporter() {
        return new JRPptxExporter();
    }

    @Override
    protected boolean useWriter() {
        return false;
    }

}
