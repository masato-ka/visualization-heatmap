package ka.masato.thermography.app;

import lombok.extern.slf4j.Slf4j;
import org.springframework.jms.core.JmsTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.async.AsyncRequestTimeoutException;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import javax.jms.Queue;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/api/v1/thermography")
public class Controller {

    private final AsyncEmitData asyncEmitData;
    private final JmsTemplate jmsTemplate;

    private final Queue queue;

    public Controller(AsyncEmitData asyncEmitData, JmsTemplate jmsTemplate, Queue queue) {
        this.asyncEmitData = asyncEmitData;
        this.jmsTemplate = jmsTemplate;
        this.queue = queue;
    }

    @GetMapping
    public List<Double> getThermoGraphy() {

        List<Double> result = new ArrayList<>();
        for (int index = 0; index < 64; ++index) {
            result.add(32.2);
        }
        return result;

    }

    @GetMapping("/sse")
    public SseEmitter getThermoGraphySSE() throws IOException, InterruptedException {
        SseEmitter emitter = new SseEmitter(60000L);
        log.info("do Async");
        asyncEmitData.streming(emitter);
        log.info("close Async");
        return emitter;
    }

    @PostMapping
    public void postThermoGraphyTelemetory(@RequestBody List<Double> payload) {
        jmsTemplate.convertAndSend(queue, payload);
    }

    @ExceptionHandler
    @ResponseBody
    public String timeoutExceptionHandler(AsyncRequestTimeoutException asyncRequestTimeoutException) {
        log.warn(asyncRequestTimeoutException.getMessage());
        return SseEmitter.event().data("timeout async request.").build().stream()
                .map(d -> d.getData().toString())
                .collect(Collectors.joining());
    }


}
