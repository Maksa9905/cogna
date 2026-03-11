# Cogna

Платформа для обучения

### CI Passing

![GitHub Actions Workflow Status](https://github.com/Maksa9905/cogna.training/actions/workflows/training-ci.yml/badge.svg)
![GitHub Actions Workflow Status](https://github.com/Maksa9905/cogna/actions/workflows/backend-ci.yml/badge.svg)

## Быстрый старт

<span style="font-size: 16px; border-radius: 4px; padding: 4px; font-weight: 600; background: white; color: black">При первом запуске проекта</span>

1) Зайти в [настройки секретов в GitHub](https://github.com/Maksa9905/cogna/settings/secrets/actions)

2) Найти секреты `SSL_CERT` и `SSL_CERT_KEY`

3) Создать файлы `/nginx/certs/cert.pem` и `/nginx/certs/key.pem`

4) Скопировать содержимое:
  
    `SSL_CERT` → `/nginx/certs/cert.pem`

    `SSL_CERT_KEY` → `/nginx/certs/key.pem`

5) Добавляем запись в `/etc/hosts`
    
    5.1. Открываем `/etc/hosts` в редакторе nano редактор  
    ```
    sudo nano /etc/hosts
    ```

    5.2. Система потребует ввести пароль от аккаунта администратора

    5.3. В конце файла добавляем строчку

    ```
    127.0.0.1       www.cogna.ru
    ```

6) Запускаем docker-контейнеры

    ```bash
    docker compose up --build -d
    ```


<span style="font-size: 16px; border-radius: 4px; padding: 4px; font-weight: 600; background: purple; color: white">При последующих запусках проекта</span>

1) Запускаем docker-контейнеры

    ```bash
    docker compose up --build -d
    ```

После запуска (используй домен из сертификата — www.cogna.ru или cogna.ru):
- **Frontend**: https://www.cogna.ru/
- **GraphQL**: https://www.cogna.ru/graphql
- **pgAdmin**: https://www.cogna.ru/pgadmin/ (admin@cogna.ru / admin)

## База данных

**pgAdmin**: https://www.cogna.ru/pgadmin/
- Host: `postgres`, Port: `5432`, DB: `cogna`, User: `cogna`, Password: `cogna_dev_password`

**Прямое подключение**:
```bash
psql -h localhost -p 5433 -U cogna -d cogna
```
