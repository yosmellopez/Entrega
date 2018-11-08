package cu.ult.entrega.config;

//import com.reservaciones.security.*;
//import com.reservaciones.security.jwt.JwtAuthenticationProvider;
//import com.reservaciones.security.jwt.JwtTokenAuthenticationProcessingFilter;
//import com.reservaciones.security.jwt.SkipPathRequestMatcher;
//import com.reservaciones.security.jwt.token.TokenExtractor;
//import com.reservaciones.MapeadorObjetos;
//import com.reservaciones.MyRequestMatcher;

import cu.ult.entrega.security.AjaxLoginProcessingFilter;
import cu.ult.entrega.security.AutenticacionAjaxExitosa;
import cu.ult.entrega.security.AutenticacionAjaxFallida;
import cu.ult.entrega.security.CustomCorsFilter;
import cu.ult.entrega.security.jwt.JwtAuthenticationProvider;
import cu.ult.entrega.security.jwt.JwtTokenAuthenticationProcessingFilter;
import cu.ult.entrega.security.jwt.SkipPathRequestMatcher;
import cu.ult.entrega.security.jwt.token.TokenExtractor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
//import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.security.core.session.SessionRegistryImpl;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.session.HttpSessionEventPublisher;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.security.web.util.matcher.OrRequestMatcher;

import java.util.Arrays;
import java.util.List;

import static cu.ult.entrega.AppConstants.*;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true, securedEnabled = true)
public class SecurityConfiguration extends WebSecurityConfigurerAdapter {

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private JwtAuthenticationProvider jwtAuthenticationProvider;

    @Autowired
    private AutenticacionAjaxFallida autenticacionAjaxFallida;

    @Autowired
    private AutenticacionAjaxExitosa autenticacionAjaxExitosa;

    @Autowired
    private TokenExtractor tokenExtractor;

    @Autowired
    private MessageSource messageSource;

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.authenticationProvider(daoAuthenticationProvider());
        auth.authenticationProvider(jwtAuthenticationProvider);
    }

    @Override
    @Bean
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }

    @Override
    public void configure(WebSecurity web) throws Exception {
        web.ignoring().antMatchers("/assets/**", "/img/**", "/images/**", "/icons/**", "/font/**", "/fonts/**", "/flaty/**", "/docs/**", "/app/**", "/theme-classic/**", "/recursos/**");
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        List<String> permitAllEndpointList = Arrays.asList(AUTHENTICATION_URL, LOGOUT_URL, REGISTRO_URL, REFRESH_TOKEN_URL, AUTHENTICATION_RESTORE_PASSWORD);
        http.csrf().disable().headers().defaultsDisabled().cacheControl().and().frameOptions().disable().and()
                .authorizeRequests()
                .antMatchers(AUTHENTICATION_URL).permitAll()
                .antMatchers(LOGOUT_URL).permitAll()
                .antMatchers("/api/auth/autenticated").permitAll()
                .antMatchers("/index.html").fullyAuthenticated()
                .and()
                .addFilterBefore(new CustomCorsFilter(), UsernamePasswordAuthenticationFilter.class)
                .addFilterBefore(buildAjaxLoginProcessingFilter(AUTHENTICATION_URL), UsernamePasswordAuthenticationFilter.class)
                .addFilterBefore(buildJwtTokenAuthenticationProcessingFilter(permitAllEndpointList, API_ROOT_URL), UsernamePasswordAuthenticationFilter.class)
                .logout().invalidateHttpSession(true).logoutRequestMatcher(new OrRequestMatcher(new AntPathRequestMatcher("/salir.html"), new AntPathRequestMatcher(LOGOUT_URL)));
//                .defaultLogoutSuccessHandlerFor(new AjaxLogoutSuccessHandler(mapeadorObjetos), new MyRequestMatcher(LOGOUT_URL, Arrays.asList(LOGOUT_URL)))
//                .defaultLogoutSuccessHandlerFor(manejadorLogout(), new AntPathRequestMatcher("/salir.html", "GET")).logoutSuccessUrl("/login.html").and()
//                .exceptionHandling()
//                .accessDeniedPage("/denegado.html").and()
//                .sessionManagement()
//                .sessionCreationPolicy(SessionCreationPolicy.STATELESS);
    }

    private AjaxLoginProcessingFilter buildAjaxLoginProcessingFilter(String defaultProcessUrl) throws Exception {
        AjaxLoginProcessingFilter filter = new AjaxLoginProcessingFilter(defaultProcessUrl, autenticacionAjaxExitosa, autenticacionAjaxFallida);
        filter.setAuthenticationManager(authenticationManagerBean());
        return filter;
    }

    private JwtTokenAuthenticationProcessingFilter buildJwtTokenAuthenticationProcessingFilter(List<String> pathsToSkip, String pattern) throws Exception {
        SkipPathRequestMatcher skipPathRequestMatcher = new SkipPathRequestMatcher(pathsToSkip, pattern);
        JwtTokenAuthenticationProcessingFilter filter = new JwtTokenAuthenticationProcessingFilter(autenticacionAjaxFallida, tokenExtractor, skipPathRequestMatcher);
        filter.setAuthenticationManager(authenticationManagerBean());
        return filter;
    }

    public AuthenticationProvider daoAuthenticationProvider() throws Exception {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(new PasswordEncoder() {
            @Override
            public String encode(CharSequence charSequence) {
                return charSequence.toString();
            }

            @Override
            public boolean matches(CharSequence charSequence, String s) {
                return true;
            }
        });
        provider.setMessageSource(messageSource);
        return provider;
    }

    @Bean
    public SessionRegistry sessionRegistry() {
        return new SessionRegistryImpl();
    }

    @Bean
    public HttpSessionEventPublisher httpSessionEventPublisher() {
        return new HttpSessionEventPublisher();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

//    @Bean
//    public ManejadorLogout manejadorLogout() {
//        return new ManejadorLogout();
//    }

}
