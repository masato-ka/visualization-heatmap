package ka.masato.thermography.app;

import lombok.extern.slf4j.Slf4j;
import org.springframework.jms.core.JmsTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.List;

@Slf4j
@Component
public class AsyncEmitData {

    private boolean isLock = true;

    private final JmsTemplate jmsTemplate;

    public AsyncEmitData(JmsTemplate jmsTemplate) {
        this.jmsTemplate = jmsTemplate;
    }


    @Async
    public void streming(SseEmitter emitter) throws IOException, InterruptedException {

        jmsTemplate.setReceiveTimeout(0);
        while (true) {
            List<Double> result = (List<Double>) jmsTemplate.receiveAndConvert("inmemory.queue");
            emitter.send(result);
            log.info("send event1");
            if (result == null) {
                break;
            }
        }
        log.info("complete sse session.");
        emitter.complete();
    }

}
