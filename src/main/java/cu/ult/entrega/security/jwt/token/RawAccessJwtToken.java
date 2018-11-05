package cu.ult.entrega.security.jwt.token;

import cu.ult.entrega.excepcion.JwtExpiredTokenException;
import io.jsonwebtoken.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.BadCredentialsException;

public class RawAccessJwtToken implements JwtToken {
    
    private static final Logger logger = LoggerFactory.getLogger(RawAccessJwtToken.class);
    
    private final String token;
    
    public RawAccessJwtToken(String token) {
        this.token = token;
    }
    
    /**
     * Parses and validates JWT Token signature.
     *
     * @param signingKey
     * @return 
     * @throws BadCredentialsException
     * @throws JwtExpiredTokenException
     */
    public Jws<Claims> parseClaims(String signingKey) {
        try {
            return Jwts.parser().setSigningKey(signingKey).parseClaimsJws(this.token);
        } catch (UnsupportedJwtException | MalformedJwtException | IllegalArgumentException | SignatureException ex) {
            logger.error("Invalid JWT Token", ex);
            throw new BadCredentialsException("Invalid JWT token: ", ex);
        } catch (ExpiredJwtException expiredEx) {
            logger.info("JWT Token is expired", expiredEx);
            throw new JwtExpiredTokenException(this, "JWT Token expired", expiredEx);
        }
    }
    
    @Override
    public String getToken() {
        return token;
    }
}
