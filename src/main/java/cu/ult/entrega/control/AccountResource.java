package cu.ult.entrega.control;

import cu.ult.entrega.clases.Usuario;
import cu.ult.entrega.security.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.persistence.EntityNotFoundException;

/**
 * REST controller for managing the current user's account.
 */
@RestController
@RequestMapping("/api")
public class AccountResource {

    private final UserService userService;

    @Autowired
    public AccountResource(UserService userService) {
        this.userService = userService;
    }

    /**
     * GET  /account : get the current user.
     *
     * @return the current user
     * @throws RuntimeException 500 (Internal Server Error) if the user couldn't be returned
     */
    @GetMapping("/account")
    public Usuario getAccount() {
        return userService.getUserWithAuthorities()
                .orElseThrow(() -> new EntityNotFoundException("User could not be found"));
    }

}
