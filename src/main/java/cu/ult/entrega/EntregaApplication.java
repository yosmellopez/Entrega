package cu.ult.entrega;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.thymeleaf.ThymeleafAutoConfiguration;

@SpringBootApplication(exclude = ThymeleafAutoConfiguration.class)
public class EntregaApplication {

    public static void main(String[] args) {
        SpringApplication.run(EntregaApplication.class, args);
    }
}
