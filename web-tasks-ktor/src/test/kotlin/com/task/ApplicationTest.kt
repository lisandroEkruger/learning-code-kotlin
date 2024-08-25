package com.task

import com.task.model.Priority
import com.task.model.Task
import com.task.model.TaskRepository
import com.task.plugins.*
import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.client.request.*
import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.json
import io.ktor.server.application.*
import io.ktor.server.testing.*
import kotlin.test.*

class ApplicationTest {

    private lateinit var client: HttpClient

    @BeforeTest
    fun setupClient() = testApplication {
        this@ApplicationTest.client = createClient {
            install(ContentNegotiation) {
                json()
            }
        }
    }

    private fun Application.setupApp(repository: TaskRepository = FakeTaskRepository()) {
        configureSerialization(repository)
        configureRouting()
    }

    @Test
    fun tasksCanBeFoundByPriority() = testApplication {
        application { setupApp() }

        val response = client.get("/tasks/byPriority/Medium")
        val results = response.body<List<Task>>()

        assertEquals(HttpStatusCode.OK, response.status)

        val expectedTaskNames = listOf("gardening", "painting")
        val actualTaskNames = results.map(Task::name)
        assertContentEquals(expectedTaskNames, actualTaskNames)
    }

    @Test
    fun invalidPriorityProduces400() = testApplication {
        application { setupApp() }

        val response = client.get("/tasks/byPriority/Invalid")
        assertEquals(HttpStatusCode.BadRequest, response.status)
    }

    @Test
    fun unusedPriorityProduces404() = testApplication {
        application { setupApp() }

        val response = client.get("/tasks/byPriority/Vital")
        assertEquals(HttpStatusCode.NotFound, response.status)
    }

    @Test
    fun newTasksCanBeAdded() = testApplication {
        application {
            module()
        }

        val client = createClient {
            install(ContentNegotiation) {
                json()
            }
        }

        val task = Task("swimming", "Go to the beach", Priority.Low)
        val response1 = client.post("/tasks") {
            header(HttpHeaders.ContentType, ContentType.Application.Json)
            setBody(task)
        }
        assertEquals(HttpStatusCode.NoContent, response1.status)

        val response2 = client.get("/tasks")
        assertEquals(HttpStatusCode.OK, response2.status)

        val taskNames = response2.body<List<Task>>().map { it.name }
        assertContains(taskNames, "swimming")
    }
}
