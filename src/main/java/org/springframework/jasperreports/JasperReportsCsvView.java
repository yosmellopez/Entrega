package org.springframework.jasperreports;

import net.sf.jasperreports.engine.export.JRCsvExporter;
import net.sf.jasperreports.export.*;

public class JasperReportsCsvView extends AbstractJasperReportsSingleFormatView {

    public JasperReportsCsvView() {
        setContentType("text/csv");
    }

    @Override
    protected Exporter createExporter() {
        return new JRCsvExporter();
    }

    @Override
    protected boolean useWriter() {
        return true;
    }

}
