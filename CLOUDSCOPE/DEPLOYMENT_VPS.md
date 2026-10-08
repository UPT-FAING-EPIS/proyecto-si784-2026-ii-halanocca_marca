# Despliegue de CloudScope con HTTPS público

El frontend utiliza Caddy y obtiene y renueva automáticamente un certificado
público para `169.58.156.169.nip.io`. No necesita Nginx ni Certbot en el host.
La directiva `tls internal` genera certificados de una autoridad privada y causa
el aviso «No es seguro» en navegadores que no confían en esa autoridad.

## Requisitos del VPS

- Docker Engine y Docker Compose instalados.
- El dominio debe resolver públicamente a la IP del VPS. Comprueba sus registros
  A y AAAA; cualquier dirección publicada debe llegar al servidor correcto.
- Los puertos TCP 80 y 443 deben estar permitidos en el firewall del proveedor y
  del VPS, y disponibles para el contenedor. Comprueba los servicios existentes
  con `sudo ss -ltnp`; resuelve cualquier conflicto antes de desplegar.
- El servidor necesita salida a Internet y resolución DNS para contactar a las
  autoridades de certificación.

## Aplicar la corrección

### VPS actual: Nginx comparte el puerto 80

En `169.58.156.169`, Nginx también sirve otra aplicación. Conserva en
`CLOUDSCOPE/.env` la variable `CLOUDSCOPE_HTTP_BIND=127.0.0.1:90` y el sitio
`/etc/nginx/sites-available/cloudscope-https`, habilitado mediante un enlace en
`sites-enabled`, con esta configuración:

```nginx
server {
    listen 80;
    server_name 169.58.156.169.nip.io;
    location / {
        proxy_pass http://127.0.0.1:90;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Nginx envía el HTTP de este dominio a Caddy, que gestiona la redirección y los
desafíos ACME. Caddy recibe HTTPS directamente en el puerto 443. Tras cambiar
Nginx, valida con `sudo nginx -t` antes de `sudo systemctl reload nginx`.
En servidores sin Nginx, omite esa variable y Compose publicará el puerto 80.
El Caddyfile se monta desde el repositorio para evitar reconstruir la imagen
cuando solo cambia la configuración; aplica esos cambios con
`docker compose exec cloudscope-frontend caddy reload --config /etc/caddy/Caddyfile --adapter caddyfile`.

### Actualización

Actualiza en el VPS `docker-compose.yml` y `cloudscope-frontend/Caddyfile` con
las versiones de este repositorio. Desde la carpeta `CLOUDSCOPE`, ejecuta:

```bash
docker compose config --quiet
docker compose build cloudscope-frontend
docker compose run --rm --no-deps cloudscope-frontend caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile
docker compose up -d --no-deps cloudscope-frontend
docker compose logs --tail=100 cloudscope-frontend
```

Estos comandos actualizan el frontend de una instalación existente; requieren
que el backend y la base de datos ya estén en ejecución. Para una instalación
nueva, ejecuta `docker compose up -d --build` para iniciar todos los servicios.

Caddy solicita el certificado público al iniciar. Los volúmenes
`cloudscope_caddy_data` y `cloudscope_caddy_config` conservan su estado entre
recreaciones. No ejecutes `docker compose down -v`: también eliminaría el volumen
de la base de datos. El puerto HTTP ahora es el 80 y redirige a HTTPS.

## Verificación

Desde un equipo externo al VPS:

```bash
curl -I http://169.58.156.169.nip.io/editor
curl -I https://169.58.156.169.nip.io/editor
```

La primera petición debe redirigir a HTTPS. La segunda debe responder sin errores
de certificado, sin usar `-k` ni desactivar la validación TLS. Abre también
`https://169.58.156.169.nip.io/editor` en el navegador y comprueba el certificado.

Si falla la emisión, revisa los logs de Caddy, DNS, puertos y posibles límites
de emisión de la autoridad. No restaures `tls internal` ni instales su autoridad
privada en los visitantes para ocultar el problema.

Referencia: [HTTPS automático de Caddy](https://caddyserver.com/docs/automatic-https).
