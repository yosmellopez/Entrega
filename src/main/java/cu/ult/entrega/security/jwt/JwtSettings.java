package cu.ult.entrega.security.jwt;


import cu.ult.entrega.AppProperties;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "application")
public class JwtSettings {
    
    public static final String AUTHORIZATION_HEADER = "Authorization";
    
    public static final String AUTHORIZATION_TOKEN = "access_token";
    
    private Integer tokenExpirationTime;
    
    private String tokenIssuer;
    
    private String tokenSigningKey;
    
    private Integer refreshTokenExpTime;

    public JwtSettings(AppProperties appProperties) {

    }

    public Integer getRefreshTokenExpTime() {
        return refreshTokenExpTime;
    }
    
    public void setRefreshTokenExpTime(Integer refreshTokenExpTime) {
        this.refreshTokenExpTime = refreshTokenExpTime;
    }
    
    public Integer getTokenExpirationTime() {
        return tokenExpirationTime;
    }
    
    public void setTokenExpirationTime(Integer tokenExpirationTime) {
        this.tokenExpirationTime = tokenExpirationTime;
    }
    
    public String getTokenIssuer() {
        return tokenIssuer;
    }
    
    public void setTokenIssuer(String tokenIssuer) {
        this.tokenIssuer = tokenIssuer;
    }
    
    public String getTokenSigningKey() {
        return tokenSigningKey;
    }
    
    public void setTokenSigningKey(String tokenSigningKey) {
        this.tokenSigningKey = tokenSigningKey;
    }
}
