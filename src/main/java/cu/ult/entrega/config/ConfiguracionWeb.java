package cu.ult.entrega.config;

import cu.ult.entrega.AppConstants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.context.MessageSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.data.web.config.EnableSpringDataWebSupport;
import org.springframework.http.CacheControl;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.jasperreports.JasperReportsMultiFormatView;
import org.springframework.jasperreports.JasperReportsViewResolver;
import org.springframework.security.web.method.annotation.AuthenticationPrincipalArgumentResolver;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.servlet.ViewResolver;
import org.springframework.web.servlet.config.annotation.*;
import org.springframework.web.servlet.i18n.LocaleChangeInterceptor;
import org.thymeleaf.dialect.IDialect;
import org.thymeleaf.spring5.SpringTemplateEngine;
import org.thymeleaf.spring5.templateresolver.SpringResourceTemplateResolver;
import org.thymeleaf.spring5.view.ThymeleafViewResolver;
import org.thymeleaf.templatemode.TemplateMode;
import org.thymeleaf.templateresolver.ClassLoaderTemplateResolver;
import org.thymeleaf.templateresolver.ITemplateResolver;

import java.util.Collections;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.concurrent.TimeUnit;

@EnableWebMvc
@Configuration
@EnableAspectJAutoProxy
@EnableSpringDataWebSupport
@ComponentScan(basePackages = "cu.ult.entrega.control")
public class ConfiguracionWeb implements WebMvcConfigurer, ApplicationContextAware {

//    @Autowired
//    MapeadorObjetos mapeadorObjetos;

    @Autowired
    MessageSource messageSource;

    @Override
    public void configureMessageConverters(List<HttpMessageConverter<?>> converters) {
        MappingJackson2HttpMessageConverter converter = new MappingJackson2HttpMessageConverter();
//        converter.setObjectMapper(mapeadorObjetos);
        converters.add(converter);
    }

    @Bean
    public LocaleChangeInterceptor localeChangeInterceptor() {
        LocaleChangeInterceptor lci = new LocaleChangeInterceptor();
        lci.setParamName("lang");
        return lci;
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(localeChangeInterceptor());
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/assets/**", "/app/**")
                .addResourceLocations("classpath:/static/assets/", "classpath:/static/app/")
                .setCacheControl(CacheControl.maxAge(30, TimeUnit.SECONDS).cachePublic());
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**").allowedOrigins("*");
        registry.addMapping("/api/**").allowedOrigins("*");
        registry.addMapping(AppConstants.LOGOUT_URL).allowedOrigins("*");
        registry.addMapping("/imagenes/**").allowedOrigins("*");
    }

    private static final String UTF8 = "UTF-8";

    private ApplicationContext applicationContext;

    @Override
    public void setApplicationContext(ApplicationContext applicationContext) {
        this.applicationContext = applicationContext;
    }

    @Override
    public void configureViewResolvers(ViewResolverRegistry registry) {
        JasperReportsViewResolver reportsViewResolver = new JasperReportsViewResolver();
        reportsViewResolver.setPrefix("classpath:reportes/");
        reportsViewResolver.setSuffix(".jrxml");
        reportsViewResolver.setViewClass(JasperReportsMultiFormatView.class);
        reportsViewResolver.setOrder(1);
        registry.viewResolver(viewResolver());
        registry.viewResolver(reportsViewResolver);
    }

    @Bean
    public ViewResolver viewResolver() {
        ThymeleafViewResolver resolver = new ThymeleafViewResolver();
        resolver.setTemplateEngine(templateEngine());
        resolver.setOrder(0);
        resolver.setExcludedViewNames(new String[]{"reporteConcilMedicion"});
        return resolver;
    }

    @Bean
    public SpringTemplateEngine templateEngine() {
        SpringTemplateEngine engine = new SpringTemplateEngine();
        engine.setTemplateResolver(defaultTemplateResolver());
        engine.addTemplateResolver(htmlTemplateResolver());
        Set<IDialect> additionalDialects = new LinkedHashSet<>();
        engine.setAdditionalDialects(additionalDialects);
        return engine;
    }

    @Bean
    public ITemplateResolver defaultTemplateResolver() {
        SpringResourceTemplateResolver resolver = new SpringResourceTemplateResolver();
        resolver.setApplicationContext(applicationContext);
        resolver.setPrefix("classpath:templates/");
        resolver.setSuffix(".html");
        resolver.setCharacterEncoding(UTF8);
        resolver.setCacheable(false);
        resolver.setTemplateMode(TemplateMode.HTML);
        return resolver;
    }

    private ITemplateResolver htmlTemplateResolver() {
        final ClassLoaderTemplateResolver templateResolver = new ClassLoaderTemplateResolver();
        templateResolver.setOrder(2);
        templateResolver.setResolvablePatterns(Collections.singleton("html/*"));
        templateResolver.setSuffix(".html");
        templateResolver.setTemplateMode(TemplateMode.HTML);
        templateResolver.setCharacterEncoding(UTF8);
        templateResolver.setCacheable(false);
        return templateResolver;
    }

    @Override
    public void addArgumentResolvers(List<HandlerMethodArgumentResolver> argumentResolvers) {
        AuthenticationPrincipalArgumentResolver resolver = new AuthenticationPrincipalArgumentResolver();
        PageableHandlerMethodArgumentResolver phmar = new PageableHandlerMethodArgumentResolver();
        phmar.setOneIndexedParameters(true);
        phmar.setSizeParameterName("limit");
        argumentResolvers.add(resolver);
        argumentResolvers.add(phmar);
    }

    @Override
    public void configureDefaultServletHandling(DefaultServletHandlerConfigurer configurer) {
        configurer.enable();
    }

//    @Override
//    public void customize(WebServerFactory factory) {
//        setLocationForStaticAssets(factory);
//    }
//
//    private void setLocationForStaticAssets(WebServerFactory server) {
//        if (server instanceof ConfigurableServletWebServerFactory) {
//            ConfigurableServletWebServerFactory servletWebServer = (ConfigurableServletWebServerFactory) server;
//            File root;
//            String prefixPath = resolvePathPrefix();
//            root = new File(prefixPath + "target/www/");
//            if (root.exists() && root.isDirectory()) {
//                servletWebServer.setDocumentRoot(root);
//            }
//        }
//    }
//
//    private String resolvePathPrefix() {
//        String fullExecutablePath;
//        try {
//            fullExecutablePath = decode(this.getClass().getResource("").getPath(), StandardCharsets.UTF_8.name());
//        } catch (UnsupportedEncodingException e) {
//            /* try without decoding if this ever happens */
//            fullExecutablePath = this.getClass().getResource("").getPath();
//        }
//        String rootPath = Paths.get(".").toUri().normalize().getPath();
//        String extractedPath = fullExecutablePath.replace(rootPath, "");
//        int extractionEndIndex = extractedPath.indexOf("target/");
//        if (extractionEndIndex <= 0) {
//            return "";
//        }
//        return extractedPath.substring(0, extractionEndIndex);
//    }
}
