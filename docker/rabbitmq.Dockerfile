FROM rabbitmq:4.0.7

# Включаємо RabbitMQ Management Plugin
RUN rabbitmq-plugins enable --offline rabbitmq_management

# Створюємо ініціалізаційний скрипт
RUN echo '#!/bin/bash \n\
rabbitmqctl wait --timeout 15 $RABBITMQ_PID_FILE \n\
rabbitmqctl add_user test test 2>/dev/null || true \n\
rabbitmqctl set_user_tags test administrator \n\
rabbitmqctl set_permissions -p / test ".*" ".*" ".*" \n\
tail -f /dev/null' > /usr/local/bin/init.sh

# Надаємо права на виконання для ініціалізаційного скрипту
RUN chmod +x /usr/local/bin/init.sh

# Команда для запуску RabbitMQ серверу та ініціалізаційного скрипту
CMD ["sh", "-c", "rabbitmq-server & RABBITMQ_PID=$!; RABBITMQ_PID_FILE=/var/lib/rabbitmq/mnesia/rabbitmq.pid /usr/local/bin/init.sh"]

# Відкриваємо порти для RabbitMQ та інтерфейсу управління
EXPOSE 15672
EXPOSE 5672
