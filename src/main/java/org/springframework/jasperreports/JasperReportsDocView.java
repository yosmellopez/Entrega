package org.springframework.jasperreports;

import net.sf.jasperreports.engine.export.ooxml.JRDocxExporter;
import net.sf.jasperreports.export.*;

public class JasperReportsDocView extends AbstractJasperReportsSingleFormatView {

    public JasperReportsDocView() {
        setContentType("application/msword");
    }

    @Override
    protected Exporter createExporter() {
        return new JRDocxExporter();
    }

    @Override
    protected boolean useWriter() {
        return false;
    }

}
