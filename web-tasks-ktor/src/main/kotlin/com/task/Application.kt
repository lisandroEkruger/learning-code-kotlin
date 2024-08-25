package com.task

import com.task.plugins.*
import io.ktor.server.application.*
import com.task.model.PostgresTaskRepository

fun main(args: Array<String>) {
    io.ktor.server.netty.EngineMain.main(args)
}

fun Application.module() {
    configureSerialization(PostgresTaskRepository())
    configureDatabases()
    configureRouting()
}
