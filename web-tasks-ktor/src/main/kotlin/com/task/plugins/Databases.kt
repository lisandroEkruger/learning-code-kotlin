package com.task.plugins

import io.ktor.server.application.*
import org.jetbrains.exposed.sql.Database

fun Application.configureDatabases() {
    Database.connect(
        "jdbc:postgresql://localhost:5431/db-task",
        user = "postgres",
        password = "password"
    )
}
