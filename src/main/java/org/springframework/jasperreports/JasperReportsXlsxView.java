package org.springframework.jasperreports;

import net.sf.jasperreports.engine.export.ooxml.JRXlsxExporter;
import net.sf.jasperreports.export.*;

public class JasperReportsXlsxView extends AbstractJasperReportsSingleFormatView {

    public JasperReportsXlsxView() {
        setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    }

    @Override
    protected Exporter createExporter() {
        return new JRXlsxExporter();
    }

    @Override
    protected boolean useWriter() {
        return false;
    }

}
