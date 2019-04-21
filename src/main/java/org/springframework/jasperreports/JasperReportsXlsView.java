package org.springframework.jasperreports;

import net.sf.jasperreports.engine.export.JRXlsExporter;
import net.sf.jasperreports.export.*;

public class JasperReportsXlsView extends AbstractJasperReportsSingleFormatView {

    public JasperReportsXlsView() {
        setContentType("application/vnd.ms-excel");
    }

    @Override
    protected Exporter createExporter() {
        return new JRXlsExporter();
    }

    @Override
    protected boolean useWriter() {
        return false;
    }

}
