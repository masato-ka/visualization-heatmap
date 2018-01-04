package ka.masato.thermography;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class ThermographyApplication {

	public static void main(String[] args) {

		SpringApplication.run(ThermographyApplication.class, args);
	}

}
