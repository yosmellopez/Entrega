package org.springframework.jasperreports;

import net.sf.jasperreports.export.Exporter;
import org.springframework.beans.BeanUtils;
import org.springframework.util.Assert;

public class ConfigurableJasperReportsView extends AbstractJasperReportsSingleFormatView {

    private Class<? extends Exporter> exporterClass;

    private boolean useWriter = true;


    /**
     * Set the {@code JRExporter} implementation {@code Class} to use. Throws
     * {@link IllegalArgumentException} if the {@code Class} doesn't implement
     * {@code JRExporter}. Required setting, as it does not have a default.
     */
    public void setExporterClass(Class<? extends Exporter> exporterClass) {
        Assert.isAssignable(Exporter.class, exporterClass);
        this.exporterClass = exporterClass;
    }

    /**
     * Specifies whether or not the {@code JRExporter} writes to the {@link java.io.PrintWriter}
     * of the associated with the request ({@code true}) or whether it writes directly to the
     * {@link java.io.InputStream} of the request ({@code false}). Default is {@code true}.
     */
    public void setUseWriter(boolean useWriter) {
        this.useWriter = useWriter;
    }

    /**
     * Checks that the {@link #setExporterClass(Class) exporterClass} property is specified.
     */
    @Override
    protected void onInit() {
        if (this.exporterClass == null) {
            throw new IllegalArgumentException("exporterClass is required");
        }
    }


    /**
     * Returns a new instance of the specified {@link net.sf.jasperreports.export.Exporter} class.
     * @see #setExporterClass(Class)
     * @see BeanUtils#instantiateClass(Class)
     */
    @Override
    protected Exporter createExporter() {
        return BeanUtils.instantiateClass(this.exporterClass);
    }

    /**
     * Indicates how the {@code JRExporter} should render its data.
     * @see #setUseWriter(boolean)
     */
    @Override
    protected boolean useWriter() {
        return this.useWriter;
    }

}
