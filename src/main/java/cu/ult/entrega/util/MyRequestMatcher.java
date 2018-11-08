/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package cu.ult.entrega.util;

import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.security.web.util.matcher.OrRequestMatcher;
import org.springframework.security.web.util.matcher.RequestMatcher;
import org.springframework.util.Assert;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.stream.Collectors;

/**
 *
 * @author Yosmel
 */
public class MyRequestMatcher implements RequestMatcher {

    private final OrRequestMatcher matchers;

    private final RequestMatcher processingMatcher;

    public MyRequestMatcher(String processingPath, List<String> pathsToMatch) {
        Assert.notNull(pathsToMatch, "The parameters to skip can not be null");
        List<RequestMatcher> requestMatchers = pathsToMatch.stream().map(path -> new AntPathRequestMatcher(path)).collect(Collectors.toList());
        matchers = new OrRequestMatcher(requestMatchers);
        processingMatcher = new AntPathRequestMatcher(processingPath);
    }

    @Override
    public boolean matches(HttpServletRequest request) {
        if (matchers.matches(request)) {
            return true;
        }
        return processingMatcher.matches(request);
    }

}
