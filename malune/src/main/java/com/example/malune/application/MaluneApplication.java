package com.example.malune.application;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.persistence.autoconfigure.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = "com.example.malune")
@EntityScan("com.example.malune.entity")
@EnableJpaRepositories("com.example.malune.repository")
public class MaluneApplication {

    public static void main(String[] args) {
        SpringApplication.run(MaluneApplication.class, args);
    }

}
